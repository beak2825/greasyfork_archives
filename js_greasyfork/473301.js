// ==UserScript==
// @name         快捷键复制 MarkDown 格式的超链接或标题
// @namespace    https://greasyfork.org/users/518374
// @version      0.3
// @description  用快捷键复制 MarkDown 格式的超链接或标题到剪贴板
// @author       InMirrors
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @icon         https://plugins.jetbrains.com/files/18897/166369/icon/pluginIcon.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473301/%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%A4%8D%E5%88%B6%20MarkDown%20%E6%A0%BC%E5%BC%8F%E7%9A%84%E8%B6%85%E9%93%BE%E6%8E%A5%E6%88%96%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/473301/%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%A4%8D%E5%88%B6%20MarkDown%20%E6%A0%BC%E5%BC%8F%E7%9A%84%E8%B6%85%E9%93%BE%E6%8E%A5%E6%88%96%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {

    'use strict';

    function copyWithConfirmation(text) {
        GM_setClipboard(text);

        // Show confirmation message
        var confirmation = document.createElement("div");
        confirmation.innerHTML = "Copied";
        confirmation.style.cssText = `
        position : fixed;
        left : 50%;
        bottom : 30px;
        padding : 10px;
        background : lightgreen;
        opacity : 0.8;
        border-radius : 20px;
        box-shadow: 0px 0px 3px teal;
        font-weight : bold;
        font-size:15px;
        z-index : 999;
        `

        document.body.appendChild(confirmation);

        // Remove after 2 seconds
        setTimeout(function() {
            confirmation.remove();
        }, 2000);
    }

    GM_registerMenuCommand("复制标题及链接", () => copyWithConfirmation(`[${document.title}](${document.URL})`));

    GM_registerMenuCommand("仅复制标题", () => copyWithConfirmation(document.title));

    GM_registerMenuCommand("仅复制链接", () => copyWithConfirmation(document.URL));

    document.onkeydown = function(event) { // 修改以下的 if 条件实现自定义快捷键，键值请参见：https://keycode.info/
        if (event.altKey && event.keyCode == 82) {
            copyWithConfirmation(document.title);
        }
        if (event.shiftKey && event.altKey && event.keyCode == 82) {
            copyWithConfirmation(`[${document.title}](${document.URL})`);
        }
        if (event.altKey && event.keyCode == 72) {
            copyWithConfirmation(`<a href="${document.URL}">${document.title}</a>`);
        }
    }
})();
