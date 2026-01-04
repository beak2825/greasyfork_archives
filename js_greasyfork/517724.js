// ==UserScript==
// @name         NodeLoc 增强脚本
// @namespace    nodeloc++
// @version      0.0.4
// @description  https://www.nodeloc.com/d/16398/
// @author       Str
// @match        https://www.nodeloc.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517724/NodeLoc%20%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/517724/NodeLoc%20%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 配置部分，懒得写个GUI管理配置了，没啥好配置的
const reply_data = ['看看', '瞅瞅', '感谢分享', '支持一下', '路过支持', '好东西', '蹲一个']; // 在“需要回复后可见”帖子点击一键查看后使用的回复内容

var settings_ui = {
    "基础设置": [
        {
            label: "自动签到",
            desc: "在DOM更新时，自动尝试签到操作",
            name: "auto_check",
            type: "select",
            data: {
                "不自动签到": "NONE",
                "固定 9 NL": "DEF",
                "试试手气": "RANDOM",
            },
            def: "NONE"
        },
        {
            label: "自动领取邀请码",
            desc: "自动领取 NodeLoc 每日的免费邀请码",
            name: "get_free_inv",
            type: "tf",
            def: false
        },
        {
            label: "去广告",
            desc: "关闭电脑端右侧推广广告，如果你认为它们不影响你的浏览体验，为表对 Nodeloc 的支持请不要开启",
            name: "block_ad",
            type: "tf",
            def: false,
            reload: true
        },
        {
            label: "我知道你谢谢了他们",
            desc: "关闭电脑端左侧感谢名单，如果你认为它们不影响你的浏览体验，为表对 Nodeloc 的支持请不要开启",
            name: "block_thanks",
            type: "tf",
            def: false,
            reload: true
        },
        {
            label: "关闭跳转提醒",
            desc: "自动完成跳转确认",
            name: "auto_goto",
            type: "tf",
            def: false,
        },
    ],
    "UI 设置": [
        {
            label: "参与所有抽奖按钮",
            desc: "在首页显示一个参与所有抽奖按钮",
            name: "enter_all",
            type: "tf",
            def: false,
            reload: true
        },
        {
            label: "一键抽奖按钮",
            desc: "在存在抽奖的帖子显示一个“一键参与抽奖”按钮",
            name: "one_enter",
            type: "tf",
            def: false,
            reload: true
        },
        {
            label: "参与抽奖人数显示",
            desc: "在存在抽奖的帖子显示一个“x 人已参与”文本",
            name: "enter_info",
            type: "tf",
            def: false,
            reload: true
        },
        {
            label: "价格显示",
            desc: "在首页显示抽奖所需价格 / 付费阅读价格",
            name: "pp",
            type: "tf",
            def: false,
            reload: true
        },
        {
            label: "购买人数显示",
            desc: "在存在付费阅读的帖子的“解锁”按钮显示付费人数",
            name: "ptsc",
            type: "tf",
            def: false,
            reload: true
        },
        {
            label: "更好的用户资料页",
            desc: "在用户资料卡片/用户页显示详细的用户信息",
            name: "mi_uc",
            type: "tf",
            def: false,
            reload: true
        },
        {
            label: "不显示用户组",
            desc: "在帖子中不显示头像上的用户组",
            name: "no_pub",
            type: "tf",
            def: false,
            reload: true
        },
        {
            label: "不显示无效邀请码",
            desc: "邀请好友页面隐藏过期或用尽的邀请码。灵感来源于沈同学（/d/25451）",
            name: "no_inv_expired",
            type: "tf",
            def: false,
        }
    ],
    "高级设置": [
        {
            label: "抹掉数据",
            desc: "让你回到刚刚安装脚本的时候的设置……",
            func: () => {
                Object.keys(localStorage).filter((key) => key.startsWith("s_")).map((key) => localStorage.removeItem(key));
            },
            type: "button",
            reload: true
        },
        {
            label: "落后警告",
            desc: "在服务器落后于客户端新请求时提示警告，一般用于测试连接是否卡顿",
            name: "ping_warn",
            type: "tf",
            def: true,
            reload: true
        }
    ],
    "实验室": [
        {
            label: "AI 总结",
            desc: "使用 gpt-4o-mini 总结帖子主题内容",
            name: "ai_zj",
            type: "tf",
            def: false,
            reload: true
        },
        {
            label: "发生了什么",
            desc: "在首页显示一个按钮，使用 gpt-4o-mini 总结最近的帖子主题内容",
            name: "ai_zj_all",
            type: "tf",
            def: false,
            reload: true
        },
        {
            label: "SFW",
            desc: "移除Nodeloc页面中可能出现的不适宜公共场合浏览的板块、背景图",
            name: "sfw",
            type: "tf",
            def: false,
            reload: true
        }/*
        {
            label: "完成答题",
            desc: "一键完成新用户注册时的答题",
            func: () => {
                window.done_pro();
            },
            type: "button",
            reload: true
        }*/

    ]
}

var SETTINGS = {};
Object.values(settings_ui).forEach((block_array) => {
    block_array.forEach((block) => {
        let v = localStorage[`s_${block.name}`] ?? block.def;
        SETTINGS[block.name] = v === "false" ? false : v;
    });
});

window.gpt4o = async (raw, retry = 0) => {
    const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

    try {
        let req = await Promise.race([
            fetch("https://cmd.0k.gs/4o", {
                method: "POST",
                body: raw
            }),
            timeout(30000) // 30秒超时
        ]);

        let data = await req.text();
        if (data == "HTTP error! status: 429") {
            if (retry < 3) return window.gpt4o(raw, retry + 1);
            return "请重试，如果再次遇到此问题，请检查是否载荷过大，否则请报告错误"
        }

        return data;
    } catch (error) {
        if (error.message === 'Timeout' && retry < 3) {
            return window.gpt4o(raw, retry + 1); // 超时重试
        }
        return false; // 其他错误处理
    }
}

var css = `
    dialog {
        box-shadow: 2px 2px teal;
        border: 0;
        min-width: 320px;
    }
    dialog.max {
       height: 90vh;
       width: 90%;
    }
    .dialog-input {
        display: block;
        width: 100%;
    }
    .dialog-buttons {
        text-align: right;
    }
    button.inverted {
        background-color: teal;
        box-shadow: 2px 2px black;
        color: white;
    }

    button.small {
        padding: 8px 20px;
        font-size: 18px;
    }

    button.inverted:hover {
        background-color: #006e6e;
        box-shadow: 3px 3px black;
    }

    dialog>div>button:hover {
       cursor: pointer;
        background-color: #bbb;
        box-shadow: 3px 3px teal;
    }
    dialog>div>button {
        background-color: white;
        box-shadow: 2px 2px teal;
        color: teal;
        font-family: Quicksand, 'Liberation Sans', sans-serif;
        padding: 10px 30px;
        margin: 5px;
        font-size: 24px;
        border: 0;
        border-width: 0;
        outline: 0;
        transition: all .2s ease-in-out;
        white-space: nowrap;
        border-radius: 0;
    }
    dialog > p {
        font-family: "Liberation Sans", sans-serif;
        margin-block-start: 1em;
        margin-block-end: 1em;
        font-size: 16px;
    }
    dialog > input[type=text] {
        border: 1px solid lightgray;
        transition: .2s all ease-in-out;
    }
    dialog > input {
        padding: 8px;
        outline: 0;
        color: teal;
    }
    .dialog-textarea {
        width: 100%;
        height: calc(100% - 105px);
        resize: none;
        overflow: scroll;
    }

    #backToTop {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: none;
        padding: 10px 15px;
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .lottery_tag {
        background: #c32a27;
        padding: 0px 8px;
        border-radius: 18px;
        color: #fff;
    }
    .lottery_tag.can_not_enter {
        background: #816060
    }
    .pay2see_tag {
        background: #9734c9;
        padding: 0px 8px;
        border-radius: 18px;
        color: #fff;
    }
    .UserCard-info>li:not(.item-badges):not(.item-bio) {
        background: #00000020;
        padding: 4px 8px;
        margin: 2px;
        border-radius: 4px;
    }
    #NL_settings {
        position: fixed;
        z-index: 114514;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #00000010;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .s-window {
        z-index: 1919810;
        width: 600px;
        height: 400px;
        background: #ffffff;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 0 6px 0 #333;
    }
    .s-topbar {
        background: #00000020;
        display: flex;
        justify-content: flex-end;
        box-shadow: 0 0 6px 0 #333;
        z-index: 1;
    }
   .s-title {
        width: 100%;
        font-weight: bold;
        font-size: 16px;
        padding: 8px 16px;
    }
    .s-body {
        height: 100%;
        display: flex;
        overflow: hidden;
    }
    .s-bodybar {
        background: #00000010;
        box-shadow: 0 0 6px 0 #333;
        width: 120px;
    }
    .s-bodycontent {
        flex-grow: 1;
        overflow-y: scroll;
    }
    @media (max-width: 768px) {
        .s-window {
            width: 100%;
            height: 100%;
            border-radius: 0px !important;
        }
    }
    .s-cb-title {
        margin: 2px 4px;
    }
    .s-cb {
        padding: 8px 16px;
        background: #00000010;
        width: 100%;
    }
    .s-cb-desc {
        color: #333;
        font-size: 95%;
    }
    .s-do {

    }
    .s-cb-do {
        display: flex;
        justify-content: space-between;
    }
    .aic {
        padding: 16px 32px;
        background: #44ffff10;

    }
    .s-slt {
        padding: 12px 24px;
        margin: 0;
        width: 120px;
    }
    .s-slt:hover {
        background: #00000010;
    }
    .s-sel {
        color: var(--link-color);
        background: #00000010;
        font-weight: bold;
    }
    #ping-warn {
        padding: 8px 16px;
        background: #ff5500;
        color: #fff;
        position: fixed;
        bottom: 0;
        left: 0;
        display: none;
    }
    @media (max-width: 768px) {
        #ping-warn {
            width: 100%;
        }
    }
`;

// 注入css
var style = document.createElement('style');
style.innerHTML = css;
document.head.appendChild(style);

// 便于封装请求，因为 nodeloc 有 webpack，所以需要自己写一份
function isObject(value) {
    return value !== null && typeof value === 'object';
}

function deepMerge(target, ...sources) {
    if (!isObject(target)) return target;

    for (const source of sources) {
        if (isObject(source)) {
            for (const key in source) {
                const sourceValue = source[key];
                const targetValue = target[key];

                if (isObject(sourceValue)) {
                    target[key] = deepMerge(targetValue || {}, sourceValue);
                } else target[key] = sourceValue;
            }
        }
    }
    return target;
}

var flarumJsonCache = {
    cache: null,
    lastTime: -1
};
async function getFlarumJsonPayload() {
    if (flarumJsonCache.lastTime + 10 * 60 * 1000 > new Date().getTime() && flarumJsonCache.lastTime !== -1) {
        return flarumJsonCache.cache
    } else {
        if (flarumJsonCache.lastTime === -1) {
            let flarum_json_payload = document.getElementById("flarum-json-payload")?.innerText;
            if (!flarum_json_payload) return false;
            try {
                return JSON.parse(flarum_json_payload)
            } catch (error) {
                return false;
            };
        }
        let data = await getPayload(new URL(window.location.href).pathname, true);
        if (!data) return false;
        flarumJsonCache.cache = data;
        flarumJsonCache.lastTime = new Date().getTime();
        return data;
    }
}
async function getCSRF() {
    return (await getFlarumJsonPayload())?.session?.csrfToken || false;
}

async function $fetch(url, options = {}) {
    try {
        let req = fetch(window.location.origin + url, deepMerge(options, {
            headers: {
                "x-csrf-token": await getCSRF()
            }
        }));
        return req;
    } catch (error) {
        return false;
    }
}
window.zj_all = async (dom, length = 30) => {
    let lastmsg = null;
    async function msg(data) {
        if (lastmsg?.remove) lastmsg.remove();
        if (data) lastmsg = await window.customMsg(data);
    }
    try {
        await msg("总结中...\n→ 获取帖子列表\n· 获取帖子内容\n· 总结帖子内容\n· 总结所有内容");
        let dicussions = await getDiscussions(length);
        let dicussion_ids = dicussions.map((dicussion) => dicussion.id);
        let dicussion_content = [];

        let maxConcurrentRequests = 10; // 最大并发请求数
        let activeRequests = 0; // 当前活跃请求数
        let index = 0; // 当前处理的帖子索引
        let success_index = 0;

        // 获取帖子内容
        while (index < length || activeRequests > 0) {
            // 启动新的请求
            while (activeRequests < maxConcurrentRequests && index < length) {
                let id = dicussion_ids[index];
                let promise = getPayload(`/d/${id}`)
                .then((p_data) => {
                    let content = p_data.apiDocument.included.find((data) =>
                                                                   data.type === "posts" && data.attributes?.number === 1
                                                                  )?.attributes
                    let ptitle = p_data.apiDocument.data.attributes.title;
                    if (content) content = content.content ?? content.contentHtml;
                    if (content && content.length < 4096) {
                        dicussion_content.push({
                            content,
                            title: ptitle,
                            id
                        });
                    }
                })
                .finally(async () => {
                    activeRequests--; // 请求完成后减少活跃请求数
                    success_index++;
                    await msg(`总结中...\n√ 获取帖子列表\n→ 获取帖子内容 [${Math.floor((success_index) / length * 100)}%]\n· 总结帖子内容\n· 总结所有内容`);
                });

                activeRequests++; // 增加活跃请求数
                index++; // 移动到下一个帖子
                promise.catch(err => console.error(err)); // 捕获错误，避免未处理的Promise拒绝
            }

            // 等待一小段时间，避免过于频繁的请求
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        let discussion_zip = [];

        // 总结帖子内容
        activeRequests = 0; // 重置活跃请求数
        index = 0; // 重置索引
        success_index = 0;

        while (index < dicussion_content.length || activeRequests > 0) {
            while (activeRequests < maxConcurrentRequests && index < dicussion_content.length) {
                let loc_index = index;
                const promise = window.gpt4o(`假设你在一个flarum论坛中，请总结以下顶楼主题文本（只是主题的内容，不包含回复），使用 HTML 输出你的总结，你的输出应该尽可能不要过长！你的输出不需要用代码块包裹：\n标题：[${dicussion_content[loc_index].title}](/d/${dicussion_content[loc_index].id})\n主题内容：\n${dicussion_content[loc_index].content}`)
                .then(data => {
                    if (data && data !== "HTTP error! status: 429") {
                        discussion_zip.push(`[${dicussion_content[loc_index].title}](/d/${dicussion_content[loc_index].id})：\n${data}`);
                    }
                })
                .finally(async () => {
                    activeRequests--; // 请求完成后减少活跃请求数
                    success_index++;
                    await msg(`总结中...\n√ 获取帖子列表\n√ 获取帖子内容 [100%]\n→ 总结帖子内容 [${Math.floor((success_index) / dicussion_content.length * 100)}%] \n· 总结所有内容`);
                });

                activeRequests++; // 增加活跃请求数
                index++; // 移动到下一个帖子
                promise.catch(err => console.error(err)); // 捕获错误，避免未处理的Promise拒绝
            }

            // 等待一小段时间，避免过于频繁的请求
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        await msg(`总结中...\n√ 获取帖子列表\n√ 获取帖子内容 [100%]\n√ 总结帖子内容 [100%]\n→ 总结所有内容`);
        let data = await window.gpt4o(`下面是用 \`******\` 分割的一个 flarum 论坛中的部分主题内容，请概况所有主题总要内容，然后总结它们的内容，使用 HTML 输出你的总结，不要滥用标题，适当插入超链接和图片并限制大小（< 80 vh / vw），跳过需要回复、点赞、付费后才可以查看的帖子，你的输出应该开门见山总结中心内容，不需要用代码块包裹：\n${discussion_zip.join("\n\n******\n\n")}`);
        await msg();
        window.customAlert(data, true);
    } catch (error) {
        await msg();
        window.customAlert(error.message || error || "未知错误");
    }
};

function geyDay() {
    let day = new Date().getDay();
    return day === 0 ? 7 : day;
}
function getRandomItemFromArray(arr) {
    var randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function $(dom) {
    return document.querySelector(dom);
}

function $all(dom) {
    return document.querySelectorAll(dom);
}

const callback = (mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            (()=>{
                if (SETTINGS.block_ad && $(".NodelocAdContentWrapper>.NodelocAdColumn")?.remove) {
                    $(".NodelocAdContentWrapper>.NodelocAdColumn").remove()
                }
            })();

            (()=>{
                if (SETTINGS.block_thanks && $(".support-widget")?.remove) {
                    $(".support-widget").remove()
                }
            })();

            (()=>{
                if (SETTINGS.no_pub && $all("ul.PostUser-badges.badges")) {
                    $all("ul.PostUser-badges.badges").forEach((dom) => {
                        if (dom?.remove) dom.remove();
                    })
                }
            })();

            (()=>{
                if (SETTINGS.no_inv_expired && ($all("div>ul>.expired") || $all('li>p>span.expired'))) {
                    [...$all("div>ul>.expired"), ...[...document.querySelectorAll('li>p>span.expired')].map((dom) => dom.parentNode.parentNode)].forEach((dom) => {
                        if (dom?.remove) dom.remove();
                    })
                }
            })();



            (async ()=>{
                if (SETTINGS.sfw) {

                    // 隐藏内板板块
                    if ($all(".TagLinkButton")) [...$all(".TagLinkButton")].filter((tag) => tag.getAttribute("href") == "/t/private").forEach((dom) => dom.parentNode.remove());
                    if ($all(".TagTile-info")) [...$all(".TagTile-info")].filter((tag) => tag.getAttribute("href") == "/t/private").forEach((dom) => dom.parentNode.remove());
                    // 隐藏内板帖子
                    if ($all(".TagLabel-name")) [...$all(".TagLabel-name")].filter((tag) => tag.innerText == "内版 | Private").forEach((dom) => dom.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove());
                    // 隐藏部分用户背景图
                    if ($all(".UserCard")) [...$all(".UserCard")].filter((tag) => tag.style.backgroundImage == `url("https://www.nodeloc.com/assets/decorationStore/profileBackground_VIABZ49PR34pcNnq.jpg")`).forEach((tag) => { tag.style.backgroundImage = "none !important"});
                    // 隐藏社区装饰店此背景图
                    if ($all(".DecorationItemProfileBackgroundImage")) [...$all(".DecorationItemProfileBackgroundImage")].filter((tag) => tag.style.backgroundImage == `url("/assets/decorationStore/profileBackground_VIABZ49PR34pcNnq.jpg")`).forEach((dom) => dom.parentNode.parentNode.remove());
                    // 禁用内板
                    if (!window.fsw && location.pathname == "/t/private"){
                        window.fsw = true;
                        document.open();
                        document.write(await (await fetch(`/4n0n4me`)).text());

                    }
                }
            })();

            (async ()=>{
                const elements = $all('.PostStream-item[data-index="0"]');
                if (elements.length > 0 && SETTINGS.ai_zj) {
                    let cache_p = null;
                    elements.forEach(async element => {
                        if (element.classList.contains("inj")) return;
                        element.classList.add("inj");
                        if (!cache_p) cache_p = await getPayload(new URL(window.location.href).pathname);
                        let id = element.getAttribute("data-id");
                        let content = cache_p.apiDocument.included.find((data)=> data.type == "posts" && data.id === id)?.attributes;
                        let ptitle = cache_p.apiDocument.data.attributes.title;
                        let pid = cache_p.apiDocument.data.id;
                        if (content) content = content.content ?? content.contentHtml;
                        if (content) {
                            const aiContent = document.createElement('div');
                            aiContent.classList.add("aic")
                            aiContent.innerHTML = '思考中...';
                            const targetElement = element.querySelector("article>div>div");
                            targetElement.insertBefore(aiContent, targetElement.firstChild);
                            let data = await window.gpt4o(`假设你在一个flarum论坛中，请总结以下顶楼主题文本（只是主题的内容，不包含回复），使用 HTML 输出你的总结的内容，不要滥用标题，你的输出不需要用代码块包裹：\n标题：[${ptitle}](/d/${pid})\n主题内容：\n${content}`);
                            aiContent.innerHTML = data === "HTTP error! status: 429" ? `429！免费公益网站全部为爱发电，你看见本提示可能是网站被刷！请过一会再试！` : (data ?? "未知错误");
                        }
                    });
                }
            })();

            // 回帖后可见贴“一键查看”按钮注入
            (()=>{
                const elements = $all('.xx2see>.xx2see_alert');
                if (elements.length > 0) {
                    elements.forEach(element => {
                        if (element.classList.contains("inj")) return;
                        element.classList.add("inj");
                        let is_like = element.innerText.includes("赞");
                        const fast_see = document.createElement("button");
                        fast_see.innerText = "一键查看"
                        fast_see.classList.add("Button");
                        fast_see.classList.add("Button--primary");
                        fast_see.style.marginInlineStart = "1em";
                        fast_see.onclick = async () => {
                            fast_see.disabled = true;
                            fast_see.innerText = is_like ? "正在点赞": "正在回复";
                            try {
                                let req;
                                if (is_like) {
                                    let pid = (await getPayload(new URL(window.location.href).pathname)).apiDocument.included.find((data)=> data.type == "posts" && data.attributes?.number === 1)?.id;
                                    if (!pid) throw new Error("无法获取 POST ID");;
                                    req = await $fetch("/api/posts/" + pid, {
                                        "headers": {
                                            "content-type": "application/json; charset=UTF-8",
                                            "x-http-method-override": "PATCH"
                                        },
                                        "body": JSON.stringify({
                                            "data": {
                                                "type": "posts",
                                                "attributes": {
                                                    "isLiked": true
                                                },
                                                "id": pid
                                            }
                                        }),
                                        "method": "POST",
                                    });
                                } else {
                                    if (!/\/d\/\d+/.test(location.href)) throw new Error("无法获取帖子 ID");
                                    let pid = location.href.match(/\/d\/(\d+)/)[1];
                                    req = await $fetch("/api/posts", {
                                        "headers": {
                                            "content-type": "application/json; charset=UTF-8",
                                        },
                                        "body": JSON.stringify({
                                            "data": {
                                                "type": "posts",
                                                "attributes": {
                                                    "content": getRandomItemFromArray(reply_data)
                                                },
                                                "relationships": {
                                                    "discussion": {
                                                        "data": {
                                                            "type": "discussions",
                                                            "id": pid
                                                        }
                                                    }
                                                }
                                            }
                                        }),
                                        "method": "POST",
                                    });
                                }
                                let data = await req.json();
                                if (data.errors) throw new Error(data.errors.map((error) => error.detail || error || "未知错误").join(", "))
                                fast_see.innerText = "完成";
                                location.reload();
                            } catch (error) {
                                fast_see.disabled = true;
                                fast_see.innerText = `出错了：${error.message || error || "未知错误"}`;
                            }
                        };
                        element.appendChild(fast_see);

                    });
                }
            })();

            // 一键参与抽奖按钮和设置按钮显示
            (()=>{
                const elements = $all(".IndexPage-toolbar-action");

                if (elements.length > 0) {
                    elements.forEach(element => {
                        if (element.classList.contains("inj")) return;
                        element.classList.add("inj");
                        const enter_all = document.createElement("li");
                        enter_all.innerHTML = `<a class="Button Button--icon hasIcon" onclick="enter_all(this)">
                                                   <i aria-hidden="true" class="icon fas fa-gift Badge-icon"></i>
                                                   <span class="Button-label"></span>
                                               </a>`;
                        if (SETTINGS.enter_all) element.insertBefore(enter_all, element.firstChild);

                        const ai_all = document.createElement("li");
                        ai_all.innerHTML = `<a class="Button Button--icon hasIcon" onclick="zj_all(this)">
                                                   <i aria-hidden="true" class="icon fas fa-question Badge-icon"></i>
                                                   <span class="Button-label"></span>
                                               </a>`;
                        if (SETTINGS.ai_zj_all) element.insertBefore(ai_all, element.firstChild);

                        const settings = document.createElement("li");
                        settings.innerHTML = `<a class="Button Button--icon hasIcon" onclick="open_settings()">
                                                   <i aria-hidden="true" class="icon fas fa-gear Badge-icon"></i>
                                                   <span class="Button-label"></span>
                                               </a>`;
                        element.insertBefore(settings, element.firstChild);
                    });
                }
            })();

            // 抽奖页面的“回帖并参与”按钮
            (()=>{
                const elements = $all(".Lottery-sticky");
                if (elements.length > 0) {
                    elements.forEach(async element => {
                        if (element.classList.contains("inj")) return;
                        element.classList.add("inj");
                        let data = await getPayload(new URL(window.location.href).pathname);
                        if (!data) return;
                        let lotteryInfo = data.apiDocument.included.find(block => block.type == "lottery");
                        if (!lotteryInfo) return;
                        if (SETTINGS.enter_info) {
                            const count = document.createElement("div");
                            count.innerText = `${lotteryInfo.attributes?.enter_count ?? "【错误】"} 人已参与`;
                            count.style.textAlign = 'right';
                            $(`.Post-lottery[data-id="${lotteryInfo.id}"] > div .LotteryOptions`).appendChild(count);
                        }


                        if (!element.querySelector(".Lottery-submit")) return;
                        if (SETTINGS.one_enter) {
                            const enter = document.createElement("button");
                            enter.classList.add("Button");
                            enter.classList.add("Button--primary");
                            enter.innerHTML = `<span class="Button-label">点此一键参与抽奖</span>`;
                            element.appendChild(enter);
                            element.querySelector(".Lottery-submit").remove();
                            enter.onclick = async () => {
                                enter.disabled = true;
                                enter.innerText = "正在参与";
                                try {

                                    if (!lotteryInfo.id) throw new Error("无法获取奖品信息");

                                    if (!/\/d\/\d+/.test(location.href)) throw new Error("无法获取帖子 pid");

                                    let pid = location.href.match(/\/d\/(\d+)/)[1];
                                    if (await enter_lottery(lotteryInfo.id, pid)) {
                                        enter.innerText = "参与成功";
                                    } else enter.innerText = "参与失败";
                                } catch (error) {
                                    enter.innerText = `出错了：${error.message || error || "未知错误"}`
                                }
                            };

                        }

                    });
                }
            })();

            // 更多用户信息显示
            (()=>{
                const elements = $all(".UserCard-info");
                if (elements.length > 0) {
                    elements.forEach(async (element) => {
                        if (element.classList.contains("inj")) return;
                        element.classList.add("inj");
                        let uid = element.getElementsByClassName("item-uid")[0]?.innerText.match(/\d+/)?.[0];
                        if (uid && SETTINGS.mi_uc) {
                            let data = await uidToInfo(uid);
                            if (data) {
                                let userinfo = data.attributes;
                                if (typeof userinfo.read_permission == "number") addInfo(element, `阅读权限：${userinfo.read_permission}  `);
                                if (userinfo.lastSeenAt) {
                                    let lastSeenAt = element.querySelector(".item-lastSeen>.UserCard-lastSeen")
                                    if (lastSeenAt) lastSeenAt.innerHTML += `（${formatDateString(userinfo.lastSeenAt)}）  `;
                                }
                                if (userinfo.joinTime) {
                                    let joinTime = element.querySelector(".item-joined")
                                    if (joinTime) joinTime.innerHTML += `（${formatDateString(userinfo.joinTime)}）  `;
                                }

                                if (typeof userinfo.lastCheckinMoney == "number" && userinfo.lastCheckinTime) addInfo(element, `上次 ${formatDateString(userinfo.lastCheckinTime)} 签到得到 ${userinfo.lastCheckinMoney} NL`);
                                if (typeof userinfo.lotteryCount == "number") addInfo(element, `共发布 ${userinfo.lotteryCount} 个抽奖`);
                            }
                        }
                    });
                }

            })();


            // 首页抽奖/付费贴价格显示
            (()=>{
                const elements = $all(".DiscussionList-discussions>li");
                if (elements.length > 0) {
                    elements.forEach(async (element) => {
                        if (element.classList.contains("inj")) return;
                        element.classList.add("inj");
                        let pid = element.getAttribute("data-id");
                        if (pid && SETTINGS.pp) {
                            let lottery_tag = element.querySelector(".DiscussionListItem > .DiscussionListItem-content > .DiscussionListItem-badges > .item-lottery");
                            let pay2see_tag = element.querySelector(".DiscussionListItem > .DiscussionListItem-content > .DiscussionListItem-badges > .item-pay2see");
                            if (lottery_tag || pay2see_tag) {
                                let data = await getPayload(`/d/${pid}`, true);
                                if (!data) return;


                                if (lottery_tag) {
                                    lottery_tag.classList.add("lottery_tag");
                                    let lotteryInfo = data.apiDocument.included.find(block => block.type == "lottery");
                                    if (!lotteryInfo) return;
                                    if (!lotteryInfo.attributes.canEnter) {
                                        lottery_tag.classList.add("can_not_enter");
                                    }
                                    lottery_tag.innerHTML += lotteryInfo.attributes.price;
                                }


                                if (pay2see_tag) {
                                    pay2see_tag.classList.add("pay2see_tag");
                                    let price = data.apiDocument.data.attributes.pay2seeCost;
                                    pay2see_tag.innerHTML += price;
                                }
                            }
                        }
                    });
                }

            })();

            // 购买人数显示
            (()=>{
                const elements = $all(".item-pay-to-see");
                if (elements.length > 0) {
                    elements.forEach(async (element) => {
                        if (element.classList.contains("inj")) return;
                        element.classList.add("inj");
                        if (!SETTINGS.ptsc) return;
                        let data = await getPayload(new URL(window.location.href).pathname);
                        if (!data) return;
                        let count = data.apiDocument.data.attributes.pay2seeCount;
                        if (count) element.querySelector("button").innerHTML += ` | ${count}人已买`

                    });
                }

            })();
            // 免费邀请码
            (async ()=>{
                if (!SETTINGS.get_free_inv || window.getInv) return;
                window.getInv = true;
                $fetch("/api/store/free", {
                    "body": null,
                    "method": "POST",
                });
            })();
            // 自动签到
            (async ()=>{
                if (window.checked || window.checking || SETTINGS.auto_check == "NONE") return;
                window.checking = true;

                let history_req = await $fetch("/api/checkin/history");
                let history = (await history_req.json())?.data;
                if (!history) {
                    window.checking = false;
                    return;
                }
                if (history[geyDay() - 1].attributes.type !== "") { // 索引你无敌了，flarum的count是1开始，数组是0开始，能不能统一点啊啊
                    window.checking = false;
                    window.checked = true;
                    return;
                }


                let userid = (await getFlarumJsonPayload())?.session.userId;
                if (!userid) {
                    window.checking = false;
                    return;
                }

                let req = await $fetch(`/api/users/${userid}`, {
                    headers: {
                        "content-type": "application/json; charset=UTF-8",
                        "x-http-method-override": "PATCH"
                    },
                    body: JSON.stringify({
                        "data": {
                            "type": "users",
                            "attributes": {
                                "allowCheckin": false,
                                "checkin_days_count": geyDay(),
                                "checkin_type": SETTINGS.auto_check == "RANDOM" ? "R" : "N",
                                "g-recaptcha-response": ""
                            },
                            "id": userid.toString()
                        }
                    }),
                    method: "POST",
                });
                let data = await req.json();
                if (data.data.attributes.checkin_days_count != geyDay()) {
                    window.checking = false;
                    return;
                }
                window.checking = false;
                window.checked = true;

                let r_history_req = await fetch("/api/checkin/history");
                let r_history = (await r_history_req.json())?.data;
                if (r_history) window.customAlert(`签到成功！获得 ${r_history[geyDay() - 1].attributes.reward_money} NL`);
            })();



        }
    }
};
function formatDateString(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const timezoneOffset = date.getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
    const offsetMinutes = Math.abs(timezoneOffset % 60);
    const timezoneSign = timezoneOffset > 0 ? '-' : '+';
    const timezoneString = `UTC${timezoneSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

    return `${year} 年 ${month} 月 ${day} 日 ${hours} 时 ${minutes} 分 ${seconds} 秒 (${timezoneString})`;
}



function addInfo(DOM, text, HTML = false) {
    const li = document.createElement("li");
    const dom = document.createElement("span");
    dom[HTML?"innerHTML":"innerText"] = text;
    li.appendChild(dom);
    DOM.appendChild(li);


    const itemElement = DOM.querySelector('.item-money');
    itemElement.insertAdjacentElement('afterend',li);
}

async function uidToInfo(uid) {
    try {
        let req = await $fetch("/api/users/" + uid, {
            "headers": {
                "x-http-method-override": "PATCH"
            },
            "method": "GET",
        });
        let data = await req.json();
        return data?.data || false;
    } catch (error) {
        return false;
    };
}
// GenTo 扣下来的

// Prompt
window.customPrompt = function(message,def='') {
    return window._Prompt({
        message,
        input: true,
        def,
        cancelButton: true,
        okButton: true
    });
}
//confirm
window.customConfirm = function(message) {
    return window._Prompt({
        message,
        cancelButton: true,
        okButton: true
    });
}
//alert
window.customAlert = function(message, html = false) {
    return window._Prompt({
        message,
        okButton: true,
        html
    });
}
//msgbox
window.customMsg = async function(message,timeout = false) {
    let msg = await window._Prompt({
        message,
        raw: true
    });
    if (timeout) {
        setTimeout(()=>{
            msg.remove();
        },timeout)
    }
    return msg;
}
window._Prompt = function(data) {
    return new Promise((resolve) => {
        const dialog = document.createElement('dialog');
        var userInput = null;
        var cancelButton = null;
        var okButton = null;

        const message = document.createElement('p');
        message.style.color = "teal";
        dialog.appendChild(message);
        if (data.input) {
            userInput = document.createElement('input');
            userInput.type = 'text';
            userInput.classList.add("dialog-input");
            dialog.appendChild(userInput);
        }

        const Buttons = document.createElement('div');
        Buttons.classList.add('dialog-buttons');
        dialog.appendChild(Buttons);
        if (data.cancelButton) {
            cancelButton = document.createElement('button');
            cancelButton.textContent = '取消';
            cancelButton.classList.add("small");
            Buttons.appendChild(cancelButton);
        }
        if (data.okButton){
            okButton = document.createElement('button');
            okButton.textContent = '确定';
            okButton.classList.add("inverted");
            okButton.classList.add("small");
            Buttons.appendChild(okButton);
        }



        document.body.appendChild(dialog);

        message[data.html ? "innerHTML" : "innerText"] = data.message;

        if (userInput && data.def) userInput.value = data.def;

        dialog.showModal();
        if (data.okButton) {
            okButton.onclick = function() {
                dialog.close();
                resolve(userInput?userInput.value:true);
            };
        }
        if (data.cancelButton) {
            cancelButton.onclick = function() {
                dialog.close();
                resolve(null);
            }
        }
        dialog.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                okButton ? okButton.click() : null;
            }
        });
        dialog.addEventListener('close', function() {
            cancelButton ? cancelButton.click() : okButton ? okButton.click() : null;
            dialog.remove();
        });
        if (data.raw) resolve(dialog);

    });
};


async function getDiscussions(num = 100, filter) { // 获取主题列表
    let req = await $fetch(`/api/discussions?page%5Blimit%5D=${num}${filter ? `filter%5Btag%5D=${filter}` : ''}`);
    let data = await req.json();
    return data.data || false;
}

window.entered = [];
window.entering = [];

window.enter_all = async (arg, num = 100) => {
    let max_num = await window.customPrompt(`将自动参与最近 100 条抽奖帖子中的\n需要NL <= (下面数字 [正整数 < 1e9] ) 的抽奖帖子\n这包括你自己发布的，确定吗？`, 100);
    let cjnum = 100;
    if (max_num === null) return;
    let parsed_max_num = parseInt(max_num);
    if (parsed_max_num && parsed_max_num > 0 && parsed_max_num < 1e9 && max_num == parseInt(max_num)) {
        cjnum = parsed_max_num;
    } else return window.customAlert("因为非法数值取消操作");
    window.customAlert("操作已在后台开始，你可以在此期间使用论坛，但不要刷新或切换此页面到后台，操作完成后将通知你\n如果需要停止，请随时刷新页面");
    let discussions = await getDiscussions(num, 'lottery');
    if (!discussions) return window.customAlert("获取帖子列表失败！");

    let hasLottery = discussions.filter((discussion) =>
                                        discussion.attributes.hasLottery > 0 &&
                                        !window.entered.includes(discussion.id) &&
                                        !window.entering.includes(discussion.id)
                                       );
    hasLottery
        .map((discussion) => discussion.id)
        .forEach((id) => window.entering.push(id));

    let sussess = await window.enterLoop(0, cjnum);
    window.customAlert(`参与已完成\n已从 ${hasLottery.length} 个抽奖贴中参与 ${sussess} 个符合条件的帖子！`);
};
function hasPayload(data) {
    let match = data.match(/<script id="flarum-json-payload" type="application\/json">(.+?)<\/script>/);
    return match ? match[1]: undefined;
}
const PayloadCache = {};
async function getPayload(dataOrPath, use_cache = false) {
    if (hasPayload(dataOrPath)) {
        return JSON.parse(hasPayload(dataOrPath));
    }
    let data = null;
    if (use_cache && PayloadCache[dataOrPath]) {
        data = PayloadCache[dataOrPath];
    } else {
        let req = await $fetch(dataOrPath);
        data = PayloadCache[dataOrPath] = await req.text();
    }

    let payload = hasPayload(data);
    if (!payload) return false;
    return JSON.parse(payload);
}
window.enterLoop = async (sussess = 0, maxnum = 100) => {
    let pid = window.entering.shift();
    if (!pid) return sussess;
    let data = await getPayload(`/d/${pid}`);
    if (!data) return sussess;
    let lotteryInfo = data.apiDocument.included.find(block => block.type == "lottery");
    /*console.log(
        `| 抽奖 ${pid} 的信息：\n` +
        `| | ID: ${lotteryInfo.id}\n` +
        `| | ${lotteryInfo.attributes.prizes} x${lotteryInfo.attributes.amount}\n` +
        `| | Price: ${lotteryInfo.attributes.price}, ${lotteryInfo.attributes.min_participants} < ${lotteryInfo.attributes.enter_count} < ${lotteryInfo.attributes.max_participants}\n` +
        `| | EndTime: ${lotteryInfo.attributes.endDate}`
    )*/
    // 判断价格是否小于等于 100 而且没结束还可以Enter
    if (lotteryInfo.attributes.canEnter) {
        if (lotteryInfo.attributes.price <= maxnum) {
            if (await enter_lottery(lotteryInfo.id, pid)) {
                // 成功了
                sussess += 1;
                window.entered.push(pid);
            }
        } else {
            // 太贵
            // window.entered.push(pid);
        }
    } else {
        // 此抽奖已结束或者用户未登录
        window.entered.push(pid);
    }


    return await window.enterLoop(sussess, maxnum);
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getEnterPostContent() {
    return getRandomItemFromArray(['谢谢OP', '谢谢大佬']);
    // https://www.nodeloc.com/d/18632/
    return [
        getRandomItemFromArray(['你好呀！','嗨，朋友们！','大家好！','嘿，大家好~ ']),
        getRandomItemFromArray(['非常感谢 OP 带来的精彩活动，','感谢 OP 在 Nodeloc 举办的抽奖活动，','真是太棒了，感谢我的朋友！','这真是太酷了，感谢分享，']),
        getRandomItemFromArray(['我来参与一下！','想试试我的运气！','我也想加入这个活动~','我来这里参与一下，']),
        getRandomItemFromArray(['希望能看到更多这样的活动！','非常感激你给我这个机会！','期待 OP 未来能有更多精彩的抽奖！']),
        getRandomItemFromArray(['祝大家好运！','希望大家都能中奖！','让我们一起期待结果吧！','祝福每一个参与者！']),
        getRandomItemFromArray(['期待与大家的互动！','希望能在这里结识更多朋友！','让我们一起享受这个活动的乐趣！','希望这个活动能带来更多惊喜！']),
    ].join("")
}

async function enter_lottery(pid, autopost = false) { // 确认抽奖
    let req = await $fetch(`/api/nodeloc/lottery/${pid}/enter`, {
        method: "POST",
        headers: {
            "x-http-method-override": "PATCH"
        }
    })
    let data = await req.json();
    if (data.errors) {
        if (data.errors[0].detail == "您已经参与了此抽奖.") {
            return false;
        }
        if (data.errors[0].detail == "参与抽奖请先回复主题答谢抽奖发起者.") {
            if (autopost) {
                // 自动回复
                let post_req = await $fetch(`/api/posts`, {
                    headers: {
                        "content-type": "application/json; charset=UTF-8",
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        data: {
                            type: "posts",
                            attributes: {
                                content: getEnterPostContent()
                            },
                            relationships: {
                                discussion: {
                                    data: {
                                        type: "discussions",
                                        id: autopost
                                    }
                                }
                            }
                        }
                    })
                })
                let post_ret = await post_req.json();
                if (post_ret.errors) {
                    // 也许是暂时的……？
                    await sleep(6 * 1000);
                    return enter_lottery(pid, autopost);
                }
                return enter_lottery(pid);
            }
            return false;
        }
        console.error(data.errors);
        return false;
    }
    return true;
}

const observer = new MutationObserver(callback);
observer.observe(document.body, { childList: true, subtree: true });


function reCheckLoop() {
    window.checked = false;
    window.checking = false;

    window.getInv = false;

    let now = new Date();
    let tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

    setTimeout(reCheckLoop, tomorrow - now + 100);
}
reCheckLoop();

var setting_index = 0;

function injectSettings() {
    let settings = document.createElement("div");
    settings.id = "NL_settings";
    settings.innerHTML = `
        <div class="s-window">
            <div class="s-topbar">
                <span class="s-title">设置</span>
                <span class="s-close" onclick="close_settings()">
                    <button class="Button Button--icon Button--link hasIcon" type="button" aria-label="关闭">
                        <i aria-hidden="true" class="icon fas fa-times Button-icon"></i>
                        <span class="Button-label"></span>
                    </button>
                </span>
            </div>
            <div class="s-body">
                <div class="s-bodybar">
                    ${Object.keys(settings_ui).map((key, index) => `<p class="${index == setting_index ? `s-sel s-slt`:"s-slt"}" onclick="open_settings(${index})">${key}</p>`).join("\n")}
                </div>
                <div class="s-bodycontent">
                    ${Object.values(settings_ui)[setting_index].map((block) => window.packSettingContentBlock(block)).join("\n")}
                </div>
            </div>

        </div>
    `;
    document.body.appendChild(settings);
};
window.packSettingContentBlock = (block) => {
    return `
        <div class="s-cb">
            <div class="s-cb-do">
                <h3 class="s-cb-title">${block.label}</h3>
                ${window.packSettingDo(block)}
            </div>

            <span class="s-cb-desc">${block.desc}</span>
        </div>
  `
}
window.packSettingDo = (block) => {
    switch (block.type) {
        case 'select':
            return `
                <select class="s-do" onchange="setting_set('${block.name}',this.value,${block.reload})">
                    ${Object.keys(block.data).map((key) => `<option value="${block.data[key]}" ${block.data[key] === SETTINGS[block.name] ? "selected": "" }>${key}</option>`).join("\n")}
                </select>
            `;
            break;
        case 'button':
            return `
                <button class="s-do" onclick="setting_runbutton('${encodeURIComponent(block.func.toString())}',${block.reload})">执行</button>
            `;
            break;
        case 'tf':
            return `
                <button class="s-do" onclick="setting_settf('${block.name}',this,${block.reload})">${SETTINGS[block.name] ? `OFF / <span style="color: var(--link-color);font-weight: bold;">ON</span>` : `<span style="color: var(--link-color);font-weight: bold;">OFF</span> / ON`}</button>
            `;
            break;
        default:
            return `无效 Type: ${block.type}`
    }
}
function reload_warn() {
    $(".s-title").innerHTML = '设置 - <a href="#" onclick="location.reload()">刷新页面以应用更改</a>'
}
window.setting_set = (name, data, reload) => {
    localStorage[`s_${name}`] = data;
    SETTINGS[name] = data;
    if (reload) reload_warn();
}
window.setting_runbutton = (func, reload) => {
    new Function('return ' + decodeURIComponent(func))()();
    if (reload) reload_warn();
}
window.setting_settf = (name, dom, reload) => {
    SETTINGS[name] = !SETTINGS[name];
    localStorage[`s_${name}`] = SETTINGS[name];
    dom.innerHTML = SETTINGS[name] ? `OFF / <span style="color: var(--link-color);font-weight: bold;">ON</span>` : `<span style="color: var(--link-color);font-weight: bold;">OFF</span> / ON`;
    if (reload) reload_warn();
}
window.open_settings = (index = setting_index) => {
    setting_index = index;
    window.close_settings();
    injectSettings();
};
window.close_settings = () => {
    if ($("#NL_settings")) $("#NL_settings").remove();
}


if (SETTINGS.auto_goto && window.location.pathname.startsWith('/goto/')) location.href = decodeURIComponent(window.location.pathname.replace('/goto/',''));

let lastReply = Date.now();
let pingwarn = document.createElement('div');
pingwarn.id = 'ping-warn'
document.body.appendChild(pingwarn);
async function checkPing(lastSuccess = false) {
    if (lastSuccess) lastReply = Date.now();
    try {
        const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

        let req = await Promise.race([
            $fetch("/robots.txt"),
            timeout(2000) // 2秒超时
        ]);

        lastReply = Date.now();
        pingwarn.style.display = 'none';
    } catch (error) {
        console.error(error);
        pingwarn.style.display = 'block';
        updatePingWarn();
        return setTimeout(checkPing, 3000);
    }
    setTimeout(() => checkPing(true), 10000);
}
function updatePingWarn() {
    if (pingwarn.style.display == 'block') pingwarn.innerText = `⚠ 服务器已落后 ${Math.floor((Date.now() - lastReply) / 1000)} 秒，此时你可能无法进行操作`;
}
setInterval(updatePingWarn, 1000);
if (SETTINGS.ping_warn) checkPing();
