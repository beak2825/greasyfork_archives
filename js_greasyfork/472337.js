// ==UserScript==
// @name        吾爱折叠 - 自动折叠水贴
// @namespace   peasoft.github.io
// @match       *://www.52pojie.cn/forum.php?*mod=viewthread*
// @match       *://www.52pojie.cn/thread-*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_notification
// @version     1.2
// @author      陆鎏澄
// @description 在吾爱破解论坛手动或自动折叠不想看到的帖子，如水贴和已被屏蔽的帖子。
// @run-at      document-end
// @icon        https://www.52pojie.cn/favicon.ico
// @license     CC BY-NC-SA
// @downloadURL https://update.greasyfork.org/scripts/472337/%E5%90%BE%E7%88%B1%E6%8A%98%E5%8F%A0%20-%20%E8%87%AA%E5%8A%A8%E6%8A%98%E5%8F%A0%E6%B0%B4%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/472337/%E5%90%BE%E7%88%B1%E6%8A%98%E5%8F%A0%20-%20%E8%87%AA%E5%8A%A8%E6%8A%98%E5%8F%A0%E6%B0%B4%E8%B4%B4.meta.js
// ==/UserScript==

// 拦截词后续还会更新，欢迎补充！
const stopWordsStr = "\u2006 \u00a0 \u0020 \u0008 \u0009 \u000a \u000b \u000c \u000d \u2028 \u2029 \ufeff \u200e \u200d \u3000 \t \n ( ) [ ] { } < > , . ? ! \' \" : ; / | \\ + - _ （ ） 【 】 《 》 ， 。 ？ ！ ‘ ’ “ ” ： ； 、 · … — 我 你 佬 神 牛b 牛皮 牛批 流批 流皮 牛 膜 拜 什么 怎么样 怎么 感 谢 謝 觉 可能 好像 分享 虽然 但是 有 用 没用 没什么用 不上 帮 帮忙 顶 一下 不懂 软件 是 个 这 那 哪 的 得 地 了 啦 拉 辣 路过 走过 跑过 飘过 过 收藏 加分 给分 点赞 优秀 了解 支持 学习 学 到 真 很 挺 好 啊 厉害 试 看 观 望 不错 前排 后排 进 来 吧 呢 哈 嘛 阿 呵 哎 唉 也 太 极 绝 几 就 愣 啥 6 謝 体验 意思 帖 子 不明觉厉 借 玩 羡慕 期待 座 坐 等 方便 提供 先 保存 逼 嘻 nice 非常 无私 才行 上 下 写 详 仔 细 由衷 敬佩 倾佩 钦佩 经典 实用 用不 恰 需 要 沙发 板凳 地板 必 须 lz 强"
const stopWords = stopWordsStr.split(' ').sort((a, b) => b.length - a.length);
let config = {};
const keys = {"noBlocked": "自动折叠被屏蔽的贴子", "noJunk": "自动折叠疑似灌水贴", "scrollSupport": "兼容自动翻页（可能导致页面卡顿）"};
const defaults = {"noBlocked": true, "noJunk": true, "scrollSupport": false};
let customStopWords = [];
let customStopWordsSorted = [];
let menuIds = [];

function readConfig(){
    for (const key in keys) {
        config[key] = GM_getValue(key);
        if (config[key] === undefined) {
            GM_setValue(key, defaults[key]);
            config[key] = defaults[key];
        }
    }
    customStopWords = GM_getValue("customStopWords");
    customStopWordsSorted = customStopWords.sort((a, b) => b.length - a.length);
    if (!customStopWords){
        customStopWords = [];
        customStopWordsSorted = [];
        GM_setValue("customStopWords", []);
    }
}

function switchConfig(key){
    config[key] = !config[key];
    GM_setValue(key, config[key]);
    unregMenu();
    regMenu();
    GM_notification({text: "设置将在刷新页面后生效！\n（点此刷新页面）", title: "吾爱折叠", onclick: () => {location.reload()}});
}

function editStopWords(){
    let newWordsStr = prompt("请输入新的屏蔽词列表，不同词之间使用空格隔开：", customStopWords.join(' ')).trim();
    if (newWordsStr === null) {return}
    GM_setValue("customStopWords", newWordsStr?newWordsStr.split(' '):[]);
    GM_notification({text: "设置将在刷新页面后生效！\n（点此刷新页面）", title: "吾爱折叠", onclick: () => {location.reload()}});
}

function regMenu(){
    for (const key in keys) {
        menuIds.push(GM_registerMenuCommand((config[key]?'✅':'❌')+' '+keys[key], () => {switchConfig(key)}));
    }
    menuIds.push(GM_registerMenuCommand("📘 自定义屏蔽词（现有 "+customStopWords.length+" 个）", editStopWords));
}

function unregMenu(){
    menuIds.forEach(id => {GM_unregisterMenuCommand(id)});
    menuIds = [];
}

function hidePost(post, action = "显示被折叠的楼层 ↧", mark = false){
    post.style.display = "none";
    if (mark) {post.style.backgroundColor = "#FFECEC"}
    if (post.nextElementSibling) {
        post.nextElementSibling.style.display = "unset";
        return;
    }
    let showBtn = document.createElement("div");
    showBtn.className = "pgbtn";
    showBtn.style.display = "unset";
    showBtn.insertAdjacentHTML("beforeend",'<a href="javascript:;" hidefocus="true" class="bm_h" style="margin-bottom: 0; border-radius: 0">'+action+'</a>');
    showBtn.addEventListener("click", showPost);
    post.parentNode.appendChild(showBtn);
}

function showPost(){
    this.previousElementSibling.style.display = '';
    this.style.display = "none";
}

function hidePostH(){
    hidePost(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
}

function showButtons(){
    let headers = document.querySelectorAll("div.pti > div.authi");
    headers.forEach(header => {
        if (!header.dataset.foldShowed) {
            header.dataset.foldShowed = true;
            header.insertAdjacentHTML("beforeend",'<span class="pipe">|</span>');
            if (header.querySelector("span.none")) {
                header.lastChild.classList.add("show");
            }
            header.insertAdjacentHTML("beforeend",'<a href="javascript:;">折叠此层</a>');
            header.lastChild.addEventListener("click", hidePostH);
            if (header.querySelector("span.none")) {
                header.lastChild.classList.add("show");
            }
        }
    });
}

function autoHide(){
    let avatars = document.querySelectorAll("div.pls > div > div.avatar");
    avatars.forEach(avatar => {
        const post = avatar.parentNode.parentNode.parentNode.parentNode.parentNode;
        if (!post.parentNode.classList.contains("res-postfirst") && !post.dataset.foldChecked) {
            post.dataset.foldChecked = true;
            const author = post.querySelector("div.pls > div.pi > div.authi > a.xw1").innerText;
            const authorHTML = '<span style="letter-spacing: normal">'+author+'</span> ';
            if (config["noBlocked"] && avatar.innerText == "头像被屏蔽") {
                hidePost(post, authorHTML+"的帖子被管理员或版主屏蔽");
            }
            else {
                if (config["noJunk"] && !post.querySelector("div.pti > div.authi > span.firstauthor")){
                    // 不屏蔽楼主
                    let text = post.querySelector("td.t_f").innerText.replaceAll(' ','').toLowerCase();
                    customStopWordsSorted.forEach(word => {text = text.replaceAll(word, '')});
                    stopWords.forEach(word => {text = text.replaceAll(word, '')});
                    if (text.length < 3) {
                        hidePost(post, authorHTML+"发布的疑似水贴被自动折叠", true);
                    }
                }
            }
        }
    });
}

readConfig();
unregMenu();
regMenu();
autoHide();
showButtons();
if (config["scrollSupport"]) {
    setInterval(autoHide, 1000);
    setInterval(showButtons, 1000);
}
