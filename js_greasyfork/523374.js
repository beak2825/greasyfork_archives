// ==UserScript==;
// @name         Fishhawk Enhancement
// @namespace    http://tampermonkey.net/
// @version      2024-01-10
// @description  让轻小说机翻站真正好用！
// @author       VoltaXTY
// @match        https://books.fishhawk.top/*
// @icon         http://fishhawk.top/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523374/Fishhawk%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/523374/Fishhawk%20Enhancement.meta.js
// ==/UserScript==
//一些CSS，主要用于在线阅读页的单/双栏切换
const WaitUntilSuccess = async (func, args, options = {}) => {
    const {isSuccess, interval, count} = {
        isSuccess: (result) => result,
        interval: 1000,
        count: 9999,
        ...options,
    };

    let counter = 0;
    while(counter++ < count){
        try{
            const result = await func(...args);
            if(isSuccess(result)) return result;
            else if(interval > 0) await new Promise(res => setTimeout(_ => res(), interval));
        }
        catch(err){
            console.error(err);
            await new Promise(res => setTimeout(_ => res(), interval));
        }
    }
};
const Fetch = (...args) => {
    if(args.length === 1){
        return fetch(args[0], {
            headers: {
                "authorization": "Bearer " + GetAuth(),
            }
        })
    }
    else if(args.length === 2){
        return fetch(args[0], {
            ...args[1],
            ...(args[1].headers ? {headers: {...args[1].headers, ...{"authorization": "Bearer " + GetAuth()}}} : {headers: {"authorization" : "Bearer " + GetAuth()}}),
        })
    }
};
const origin = "https://books.fishhawk.top";
const css = 
String.raw`
#chapter-content{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
}
#chapter-content > *{
    grid-column: 1 / 3;
    height: 0px;
}
#chapter-content > p.n-p {
    grid-column: revert;
    height: revert;
    margin: 0px;
}
div.n-flex.always-working > button:nth-child(1){
    background-color: #18a058;
    color: #fff;
}
`;
//插入上面的CSS
const InsertStyleSheet = (style) => {
    const s = new CSSStyleSheet();
    s.replaceSync(style);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, s];
};
InsertStyleSheet(css);
//调试用函数暴露在这个object里面
window.ujsConsole = {};
//创建新Element的便携函数
const HTML = (tagname, attrs, ...children) => {
    if(attrs === undefined) return document.createTextNode(tagname);
    const ele = document.createElement(tagname);
    if(attrs) for(const [key, value] of Object.entries(attrs)){
        if(value === null || value === undefined) continue;
        if(key.charAt(0) === "_"){
            const type = key.slice(1);
            ele.addEventListener(type, value);
        }
        else if(key === "eventListener"){
            for(const listener of value){
                ele.addEventListener(listener.type, listener.listener, listener.options);
            }
        }
        else ele.setAttribute(key, value);
    }
    for(const child of children) if(child) ele.append(child);
    return ele;
};
const GetSakuraWorkspace = () => JSON.parse(localStorage.getItem("sakura-workspace"));
const SortWorkspace = (workspace) => (workspace.jobs.sort((job1, job2) => (job1.priority ?? 20) - (job2.priority ?? 20)), workspace);
const SetSakuraWorkspace = (workspace) => {
    workspace = SortWorkspace(workspace);
    const event = new StorageEvent("storage", {
        key: "sakura-workspace",
        oldValue: JSON.stringify(GetSakuraWorkspace()),
        newValue: JSON.stringify(workspace),
        url: window.location.toString(),
        storageArea: localStorage,
    });
    localStorage.setItem("sakura-workspace", JSON.stringify(workspace));
    window.dispatchEvent(event);
};
const InsertNewJob = async (tasks, insertPos = 0) => {
    const workspace = GetSakuraWorkspace();
    if(!(tasks instanceof Array)) tasks = [tasks];
    const workspaceTasks = new Set(workspace.jobs.map(job => job.task));
    workspace.jobs.splice(insertPos, 0, ...tasks.map(task => {
        const taskstr = StringifyTask(task);
        if(workspaceTasks.has(taskstr)){
            console.log("已有任务", taskstr);
            return null;
        }
        return {
            task: taskstr,
            createdAt: new Date().getTime(),
            ...task.options,
        };
    }).filter(result => result));
    SetSakuraWorkspace(workspace);
}
const GetAuth = () => isServer ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjAxYWVlNGU4MTkwM2JiZGUzZTFkYiIsImVtYWlsIjoieGlhdGlhbnl1MjAwMkAxNjMuY29tIiwidXNlcm5hbWUiOiJWb2x0YSIsInJvbGUiOiJub3JtYWwiLCJjcmVhdGVBdCI6MTcyNzAxMTU2NiwiZXhwIjoxNzM1NTYzMTc0fQ.zUrcId4N59bhMh7I_FiduFY0Qva-ABLcmFHTaz3sA0k" :JSON.parse(localStorage.getItem("authInfo"))?.profile?.token;
const GetBlackList = () => JSON.parse((localStorage.getItem("blacklist") ?? "[]"));
const CheckForUntranslated = async (type = 1, limit = 50) => {
    const auth = GetAuth();
    const pageSize = 48;
    let page = null, pageCount = 1;
    for(let pageNumber = 1; pageNumber <= pageCount && pageNumber <= limit; pageNumber += 1){
        page = await (await Fetch(`https://books.fishhawk.top/api/wenku?page=${pageNumber - 1}&pageSize=${pageSize}&query=&level=${type}`, {
            headers: {
                "Accept": "application/json",
                "authorization": "Bearer " + auth,
            }
        })).json();
        pageCount = page.pageNumber;
        const blackList = new Set(GetBlackList());
        const itemWorker = async (item) => {
            const id = item.id;
            const detail = await (await Fetch(`https://books.fishhawk.top/api/wenku/${id}`, {
                headers: {
                    "Accept": "application/json",
                    "authorization": "Bearer " + auth,
                }
            })).json();
            for(const volume of detail.volumeJp){
                if(volume.sakura < volume.total && volume.gpt < volume.total && !blackList.has(id)){
                    InsertNewJob({
                        type: "wenku",
                        id: id,
                        bookname: volume.volumeId,
                        options: {
                            description: volume.volumeId,
                            priority: type * 10 + 10 - 10 / pageNumber,
                        },
                    }, 0);
                }
            }
        }
        await Promise.allSettled(page.items.map(item => itemWorker(item)));
    }
};
ujsConsole.CheckForUntranslated = CheckForUntranslated;
const minimumWebCheckInterval = 7200_000;
const CheckUntranslatedPopularWeb = async (limit = 100, dry = false) => {
    const auth = GetAuth();
    const lastChecked = Number(localStorage.getItem("web-checked-timestamp") ?? 0);
    const currTime = new Date().getTime();
    if(currTime - lastChecked < minimumWebCheckInterval) return;
    const pageSize = 100;
    let pageCount = 1;
    const jobs = [];
    const pointsMult = new Map([
        ["kakuyomu", x => x],
        ["syosetu", x => x * 0.1],
        ["novelup", x => x * 0.01],
        ["hameln", x => x * 0.1],
        ["alphapolis", x => x * 0.001],
    ])
    for(let pageNumber = 0; pageNumber < pageCount && pageNumber < limit; pageNumber += 1){
        const pageReq = await Fetch(`https://books.fishhawk.top/api/novel?${new URLSearchParams({
            page: pageNumber,
            pageSize: pageSize,
            query: "",
            provider: "kakuyomu,syosetu,novelup,hameln,alphapolis",
            type: 0,
            level: 1,
            translate: 0,
            sort: 1,
        })}`,{
            headers: {
                "authorization": "Bearer " + auth,
            }
        });
        const page = await pageReq.json();
        pageCount = page.pageNumber;
        await Promise.allSettled(page.items.map(async (novel) =>{
            if(!(novel.sakura < novel.jp && novel.gpt < novel.jp)) return;
            const detailReq = await Fetch(`https://books.fishhawk.top/api/novel/${novel.providerId}/${novel.novelId}`);
            const detail = await detailReq.json();
            jobs.push({
                points: detail.points,
                visited: detail.visited,
                load: novel.jp - novel.sakura,
                job: {
                    task: `web/${novel.providerId}/${novel.novelId}?level=normal&forceMetadata=false&startIndex=0&endIndex=65536`,
                    description: detail.titleZh ?? detail.titleJp,
                    createdAt: new Date().getTime(),
                    priority: 50,
                }
            })
        }))
    }
    const EvalPriority = (job) => job.points + job.visited * 10;
    jobs.sort((a, b) => EvalPriority(b) - EvalPriority(a));
    if(dry){
        console.log(jobs);
        return;
    }
};
ujsConsole.CheckUntranslatedPopularWeb = CheckUntranslatedPopularWeb;
const CheckForumUntranslated = async () => {
    const pageSize = 20;
    const forumPageReq = await Fetch(`https://books.fishhawk.top/api/article?${new URLSearchParams({
        page: 0,
        pageSize: 20,
        category: "General",
    }).toString()}`);
    const forumPage = await forumPageReq.json();
    for(const post of forumPage){
        if(post.pinned) continue;
        const pid = post.id;
        //TODO
    }
}
//添加「检查未翻译条目」按钮
const AddWenkuCheckerButton = () => {
    if(window.location.pathname !== "/wenku") return;
    document.querySelectorAll("h1").forEach((ele) => {
        if(ele.hasAttribute("modified") || ele.textContent !== "文库小说") return;
        ele.setAttribute("modified", "");
        ele.insertAdjacentElement("afterend",
            HTML("button", {class: "n-button n-button--default-type n-button--medium-type", "_click": CheckForUntranslated}, "检查未翻译条目")
        );
    });
}
const ExtendWorkerItem = () => {
    if(window.location.pathname !== "/workspace/sakura") return;
    document.querySelectorAll("button.__button-131ezvy-dfltmd.n-button.n-button--default-type.n-button--tiny-type.n-button--secondary").forEach((ele) => {
        const parent = ele.parentElement;
        if(parent.hasAttribute("modified")) return;
        parent.setAttribute("modified", "");
        ele.parentElement.insertAdjacentElement("afterbegin",
            HTML("button", {class: "__button-131ezvy-dfltmd n-button n-button--default-type n-button--tiny-type n-button--secondary", tabindex: 0, type: "button", _click: () => {
                if(parent.classList.contains("always-working")) parent.classList.remove("always-working");
                else parent.classList.add("always-working");
            }}, "始终工作")
        );
    });
}
const RunStalledWorker = () => {
    if(window.location.pathname !== "/workspace/sakura"){ return; }
    let runningCount = GetRunningCount();
    const workspace = GetSakuraWorkspace();
    const jobCount = (workspace.jobs?.length) ?? 0;
    document.querySelectorAll("div.n-flex.always-working").forEach((ele) => {
        if(runningCount >= jobCount) return;
        const child = ele.children[1];
        if(child.textContent !== " 停止 "){
            runningCount += 1;
            child.click();
        }
    });
    if(runningCount >= 5) fetch("http://localhost:17353/end-sharing");
    else if(runningCount < 5) fetch("http://localhost:17353/start-sharing");
};
const GetRunningCount = () => {
    let ret = 0;
    document.querySelectorAll("div.n-flex.always-working").forEach((ele) => {
        if(ele.children[1].textContent === " 停止 ") ret += 1;
    });
    return ret;
}
const RetryFailedTasks = () => {
    if(window.location.pathname !== "/workspace/sakura") return;
    const workspace = GetSakuraWorkspace();
    const workspaceClone = structuredClone(workspace);
    if(!workspace.uncompletedJobs) return;
    for(let i = 0; i < workspace.uncompletedJobs.length;){
        const completed = workspace.uncompletedJobs[i];
        if(!completed.progress || completed.progress.finished < completed.progress.total){
            console.log("发现未完成任务：", completed);
            workspace.uncompletedJobs.splice(i, 1);
            workspace.jobs.splice(0, 0, {
                task: completed.task,
                description: completed.description,
                createdAt: new Date().getTime(),
                priority: 0,
                ...completed.progress ? {progress: {
                    finished: 0,
                    error: 0,
                    total: completed.progress.total - completed.progress.finished,
                }} : {},
            });
        }
        else i++;
    }
    SetSakuraWorkspace(workspace);
    const event = new StorageEvent("storage", {
        key: "sakura-workspace",
        oldValue: JSON.stringify(workspaceClone),
        newValue: JSON.stringify(workspace),
        url: window.location.toString(),
        storageArea: localStorage,
    });
    window.dispatchEvent(event);
};
const TaskDetailAPI = (job) => {
    const task = job.task ?? job;
    const taskURL = new URL(`${origin}/${task}`);
    const path = taskURL.pathname.split("/");
    if(path[1] === "wenku"){
        return queryURL = `${origin}/api/wenku/${path[2]}/translate-v2/sakura/${path[3]}`;
    }
    else if(path[1] === "web"){
        return queryURL = `${origin}/api/novel/${path[2]}/${path[3]}/translate-v2/sakura`;
    }
};
let RemoveFinishedLock = false;
const RemoveFinishedTasks = async () => {
    if(window.location.pathname !== "/workspace/sakura") return;
    if(RemoveFinishedLock) return;
    RemoveFinishedLock = true;
    try{
        const workspace = GetSakuraWorkspace();
        const toRemove = new Set();
        if(!workspace.jobs) return;
        const querys = new Set(workspace.jobs.map(TaskDetailAPI).filter(url => url));
        const queryResults = [...querys.keys()].map(async url => {
            try{
                const response = await Fetch(url, {headers: {"Accept": "application/json"}});
                if(response.status === 404) return [url, 404];
                else return [url, await response.json()];
            }
            catch(e){
                return [url, "error"];
            }
        });
        const queryResultMap = new Map(await Promise.all(queryResults));
        workspace.jobs.forEach((job) => {
            if(job.progress && job.progress.finished >= job.progress.total){
                console.log("发现已完成任务：", job);
                toRemove.add(job.task);
                return;
            }
            const query = TaskDetailAPI(job);
            const result = queryResultMap.get(query);
            if(!result){
                console.warn("???", job);
                return;
            }
            else if(result === "error") return;
            else if(result === 404){
                console.log("发现不存在任务", job);
                toRemove.add(job.task);
                return;
            }
            const hasUnfinished = GetUntranslated(job.task, result);
            if(hasUnfinished) return;
            console.log("发现已完成任务：", job);
            toRemove.add(job.task);
        });
        const currWorkspace = GetSakuraWorkspace();
        for(let i = 0; i < currWorkspace.jobs.length;){
            const job = currWorkspace.jobs[i];
            if(toRemove.has(job.task)){
                currWorkspace.jobs.splice(i, 1);
                currWorkspace.uncompletedJobs.splice(-1, 0, {
                    task: job.task,
                    description: job.description,
                    createdAt: job.createdAt,
                    finishedAt: new Date().getTime(),
                    progress: {
                        finished: 999,
                        error: 0,
                        total: 999,
                    },
                    priority: 0 ,
                });
            }
            else i++;
        }
        SetSakuraWorkspace(currWorkspace);
    }finally{
        setTimeout(() => RemoveFinishedLock = false, 5000);
    }
};
//在线小说阅读器里，存在一部分<br>元素非常麻烦，替换为空的<p class="line-break">元素
const ReplaceBrElement = () => {
    if(!window.location.pathname.startsWith("/novel")) return;
    console.log("ReplaceBr");
    document.querySelectorAll("#chapter-content > br").forEach((br) => {
        br.replaceWith(HTML("p", {class: "line-break"}));
    })
};
let _CheckNewWenkuLockLock = false;
let _SkipNextCheckNewWenkuCall = false;
const CheckNewWenkuChannel = new BroadcastChannel("CheckNewWenku");
CheckNewWenkuChannel.addEventListener("message", (ev) => {
    if(ev.data === "Checked" && ev.origin === origin){
        _SkipNextCheckNewWenkuCall = true;
    }
})
const GetUntranslated = (task, query, getIndex = false) => {
    const taskURL = new URL(`${origin}/${task}`);
    const isNormal = taskURL.searchParams.has("level", "normal");
    const isRetranslate = !isNormal && !taskURL.searchParams.has("level", "expire");
    const startIndex = taskURL.searchParams.get("startIndex") ?? 0;
    const endIndex = taskURL.searchParams.get("endIndex") ?? 65535;
    const glossaryId = query.glossaryUuid ?? query.glossaryId;
    const indexes = !query.toc ? [] : 
        query.toc
        .filter(chap => chap.chapterId !== undefined)
        .map((chap, index) => {return {...chap, index: index, ...(chap.glossaryUuid ? {glossaryId: chap.glossaryUuid} : {})}})
        .filter((_, index) => index >= startIndex && index < endIndex)
        .filter(chap => isRetranslate ? true : (isNormal ? chap.glossaryId === undefined : (chap.glossaryId !== glossaryId && chap.glossaryId !== undefined)))
    if(getIndex) return indexes.map(chap => chap.index);
    else if(indexes.length > 0) return true;
    else return false;
};
const CheckNewWenku = () => {
    if(_CheckNewWenkuLockLock || window.location.pathname !== "/workspace/sakura") return;
    const Worker = async () => {
        try{
            if(_SkipNextCheckNewWenkuCall){
                _SkipNextCheckNewWenkuCall = false;
            }
            else{
                console.log("检查未翻译新文库本");
                await CheckForUntranslated(1, 1);
                await CheckForUntranslated(2, 1);
                await CheckForUntranslated(3, 1);
                CheckNewWenkuChannel.postMessage("Checked");
            }
        }
        finally{
            setTimeout(Worker, 5000);
        }
    };
    setTimeout(Worker, 5000);
    _CheckNewWenkuLockLock = true;
};
const AddJobQueuer = () => {
    if(!window.location.pathname.startsWith("/novel")) return;
    const ele = document.querySelector("button.__button-131ezvy-lmmd.n-button.n-button--default-type.n-button--medium-type");
    if(!ele || ele.hasAttribute("modified")) return;
    ele.setAttribute("modified", "");
    const 范围 = [...document.querySelectorAll("span.n-text.__text-131ezvy-d3")].find(ele => ele.textContent === "范围");
    if(!范围) return;
    const startInput = 范围.nextElementSibling.children[0].children[0].children[1].children[0].children[0].children[0].children[0];
    const endInput = 范围.nextElementSibling.children[0].children[0].children[3].children[0].children[0].children[0].children[0];
    ele.insertAdjacentElement("afterend",
        HTML("button", {
            class: "__button-131ezvy-lmmd n-button n-button--default-type n-button--medium-type",
            tabindex: "1",
            type: "button",
            _click: async () => {
                const paths = window.location.pathname.split("/");
                const [ , , provider, id] = paths;
                const title = document.querySelector("h3 a.n-a.__a-131ezvy").textContent;
                let mode = "normal", metadata = false;
                document.querySelectorAll(".__tag-131ezvy-ssc,.__tag-131ezvy-wsc").forEach(div => {switch(div.textContent){
                    case "常规": mode = "normal"; break;
                    case "过期": mode = "expire"; break;
                    case "重翻": mode = "all"; break;
                    case "源站同步": mode = "sync"; break;
                    case "重翻目录": metadata = true; break;
                }});
                const taskObj = {
                    type: "web",
                    provider: provider,
                    id: id,
                    startIndex: Number(startInput.value),
                    endIndex: Number(endInput.value),
                    mode: mode,
                    forceMetadata: metadata,
                };
                const queryURL = `${origin}/api/novel/${provider}/${id}/translate-v2/sakura`;
                const query = await Fetch(queryURL);
                const queryResult = await query.json();
                InsertNewJob(GetUntranslated(StringifyTask(taskObj), queryResult, true).map(index => ({
                    ...taskObj,
                    startIndex: index,
                    endIndex: index + 1,
                    options: {
                        description: title,
                        priority: 5 + index / 1000,
                    },
                })), 0);
            },
        }, "逐章排队")
    );
}
const ParseTask = (taskstr) => {
    const [pathname, paramstr] = taskstr.split("?")
    const paths = pathname.split("/");
    const param = new URLSearchParams(paramstr ?? "");
    return {
        ...(paths[0] === "web" ? {
            type: "web",
            provider: paths[1],
            id: paths[2],
        } : paths[0] === "wenku" ? {
            type: "wenku",
            id: paths[1],
            bookname: paths[2],
        } : {
            path: pathname,
        }),
        startIndex: Number(param.get("startIndex") ?? 0),
        endIndex: Number(param.get("endIndex") ?? 65535),
        mode: pathname.get("level") ?? "normal",
        forceMetadata: Boolean(pathname.get("forceMetadata") ?? false),
    };
};
const StringifyTask = (taskobj) => {
    return `${taskobj.type === "web" ? `web/${taskobj.provider}/${taskobj.id}` : taskobj.type === "wenku" ? `wenku/${taskobj.id}/${taskobj.bookname}` : taskobj.path}?level=${taskobj.mode ?? "normal"}&forceMetadata=${taskobj.forceMetadata ?? false}&startIndex=${taskobj.startIndex ?? 0}&endIndex=${taskobj.endIndex ?? 65535}`
}
const MergeFinishedTasks = () => {
    const workspace = GetSakuraWorkspace();
}
const AddCustomSearchTag = () => {
    const target = document.querySelector("div.n-tag");
    if(!target || target.hasAttribute("modified")) return;
    target.setAttribute("modified", "");
    const text = "-TS -性転換 -男の娘 -ＴＳ";
    target.insertAdjacentElement("beforebegin", 
        HTML("div", {class: "n-tag __tag-131ezvy-ssc", style: "cursor: pointer;", modified: "", _click: () => {
            const input = document.querySelector("input.n-input__input-el");
            input.value = input.value + "" + text;
        }},
            HTML("span", {}, text)
        )
    )
}
const AdvancedSearch = () => {
    const loc = window.location.toString();
    if(!(loc.includes("query") && loc.includes("novel"))) return;
    document.querySelectorAll(".n-list-item").forEach(item => {
        if(item.hasAttribute("modified")) return;
        item.setAttribute("modified", "");
        const link = item.children[0].children[0].children[2];
        const [provider, id] = link.textContent.split(".");
        const main = item.children[0];
        main.insertAdjacentElement("afterend",
            HTML("button", {class: "expand-detail", _click: async (ev) => {
                const target = ev.target;
                const detailReq = await WaitUntilSuccess(Fetch, [`https://books.fishhawk.top/api/novel/${provider}/${id}`], {isSuccess: res => res.status === 200});
                const detail = await detailReq.json();
                target.replaceWith(
                    HTML("div", {class: "detail-container"},
                        HTML("div", {class: "detail-meta"}, `${detail.points} pt / ${detail.visited} 点击 / ${detail.totalCharacters}`),
                        HTML("div", {class: "detail-description"}, detail.introductionZh ?? detail.introductionJp)
                    )
                )
            }}, "显示详情")
        )
    })
}
//页面变化时立刻调用上面的功能
const OnMutate = async (mutlist, observer) => {
    observer.disconnect();  //避免无限嵌套
    if(isServer) return;
    ReplaceBrElement();
    AdvancedSearch();
    AddWenkuCheckerButton();
    AddJobQueuer();
    ExtendWorkerItem();
    RunStalledWorker();
    RetryFailedTasks();
    RemoveFinishedTasks();
    //MergeFinishedTasks();
    //StartCustomTranslator(9);
    observer.observe(document, {subtree: true, childList: true});
};
new MutationObserver(OnMutate).observe(document, {subtree: true, childList: true});
console.log("hello world");

const Range = (start, end) => {
    if(end < start) throw new RangeError("end should >= start");
    const arr = new Array(end - start);
    for(let i = start; i < end; i++){
        arr[i - start] = i;
    }
    return arr;
}

const FetchForumPosts = async () => {
    const pageSize = 100;
    const MakePageLink = pageNum => `/api/article?page=${pageNum}&pageSize=${pageSize}&category=General`;
    const MakeTopicLink = topicId => `/api/article/${topicId}`;
    const MakeReplyLink = (pageNum, topicId) => `/api/comment?site=article-${topicId}&pageSize=${pageSize}&page=${pageNum}`;
    const firstPageReq = await Fetch(MakePageLink(0));
    const firstPage = await firstPageReq.json();
    const pageCount = firstPage.pageNumber;
    const topics = [firstPage.items];
    topics.push(...(await Promise.all(Range(1, pageCount).map(async index => {
        const req = await Fetch(MakePageLink(index));
        const res = await req.json();
        return res.items;
    }))).flat());
    console.log(topics);
    const replies = (await Promise.all(topics.map(async topic => {
        try{
        const req = await Fetch(MakeTopicLink(topic.id));
        const res = await req.json();
        const repreq = await Fetch(MakeReplyLink(0, topic.id));
        const rep = await repreq.json();
        return [res, ...rep.items, ...rep.items.flatMap(item => item.replies)];
        }catch(e){
            return [];
        }
    }))).flat();
    window.localStorage.setItem("result", JSON.stringify([topics, replies]));
    return [topics, replies];
}
ujsConsole.GetItem = (key) => JSON.parse(window.localStorage.getItem(key));
ujsConsole.SetItem = (key, value) => window.localStorage.setItem(key, JSON.stringify(value));
ujsConsole = {
    ...ujsConsole,
    GetSakuraWorkspace: GetSakuraWorkspace,
    SetSakuraWorkspace: SetSakuraWorkspace,
}