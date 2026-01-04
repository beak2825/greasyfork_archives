// ==UserScript==
// @name            YouTube User Block
// @name:en         YouTube User Block
// @namespace       https://github.com/ChanthMiao/
// @icon            https://visualpharm.com/assets/42/Invisible-595b40b65ba036ed117d2e78.svg
// @version         1.6.2
// @description     YouTube用户黑名单，拉黑指定用户（自动隐藏其评论，可手动查看）。
// @description:en  YouTube User BlockList，blocking specific users (hide all their comments, support manual viewing).
// @author          ChanthMiao
// @match           *://www.youtube.com/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @grant           GM_registerMenuCommand
// @grant           GM_addValueChangeListener
// @grant           GM_notification
// @compatible      chrome
// @compatible      firefox
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/421150/YouTube%20User%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/421150/YouTube%20User%20Block.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function toggleButton(element) {
        // Check to see if the button is pressed
        var pressed = (element.getAttribute("aria-pressed") === "true");
        const user = element.parentElement.parentElement.parentElement.parentElement.querySelector("#author-text > span").textContent.trim();
        if (!pressed && !blockList.includes(user)) {
            blockUser(user);
        } else if (pressed && blockList.includes(user)) {
            unblockUser(user);
        }
    }
    function handleBtnClick(event) {
        toggleButton(event.target);
    }
    function handleBtnKeyDown(event) {
        // Check to see if space or enter were pressed
        if (event.key === " " || event.key === "Enter" || event.key === "Spacebar") { // "Spacebar" for IE11 support
            // Prevent the default action to stop scrolling when space is pressed
            event.preventDefault();
            toggleButton(event.target);
        }
    }
    function createNodeListener(node, config, mutationCallback) {
        const observer = new MutationObserver(mutationCallback);
        observer.observe(node, config);
        return observer;
    }
    function injectBlockButton(comment) {
        const user = comment.querySelector("#author-text > span").textContent.trim();
        const arc = comment.querySelector("#creator-heart");
        var block = document.createElement("div");
        block.setAttribute("id", "block-button");
        if (blockList.includes(user)) {
            block.setAttribute("title", uiText.unblock);
        } else {
            block.setAttribute("title", uiText.block);
        }
        var btn = document.createElement("button");
        btn.setAttribute("id", "block-button-item");
        btn.setAttribute("role", "button");
        btn.setAttribute("aria-pressed", blockList.includes(user));
        btn.addEventListener("tap", handleBtnClick, false);
        btn.addEventListener("keydown", handleBtnKeyDown, false);
        block.append(btn);
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("id", "block-button-icon");
        svg.setAttribute("viewbox", "0 0 24 24");
        svg.setAttribute("width", "16px");
        svg.setAttribute("height", "16px");
        svg.setAttribute("focusable", false);
        svg.setAttribute("class", "style-scope yt-icon");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.setAttribute("style", "pointer-events: none;display: block;width: 100%;height: 100%;");
        btn.append(svg);
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "style-scope yt-icon");
        svg.append(g);
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M 8 4.667969 C 9.839844 4.667969 11.332031 6.160156 11.332031 8 C 11.332031 8.433594 11.246094 8.839844 11.09375 9.21875 L 13.039062 11.167969 C 14.046875 10.328125 14.839844 9.238281 15.328125 8 C 14.171875 5.074219 11.328125 3 7.992188 3 C 7.058594 3 6.167969 3.167969 5.339844 3.464844 L 6.78125 4.90625 C 7.160156 4.753906 7.566406 4.667969 8 4.667969 Z M 1.332031 2.847656 L 2.851562 4.367188 L 3.160156 4.671875 C 2.054688 5.535156 1.1875 6.679688 0.667969 8 C 1.820312 10.925781 4.667969 13 8 13 C 9.035156 13 10.019531 12.800781 10.921875 12.441406 L 11.199219 12.71875 L 13.152344 14.667969 L 14 13.820312 L 2.179688 2 Z M 5.019531 6.535156 L 6.054688 7.566406 C 6.019531 7.707031 6 7.851562 6 8 C 6 9.105469 6.894531 10 8 10 C 8.148438 10 8.292969 9.980469 8.433594 9.945312 L 9.464844 10.980469 C 9.019531 11.199219 8.527344 11.332031 8 11.332031 C 6.160156 11.332031 4.667969 9.839844 4.667969 8 C 4.667969 7.472656 4.800781 6.980469 5.019531 6.535156 Z M 7.894531 6.011719 L 9.992188 8.113281 L 10.007812 8.007812 C 10.007812 6.898438 9.113281 6.007812 8.007812 6.007812 Z M 7.894531 6.011719 ");
        path.setAttribute("class", "style-scope yt-icon");
        g.append(path);
        arc.before(block);
    }
    function commentHandler(comment) {
        const user = comment.querySelector("#author-text > span").textContent.trim();
        var btnDiv = comment.querySelector("#block-button");
        var btn = btnDiv.children[0];
        if (blockList.includes(user)) {
            comment.setAttribute("user-blocked", true);
            btnDiv.setAttribute("title", uiText.unblock);
            btn.setAttribute("aria-pressed", true);
        } else {
            comment.setAttribute("user-blocked", false);
            btnDiv.setAttribute("title", uiText.block);
            btn.setAttribute("aria-pressed", false);
        }
    }
    function blockUser(user) {
        blockList.push(user); // 添加黑名单,使后续dom由callback处理
        GM_setValue("blockList", blockList);
        // 更正已由callback处理过的dom
        document.querySelectorAll("ytd-comment-renderer[user-blocked='false']").forEach((v, i) => {
            commentHandler(v);
        });
    }
    function unblockUser(user) {
        blockList = blockList.filter(v => v != user); // 从黑名单移除用户,使后续dom由callback处理
        GM_setValue("blockList", blockList);
        // 更正已由callback处理过的dom
        document.querySelectorAll("ytd-comment-renderer[user-blocked='true']").forEach((v, i) => {
            commentHandler(v);
        });
    }
    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                var nodes = mutation.addedNodes;
                nodes.forEach((v, i) => {
                    if (v.nodeName === 'YTD-COMMENT-RENDERER') {
                        if (!v.querySelector("#block-button")) {
                            injectBlockButton(v); // 注入拉黑按钮
                        }
                        commentHandler(v);
                    }
                })
            }
        }
    }
    const callback_top = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                var nodes = mutation.addedNodes;
                nodes.forEach((v, i) => {
                    var comments_entry = document.querySelector('ytd-item-section-renderer > #contents:not([hooked])');
                    if (comments_entry) {
                        comments_entry.setAttribute("hooked", true);
                        observer.disconnect();
                        createNodeListener(comments_entry, config, callback);
                    }
                })
            }
        }
    }
    function blockReset() {
        blockList = [];
        GM_setValue("blockList", blockList);
        document.querySelectorAll("ytd-comment-renderer[user-blocked='true']").forEach((v, i) => {
            commentHandler(v);
        });
        sendNotification(uiText.resetSuccess);
    }
    function blockExport() {
        var link = document.createElement("a");
        var text = encodeURIComponent(JSON.stringify(blockList, null, 2));
        link.setAttribute("download", "blockList.json");
        link.setAttribute("href", "data:application/json;charset=utf-8," + text);
        link.click();
    }
    const distinct = (value, index, self) => { return self.indexOf(value) === index; };
    function handleFileSelect(e) {
        var files = e.target.files;
        var file = files[0];
        if (file.type != "application/json") {
            sendNotification(uiText.InvaildFile);
            return;
        }
        var reader = new FileReader();
        reader.onload = (e) => {
            try {
                var content = JSON.parse(e.target.result);
                if (Array.isArray(content)) {
                    blockList = content.concat(blockList).filter(distinct);//拼接，去重。
                    GM_setValue("blockList", blockList);
                    // 更正已由callback处理过的dom
                    document.querySelectorAll("ytd-comment-renderer[user-blocked='false']").forEach((v, i) => {
                        commentHandler(v);
                    });
                    sendNotification(uiText.ImportSuccess);
                } else {
                    sendNotification(uiText.InvaildFile);
                }
            } catch (e) {
                sendNotification(e);
            }
        }
        reader.readAsText(file);
    }
    function blockImport() {
        var input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "application/json");
        input.addEventListener("change", handleFileSelect);
        input.click();
    }
    function registerCrossTabHandler() {
        if (GM_addValueChangeListener) {
            GM_addValueChangeListener("blockList", (name, oldValue, newValue, remote) => {
                // 监听来自其他Tab的数据变动
                if (remote) {
                    blockList = newValue;
                    document.querySelectorAll("ytd-comment-renderer[user-blocked]").forEach((v, i) => {
                        commentHandler(v);
                    });
                }
            });
        } else if (!GM_getValue("API_CHECKED")) {
            GM_setValue("API_CHECKED", true);
            sendNotification(uiText.apiChecked);
        }
    }
    function sendNotification(msg) {
        if (typeof GM_notification === 'function') {
            // 使用Tampermonkey提供的通知API
            GM_notification({ text: msg, title: scriptName, image: icon64, timeout: msgTimeout })
        } else {
            if (!("Notification" in window)) {
                // 不支持html5的通知机制，回退至alert
                setTimeout(() => { alert(msg); }, 1);
            } else if (Notification.permission === "granted") {
                // 已授权，创建通知
                var ntf = new Notification(scriptName, { body: msg, lang: lang, icon: icon64 });
                if (msgTimeout) {
                    setTimeout(() => { ntf.close() }, msgTimeout);
                }
            } else if (Notification.permission !== "denied") {
                // 未明确拒绝，尝试申请通知权限
                Notification.requestPermission().then((permission) => {
                    if (permission === "granted") {
                        var ntf = new Notification(scriptName, { body: msg, lang: lang, icon: icon64 });
                        if (msgTimeout) {
                            setTimeout(() => { ntf.close() }, msgTimeout);
                        }
                    }
                })
            }
        }
    }
    /**
    * @type {string[]}
    */
    var blockList = GM_getValue("blockList");
    if (!blockList) {
        blockList = [];
    }
    const scriptName = "YouTube User Block"
    const icon64 = "data:image/png;base64,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"
    const msgTimeout = 8000; //ms
    const lang = (navigator.language || navigator.userLanguage);
    var uiText = {
        menuR: "重置",
        menuI: "导入",
        menuE: "导出",
        block: "拉黑",
        unblock: "解封",
        resetSuccess: "黑名单重置成功！",
        ImportSuccess: "黑名单导入成功",
        InvaildFile: "错误，文件格式非法！",
        apiChecked: "GM_addValueChangeListener未定义，无法同步跨标签操作！"
    };
    switch (lang) {
        case "zh-CN":
            // do nothing
            break;
        case "en-US":
        default:
            // fallback to english.
            uiText = {
                menuR: "Reset",
                menuI: "Import",
                menuE: "Export",
                block: "block",
                unblock: "unblock",
                resetSuccess: "Blocklist resets successfully!",
                ImportSuccess: "Blocklist Import successfully!",
                InvaildFile: "Error, invaild file format!",
                apiChecked: "GM_addValueChangeListener undefined, unable to sync cross-tab operations!"
            };
    }
    GM_addStyle("ytd-comment-renderer[user-blocked='true']{height:1.8rem;opacity:0.3;overflow:hidden;box-shadow:0 0 5px #F44336;}"
        + "ytd-comment-renderer[user-blocked='true']:hover{height:auto;transition:all 1s;-ms-transition:all 1s;-o-transition:all 1s;-moz-transition:all 1s;-webkit-transition:all 1s;opacity:1;}"
        + "#block-button{width:32px;height:32px;border:none;border-radius:50%;outline:none;}"
        + "#block-button-item{cursor:pointer;width:32px;height:32px;border:none;outline:none;padding: 8px;border-radius:50%;background:none;}"
        + "#block-button-item:active{width:32px;height:32px;background: radial-gradient(#ffffff,#E2E2E2);}"
        + "#block-button-icon{fill:grey;}"
        + "#block-button-item[aria-pressed='true']>#block-button-icon{fill:#065FD4;}");
    const targetNode = document.querySelector('ytd-app');
    const config = { attributes: false, childList: true, subtree: true };
    createNodeListener(targetNode, config, callback_top);
    registerCrossTabHandler();
    GM_registerMenuCommand(uiText.menuR, blockReset, "R");
    GM_registerMenuCommand(uiText.menuI, blockImport, "I");
    GM_registerMenuCommand(uiText.menuE, blockExport, "E");
})();