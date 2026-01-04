// ==UserScript==
// @name         复制 MarkDown 格式的超链接到剪贴板
// @namespace    https://gist.github.com/vhxubo/e94b0cceadf0291050f05ab1c0bb19c9
// @homepage     https://gist.github.com/vhxubo/e94b0cceadf0291050f05ab1c0bb19c9
// @version      0.3
// @description  快速复制 MarkDown 格式的超链接到剪贴板，格式: [标题](网址)
// @author       Vhxubo
// @note         新增快捷键快速复制标题及链接：Alt + k，修改第22行的代码实现自定义，键值请参见：https://keycode.info/
// @note         请勿同时使用其它快捷键插件/脚本
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/403081/%E5%A4%8D%E5%88%B6%20MarkDown%20%E6%A0%BC%E5%BC%8F%E7%9A%84%E8%B6%85%E9%93%BE%E6%8E%A5%E5%88%B0%E5%89%AA%E8%B4%B4%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/403081/%E5%A4%8D%E5%88%B6%20MarkDown%20%E6%A0%BC%E5%BC%8F%E7%9A%84%E8%B6%85%E9%93%BE%E6%8E%A5%E5%88%B0%E5%89%AA%E8%B4%B4%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand("复制标题及链接", () => GM_setClipboard(`[${document.title}](${document.URL})`));
    GM_registerMenuCommand("仅复制标题", () => GM_setClipboard(document.title));
    GM_registerMenuCommand("仅复制链接", () => GM_setClipboard(document.URL));

    document.onkeydown = function(event) {
        if (event.altKey && event.keyCode == 75) {
            GM_setClipboard(`[${document.title}](${document.URL})`);
        }
    }
})();