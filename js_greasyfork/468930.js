// ==UserScript==
// @name         Keylol Helper
// @namespace    http://tampermonkey.net/
// @version      0.2.8
// @description  Keylol Helper 提供其乐论坛多便捷功能支持，包括自动检测是否有其乐消息，
// @author       shiquda
// @namespace    https://github.com/shiquda/shiquda_UserScript
// @supportURL   https://github.com/shiquda/shiquda_UserScript/issues
// @match        *://*/*
// @icon         https://keylol.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/468930/Keylol%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/468930/Keylol%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 用户配置
    const botID = "" // 指定的ASF bot名字
    const message = "{:17_1010:}"// 自动回复要发送的信息，默认为阿鲁点赞
    const checkInterval = 5; // 检测消息间隔，单位是分钟
    const noticeTimeout = 10; // Win10/11通知显示时间，单位是秒





    const featureInfo = [
        '检测是否有其乐消息',
        '添加自动回复功能',
        '抽奖自动加愿望单',
        '快速跳转激活key',
        '检查是否已回贴'
    ]

    for (var i = 0; i < featureInfo.length; i++) {
        setMenu(featureInfo[i])
    }
    checkNotice()
    if (isInKeylol()) {
        noticeAlert()
    }
    if (isInThread()) {
        addCSS()
        amIReplied()
        autoReply()
        keyGiving()
        addList()
    }
    if (isNotice()) {
        addNotice()
    }

    function setMenu(name) {
        const status = (GM_getValue(name) !== undefined) ? GM_getValue(name) : initialize(name);
        GM_registerMenuCommand(`${name}: ${status}`, () => {
            GM_setValue(name, !status);
            window.location.reload();
        });
        function initialize(name) {
            GM_setValue(name, true)
            return true
        }
    }


    // 判断是否在帖子页面
    function isInThread() {
        const url = window.location.href;
        return (url.includes('https://keylol.com/t') || url.includes('https://keylol.com/forum.php?mod=viewthread'))
    }

    function isNotice() {
        const url = window.location.href
        return (url.includes('https://keylol.com/home.php?mod=space&do=notice'))
    }

    function isInKeylol() {
        const url = window.location.href
        return (url.includes('https://keylol.com'))
    }

    // 添加样式
    function addCSS() {
        GM_addStyle(`
        .s_btn {
            display: inline-block;
            padding: 9px 8px;
            font-size: 20px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            background-color: #57b9e7;
            color: #FFFFFF;
            cursor: pointer;
        }
        
        .s_btn:hover {
            background-color: #0056b3;
        }
        
        .s_btn:active {
            background-color: #003d80;
        }
        
        .s_btn:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
        }
            }
        `)
    }
    // 添加自动回复功能
    function autoReply() {
        if (!GM_getValue('添加自动回复功能')) return


        createUI1()


        function post() {
            document.querySelector("#post_reply").click()
            setTimeout(() => { document.querySelector("#postmessage").value = message }, 1000)
            setTimeout(() => { document.querySelector("#postsubmit").click(); }, 1050)
        }
        function createUI1() {
            var tab = document.querySelector("#pgt")
            var btn = document.createElement("button")
            btn.className = "s_btn"
            btn.textContent = "自动回帖"
            btn.title = `自动回复：${message}`
            btn.addEventListener("click", start)
            tab.appendChild(btn)
        }
        function start() {
            console.log("start")
            post()
        }
    }

    // 快速跳转激活key
    function keyGiving() {
        if (!GM_getValue('快速跳转激活key')) return
        if (document.querySelector(".subforum_left_title_left_up").innerText.indexOf("[明Key]") > -1) {
            const url = 'https://store.steampowered.com/account/registerkey'
            const tab = document.querySelector("#pgt")
            const container = document.createElement('button');
            container.classList.add('s_btn');
            container.textContent = '点击跳转到 Steam 激活页面';
            container.addEventListener("click", () => { window.open(url) })
            tab.appendChild(container)
        }
    }

    // 抽奖自动加愿望单
    function addList() {

        if (!GM_getValue('抽奖自动加愿望单')) return

        if (judge()) {
            createUI2()
        }

        function judge() {
            return (document.querySelector(".subforum_left_title_left_up").innerText.indexOf("[活动推广]") > -1)
        }
        function getAppID(urls) {
            var AppIDs = []
            if (urls.length === 0) {
                return AppIDs; // 如果urls数组为空，直接返回空数组
            }
            for (var i = 0; i < urls.length; i++) {
                var AppID = urls[i].src.match(/^https:\/\/store\.steampowered\.com\/widget\/(\d+)/)
                if (AppID && AppID[1]) {
                    AppIDs.push(AppID[1])
                }
            }
            AppIDs = [...new Set(AppIDs)]
            return AppIDs
        }

        function createUI2() {
            let urls = document.querySelectorAll("iframe")
            const IDList = getAppID(urls)
            console.log(IDList)
            if (IDList.length === 0) { return }
            var txt = `ADDWISHLIST ${botID} `;
            for (var i = 0; i < IDList.length; i++) {
                txt += (IDList[i] + ",")
            }
            txt = txt.slice(0, -1)
            const tab = document.querySelector("#pgt")
            const container = document.createElement('button');
            container.classList.add('s_btn');
            container.textContent = '复制愿望单ASF代码';
            container.addEventListener("click", () => { setCopy(txt, `ASF代码复制成功：${txt}`) })
            tab.appendChild(container)
        }
    }


    // 检测是否有其乐消息
    function checkNotice() {
        if (!GM_getValue('检测是否有其乐消息')) return
        let t = getBriefTime()
        var lastExecutionTimestamp = GM_getValue("lastExecutionTimestamp");
        var currentTimestamp = new Date().getTime();
        if (
            !lastExecutionTimestamp ||
            currentTimestamp - lastExecutionTimestamp > checkInterval * 60 * 1000
        ) check()
        else {
            console.log(`${t}   时间间隔在${checkInterval}分钟内.`);
            return;
        }
        setTimeout(check, (checkInterval * 60 + 1) * 1000)
        function check() {
            let t = getBriefTime()
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://keylol.com/home.php?mod=space&do=notice",
                onload: function (response) {
                    // 在响应中查找具有"btn-user-action-highlight"类的元素
                    var responseHTML = response.responseText;
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(responseHTML, "text/html");
                    var elements = doc.getElementsByClassName(
                        "btn-user-action-highlight"
                    );
                    if (elements.length > 0) {
                        var newNotices = doc.querySelectorAll('[style="color:#000;font-weight:bold;"]')
                        var noticeID = GM_getValue("noticeID") ? GM_getValue("noticeID") : []
                        for (var i = 0; i < newNotices.length; i++) {
                            noticeID.push(newNotices[i].parentElement.getAttribute("notice"))
                        }
                        GM_setValue("noticeID", noticeID)
                        GM_notification({
                            text: "点击前往", // 通知的文本内容
                            title: `Keylol有消息！`, // 通知的标题（可选）
                            timeout: 1000 * noticeTimeout, // 通知显示的时间（毫秒），过了时间后通知会自动关闭（可选）
                            onclick: function () {
                                window.open(
                                    "https://keylol.com/home.php?mod=space&do=notice"
                                );
                            },
                        });
                    } else {
                        console.log(`${t}   keylol没有通知.`);
                    }
                },
                onerror: function (error) {
                    console.error(error); // 处理错误
                },
            });
            GM_setValue("lastExecutionTimestamp", currentTimestamp);
        }
        function getBriefTime(d) {
            d = d ? new Date() : new Date();
            // 获取小时、分钟和秒
            let hours = d.getHours();
            let minutes = d.getMinutes();
            let seconds = d.getSeconds();
            // 格式化小时、分钟和秒，确保它们始终是两位数
            hours = (hours < 10 ? "0" : "") + hours;
            minutes = (minutes < 10 ? "0" : "") + minutes;
            seconds = (seconds < 10 ? "0" : "") + seconds;
            const currentTime = hours + ":" + minutes + ":" + seconds;
            // 返回当前时间
            return currentTime;
        }
    }

    function noticeAlert() {
        if (!GM_getValue('检测是否有其乐消息')) return
        if (GM_getValue("noticeID")?.length > 0) {
            // console.log(GM_getValue("noticeID"))
            // 寻找提醒元素
            const elements = document.querySelectorAll(".btn-user-action");
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (element.textContent.trim() === "提醒") {
                    element.classList.add("btn-user-action-highlight")
                    break
                }
            }
        }
    }

    function addNotice() {
        if (!GM_getValue('检测是否有其乐消息')) return
        const list = GM_getValue("noticeID")
        console.log(list);
        for (var i = 0; i < list.length; i++) {
            document.querySelector(`[notice="${list[i]}"]`).querySelector(".ntc_body").style = "color:#000;font-weight:bold;"
        }
        GM_setValue("noticeID", [])
    }

    // 检测帖子是否已回复 感谢@chr_
    async function amIReplied() {
        "use strict";
        if (!GM_getValue('检查是否已回贴')) return

        if ((location.pathname === "/forum.php" && !location.search.includes("tid")) || location.search.includes("authorid")) {
            return;
        }

        const inlineMode = window.localStorage.getItem("air_inline") ?? "关";

        const isDiscuz = typeof discuz_uid != "undefined";

        const userId = isDiscuz ? discuz_uid : __CURRENT_UID;

        const testUrl = location.href + (location.search ? `&authorid=${userId}` : `?authorid=${userId}`);

        fetch(testUrl)
            .then((res) => res.text())
            .then((html) => {
                const replied = !(html.includes("未定义操作") || html.includes("ERROR:"));

                const text = replied ? "✅已经回过贴了" : "❌还没回过贴子";

                const tips = document.createElement("a");
                tips.textContent = text;
                if (replied) {
                    tips.href = testUrl;
                } else {
                    tips.addEventListener("click", () => {
                        if (isDiscuz) {
                            showError("❌还没回过贴子");
                        }
                        else {
                            alert("❌还没回过贴子");
                        }
                    });
                }

                if (isDiscuz) {
                    const btnArea = inlineMode !== "开" ?
                        document.querySelector("#pgt") :
                        document.querySelector("#postlist td.plc div.authi>span.none") ??
                        document.querySelector("#postlist td.plc div.authi>span.pipe");

                    if (btnArea === null) {
                        return;
                    }

                    if (btnArea.tagName === "SPAN") {
                        const span = document.createElement("span");
                        span.textContent = "|";
                        span.className = "pipe";
                        const bar = btnArea.parentNode;
                        bar.insertBefore(span, btnArea);
                        bar.insertBefore(tips, btnArea);
                    } else {
                        btnArea.appendChild(tips);
                    }
                } else {
                    const btnArea = document.querySelector("#m_nav>.nav");
                    const anchor = btnArea.querySelector("div.clear");

                    if (btnArea === null || anchor === null) {
                        return;
                    }

                    tips.className = "nav_link";
                    btnArea.insertBefore(tips, anchor);
                }

            });
    }
}
)();
