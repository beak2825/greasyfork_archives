// ==UserScript==
// @name         霹雳评论区成分指示器
// @namespace    me.valstrax.markusslugia
// @version      0.7.0
// @description  B站评论区用户自动/手动查成分
// @author       markusslugia
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451245/%E9%9C%B9%E9%9B%B3%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451245/%E9%9C%B9%E9%9B%B3%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const filters = [
        // 在这里定义标签规则

        {
            tag: "抽奖人",
            keywords: [["抽", "转"], ["送", "中"], "送我"]
            // 最基础的规则由tag和keywords组成
            // tag为标记显示的文字，而keywords为识别用的关键词
        },

        {
            tag: "农批",
            keywords: ["王者荣耀", "王者", "农药", ["星耀", "上分"], "阿轲"],
            // keywords Array中可以有多个OR逻辑的关键词，其中再使用[数组]包裹的部分为AND逻辑
            // 比如说，以上代码将匹配“来玩王者荣耀”、“我玩阿轲”，但不会匹配“今天我要上分”
            color: "#E03050"
            // 可以单独指定标签颜色，别忘了在前面加“#”嗼！
        },

        {
            tag: "粥粥壬",
            regex: /(?=.*明日方舟).*|(?=.*罗德岛).*|(?=.*原石)(?=.*理智).*|(?=.*作战)(?=.*理智).*|(?=.*刀客塔).*|(?=.*海猫)(?!.*海猫鸣泣).*$/,
            // 如果有需求，也可以直接指定编写好的正则
            // regex和keywords同时存在的情况下，regex优先级更高嗼！
            color: "#3060F0"
        },

        {
            tag: "是彗宝粉丝捏",
            filter: (input) => input.match(/(?=.*天彗).*|(?=.*银翼凶星).*|(?=.*天慧).*$/),
            // 还有更加离谱的需求？没问题，也可以通过filter直接传入匹配函数！
            // 函数传入的参数为检测的动态文本
            // 函数返回true或其他会被判为真的值代表匹配成功，否则代表不匹配
            // filter的优先级高于regex和keyword
            color: "linear-gradient(to top left, #606080, #E00230 75%, #E00042)"
            // 也可以传入其他css background支持的格式。
        },

        {
            // 越靠后的标签会越先被匹配到嗼！
            tag: "我焯，原",
            keywords: ["原神", "可莉", "满命", ["旅行者", "蒙德"], "璃月", "稻妻", "须弥", ["七七", "椰奶"], "钟离"],
            color: "#EBA434"
        },

        // 不论添加顺序如何，merge规则总是在filter后起效
        // 因此写在后面也不用担心
        // 不过merge规则列表本身也会有先后顺序，要注意嗼

        {
            tag: "双P合璧",
            merge: ["我焯，原", "农批"],
            // 使用merge来合并标签，两个标签同时出现时即合并为此merge标签
            color: "linear-gradient(to top left, #E03050, #EBA434 75%, #EBA434)"
        },

        {
            tag: "二刺螈奔赴",
            merge: ["我焯，原", "粥粥壬"],
            color: "linear-gradient(to top left, #3060F0, #34DB9A 75%, #84DB6A)"
        },

        {
            tag: "不喜欢原",
            merge: ["粥粥壬", "农批"],
            color: "linear-gradient(to top left, #3060F0, #E03050 75%, #E03050)"
        },

        {
            tag: "三角力量",
            merge: ["我焯，原", "粥粥壬", "农批"],
            // 越靠后的merge标签会越先匹配到，匹配到后会立即清除被merge的标签
            // 比如说，假如“不喜欢原”先于“三角力量”被匹配，则“三角力量”永远无法被匹配到
            // 因为匹配所需的其中两个标签必定会被“不喜欢原”抢先清除掉
            // 因此，包含更多标签的merge规则应该处于更靠后的位置
            color: "linear-gradient(to top left, #3060F0, #EA4A5F 45%, #EB5854 50%, #EBA434 90%)"
        },
    ];

    const options = {
        // 可以指定选项（当然也可以不指定）

        interval: 3000,
        // interval指定脚本检查评论区的间隔，以毫秒为单位。
        // 1000毫秒等于1秒嗼！

        multiTag: true,
        // multiTag指定是否允许给同一个人打多个标签。
        // 设为false时，一个用户名后面只会显示优先级最高的一个标签。

        lazy: false,
        // 启用lazy模式后，将不会自动查询评论区用户主页内容。
        // 用户名后会显示一个查成分按钮，点击即可查该用户成分。
        // 如果网络环境差，则可以考虑手动开启lazy模式。

        pageLoad: 1,
        // pageLoad指定加载动态的页数。
        // 由于B站API的限制，一次请求只能加载12条动态，默认是最新的12条。
        // 要加载更老的动态，需要再次发起请求。这样会导致查成分的时间成倍增长。
        // 因此，除非对自己的网络很有信心，建议仅加载1-2页。
        // 或者也可以开启lazy模式，然后设置为加载更多页。

        defaultColor: "#202020",
        // defaultColor指定标签规则内未指定颜色时的默认颜色。

        emptyText: "纯洁的路人",
        // emptyText指定未匹配到的默认文本，默认为空。
        // 为空时，未匹配到的用户将不会显示标签。

        emptyColor: "#FF8AA0"
        // emptyColor指定默认文本的颜色，指定默认文本后才有效果。
    };


    // ==================================================
    //       不建议改动下面的内容，除非你很清楚你在做什么
    // ==================================================

    class UserFilter {
        constructor(allTags, options = {}) {

            const { interval, multiTag, lazy, pageLoad, defaultColor, emptyText, emptyColor } = options;
            this.interval = interval ? interval : 3000;
            this.multiTag = multiTag ? true : false;
            this.lazy = lazy ? true : false;
            this.pageLoad = pageLoad ? pageLoad : 1;
            this.defaultColor = defaultColor ? defaultColor : "#1060FF";
            this.emptyText = emptyText ? emptyText : "";
            this.emptyColor = emptyColor ? emptyColor : defaultColor;
            this.elFiltStateKey = "silver-jet-engine-dragon-" + Math.random().toString().replace(".", "v");
            this.pidList = new Set();

            let styleNode = document.createElement("style");
            styleNode.innerHTML =
                `.${this.elFiltStateKey}{`
                + "display:inline;"
                + "color:white;"
                + "margin-left:2px;"
                + "padding:2px 4px;"
                + "height:100%;"
                + "}"
                + `.${this.elFiltStateKey}:first-of-type{`
                + "border-top-left-radius:20px;"
                + "border-bottom-left-radius:20px;"
                + "margin-left:8px;"
                + "padding-left:6px;"
                + "}"
                + `.${this.elFiltStateKey}:last-of-type{`
                + "border-top-right-radius:20px;"
                + "border-bottom-right-radius:20px;"
                + "margin-right:2px;"
                + "padding-right:6px;"
                + "}";
            document.head.appendChild(styleNode);

            this.emptyEl = document.createElement("div");
            if (this.emptyText != "") {
                this.emptyEl.className = this.elFiltStateKey;
                this.emptyEl.innerHTML = emptyText;
            }
            else {
                this.emptyEl.setAttribute(this.elFiltStateKey, this.elFiltStateKey);
            }
            this.emptyEl.style.fontWeight = "bold";
            this.emptyEl.style.backgroundColor = this.emptyColor;

            if (this.lazy) {
                this.elFiltPromptKey = "green-insect-electric-dragon-" + Math.random().toString().replace(".", "v");
                this.promptEl = document.createElement("div");
                this.promptEl.className = this.elFiltPromptKey;
                this.promptEl.innerHTML = "查成分";
                let styleNodePrompt = document.createElement("style");
                styleNodePrompt.innerHTML =
                    `.${this.elFiltPromptKey}{`
                    + "display:inline;"
                    + "color:#2060FF;"
                    + "background-color:rgba(16,96,255,0.1);"
                    + "border-radius:20px;"
                    + "border:1px solid #2060FF;"
                    + "margin-left:6px;"
                    + "padding:1px 5px;"
                    + "cursor:pointer;"
                    + "}";
                document.head.appendChild(styleNodePrompt);
            }

            if (Array.isArray(allTags)) {
                for (const tagOptions of allTags) {
                    this.addFilter(tagOptions);
                }
            }
        };

        filters = [];
        merges = [];
        pidDict = {};
        blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid=';

        addFilter(options) { //{tag,keywords/regex/filter,color}

            if (typeof options.tag != "string") {
                console.error("某个传入标签的tag缺失或有误，因此未添加这个标签。请排查。");
                return;
            }

            let element = this.emptyEl.cloneNode(false);
            element.className = this.elFiltStateKey;
            element.style.background = options.color ? options.color : this.defaultColor;
            element.innerHTML = options.tag;

            if (Array.isArray(options.merge)) {
                let mergeFunction = (tagNodes) => {
                    let check = true;
                    let removes = [];
                    tagLoop: for (const tag of options.merge) {
                        let removeIndex = -1;
                        nodeLoop: for (let index = 0; index < tagNodes.length; index++) {
                            if (tagNodes[index].innerHTML == tag) {
                                removeIndex = index;
                                break nodeLoop;
                            }
                        }
                        if (removeIndex != -1) {
                            removes.push(removeIndex);
                        }
                        else {
                            check = false;
                            break tagLoop;
                        }
                    }
                    if (check) {
                        removes.sort((a, b) => b - a);
                        for (const removeIndex of removes) {
                            tagNodes.splice(removeIndex, 1);
                        }
                        return true;
                    }
                    else return false;
                };
                this.merges.unshift({
                    tag: element,
                    merge: mergeFunction
                });
            }
            else if (typeof options.filter == "function") {
                this.filters.unshift({
                    tag: element,
                    filter: options.filter
                });
            }
            else if (options.regex instanceof RegExp) {
                this.filters.unshift({
                    tag: element,
                    filter: input => input.match(options.regex)
                });
            }
            else if (Array.isArray(options.keywords)) {
                let regex = UserFilter.regexBuilder(options.keywords);
                this.filters.unshift({
                    tag: element,
                    filter: input => input.match(regex)
                });
            }
            else if (typeof options.keywords == "string") {
                let regex = UserFilter.regexBuilder([options.keywords]);
                this.filters.unshift({
                    tag: element,
                    filter: input => input.match(regex)
                });
            }
            else console.error("传入标签 \"" + options.tag + "\"的过滤条件缺失或有误，因此未添加这个标签。");
        }

        static regexBuilder(keywords) {
            let regexText = "^";
            for (const keyword of keywords) {
                let rule = "";
                if (regexText != "^") rule += "|";
                if (Array.isArray(keyword)) {
                    for (const andKeyword of keyword) {
                        rule += `(?=.*${andKeyword})`;
                    }
                } else {
                    rule += `(?=.*${keyword})`;
                }
                rule += ".*";
                regexText += rule;
            }
            regexText += "$";
            return new RegExp(regexText);
        }

        requestPosts(pid, offset) {
            return new Promise((resolve, reject) => {
                if (this.pidDict[pid] != undefined) {
                    resolve(this.pidDict[pid]);
                    return;
                }
                let offsetQuery = offset ? "&offset=" + offset : "";
                let blogurl = this.blog + pid + offsetQuery;
                GM_xmlhttpRequest({
                    method: "get",
                    url: blogurl,
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                    },
                    onload: function (res) {
                        if (res.status === 200) {
                            resolve(JSON.parse(res.response).data);
                        } else {
                            reject();
                        }
                    },
                });
            });
        }

        async filterPid(pid, pages = 1) {
            let offset = "";
            let postTexts = [];
            let retry = 0;
            for (let i = 0; i < pages; i++) {
                try {
                    let data = await this.requestPosts(pid, offset);
                    if (data.has_more) {
                        offset = parseInt(data.offset) + 1;
                    } else {
                        i = pages;
                    }
                    for (const item of data.items) {
                        let concatString = "";
                        if (item.modules.module_dynamic.desc) {
                            concatString += JSON.stringify(item.modules.module_dynamic.desc.text);
                        }
                        if (item.orig && item.orig.modules.module_dynamic.desc) {
                            concatString += JSON.stringify(item.orig.modules.module_dynamic.desc.text);
                        }
                        postTexts.push(concatString);
                    }
                } catch {
                    if (retry < 3) {
                        retry += 1;
                        console.error("PID" + pid + "的第" + (i + 1) + "页动态请求失败，第" + retry + "次，最多重试3次");
                        i -= 1;
                    }
                    else return;
                }
            }

            this.pidList.delete(pid);
            let filtedNodes = [];
            filterLoop: for (const filter of this.filters) {
                postLoop: for (const post of postTexts) {
                    if (filter.filter(post)) {
                        filtedNodes.push(filter.tag);
                        break postLoop;
                    }
                }
            }
            let mergedNodes = [];
            mergeLoop: for (const merge of this.merges) {
                if (merge.merge(filtedNodes)) {
                    mergedNodes.push(merge.tag);
                };
            }
            let tagNodes = mergedNodes.concat(filtedNodes);
            if (tagNodes.length) {
                if (this.multiTag) this.pidDict[pid] = tagNodes;
                else this.pidDict[pid] = tagNodes.slice(-1);
            }
            else {
                this.pidDict[pid] = [this.emptyEl];
            }
        }

        static getPid(item) {
            let pid = item.getAttribute("data-user-id");
            if (!pid) pid = item.getAttribute("data-usercard-mid");
            if (!pid) pid = 114514;
            return pid;
        }

        static getCommentList() {
            return document.querySelectorAll(".user-name,.sub-user-name,.user>.name");
        };

        addPids(commentList) {
            for (const item of commentList) {
                let pid = UserFilter.getPid(item);
                if (this.pidDict[pid] == undefined) {
                    this.pidList.add(UserFilter.getPid(item));
                }
            }
        }

        updateDom(commentList) {
            commentList.forEach(item => {
                if (item.innerHTML.indexOf(this.elFiltStateKey) == -1) {
                    let pid = UserFilter.getPid(item);
                    if (this.pidDict[pid] != undefined) {
                        if (this.lazy) {
                            try {
                                item.removeChild(item.querySelector("." + this.elFiltPromptKey));
                            }
                            catch { void (0); }
                        }
                        if (this.pidDict[pid]) {
                            for (const element of this.pidDict[pid]) {
                                item.appendChild(element.cloneNode(true));
                            }
                        }
                    }
                    else if (this.lazy && item.innerHTML.indexOf(this.elFiltPromptKey) == -1) {
                        let newEl = this.promptEl.cloneNode(true);
                        newEl.onclick = (event) => {
                            event.cancelBubble = true;
                            event.preventDefault();
                            if (event.stopPropagation) event.stopPropagation();
                            this.lazyCheck(event);
                        };
                        item.appendChild(newEl);
                    }
                }
            });
        };

        lazyCheck(event) {
            let pid = UserFilter.getPid(event.target.parentNode);
            let commentList = UserFilter.getCommentList();
            let checklist = [];
            for (const item of commentList) {
                if (item.innerHTML.indexOf(this.elFiltStateKey) == -1) {
                    checklist.push(item);
                }
            }
            this.filterPid(pid, this.pageLoad)
                .then(() => this.updateDom(checklist))
                .catch(err => console.error(err));
        }

        main() {
            let commentList = UserFilter.getCommentList();
            let checklist = [];
            if (this.lazy) {
                for (const item of commentList) {
                    if (
                        item.innerHTML.indexOf(this.elFiltStateKey) == -1
                        && item.innerHTML.indexOf(this.elFiltPromptKey) == -1
                    ) {
                        checklist.push(item);
                    }
                }
                this.updateDom(checklist);
            } else {
                for (const item of commentList) {
                    if (item.innerHTML.indexOf(this.elFiltStateKey) == -1) {
                        checklist.push(item);
                    }
                }
                this.addPids(checklist);
                for (const pid of this.pidList) {
                    this.filterPid(pid, this.pageLoad)
                        .then(() => this.updateDom(checklist))
                        .catch(err => console.error(err));
                }
            }
        }

        start() {
            this.stop();
            this.thread = setInterval(() => this.main(), this.interval);
        }
        stop() {
            if (this.thread != undefined) clearInterval(this.thread);
        }
    };

    console.log("哔哩哔哩评论Tag脚本开始执行");

    //初始化时即可传入标签Array，也可以后续使用addFilter()添加
    const app = new UserFilter(filters, options);
    app.start();

})();

