// ==UserScript==
// @name               Unlock Website Limit
// @name:zh-TW         解鎖網頁事件
// @namespace          https://github.snkms.com/
// @version            0.9
// @description        Unlock website events, including right click, selection lock, copy and cut, etc.
// @description:zh-TW  使用Javascript解除部分網頁事件，包括鎖右鍵、鎖複製等等
// @author             SN-Koarashi (5026)
// @match              *://*/*
// @grant              none
// @supportURL         https://discord.gg/q3KT4hdq8x
// @license            MIT
// @run-at             document-idle
// @downloadURL https://update.greasyfork.org/scripts/404665/Unlock%20Website%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/404665/Unlock%20Website%20Limit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const original = Event.prototype.preventDefault;

    Event.prototype.preventDefault = function() {
        // 判斷條件：只對 contextmenu、copy、selectstart 等事件無效
        if (this.type === 'contextmenu' || this.type === 'copy' || this.type === 'selectstart') {
            // 不做任何事，阻止 preventDefault
            return;
        }
        // 對其他事件保留原功能
        return original.call(this);
    };

    function unBlockFunc(node, eventName) {
        var onData = "on" + eventName;

        // 解除該節點的事件
        if (node[onData]) node[onData] = null;

        // 加事件監聽器防止捕獲階段被阻擋
        node.addEventListener(eventName, function(e) {
            for (var n = e.target; n; n = n.parentNode) {
                n[onData] = null;
            }
        }, true);

        // 如果節點有 shadow root 就遞迴
        if (node.shadowRoot) {
            traverse(node.shadowRoot, eventName);
        }

        // 遞迴到子元素
        node.childNodes.forEach(child => traverse(child, eventName));

        // 處理同源 iframe
        if (node.tagName === 'IFRAME') {
            try {
                const doc = node.contentWindow.document;
                if (doc) unBlockFunc(doc, eventName);
            } catch (e) {
                // 無法存取跨域 iframe
                console.warn('跨域 iframe 無法操作:', node.src);
            }
        }
    }

    function traverse(node, eventName) {
        unBlockFunc(node, eventName);
    }

    function ObjectLength(object) {
        return Object.keys(object).length;
    }

    function start(){
        var hookEvents = [
            "contextmenu",
            "click",
            "mousedown",
            "mouseup",
            "keydown",
            "keyup",
            "selectstart",
            "select",
            "copy",
            "cut",
            "dragstart"
        ];

        hookEvents.forEach(eventName => {
            traverse(document, eventName);
        });

        // 解鎖文字選取
        var css = document.createElement("style");
        css.textContent = "*{-ms-user-select: auto !important;-moz-user-select: auto !important;-webkit-user-select: auto !important;user-select: auto !important;}";
        document.body.appendChild(css);
    }

    let timeoutId;

    const observer = new MutationObserver((mutationsList) => {
        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            observer.disconnect();
            start();
        }, 1500);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("DOMContentLoaded", function() {
        start();
    });
})();
