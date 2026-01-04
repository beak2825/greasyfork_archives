// ==UserScript==
// @name         GPT-HISTORY-PRINTER
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  导出GPT聊天记录为PDF文件，按下Ctrl+P即可导出。
// @author       You
// @match        https://chatgpt.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/495586/GPT-HISTORY-PRINTER.user.js
// @updateURL https://update.greasyfork.org/scripts/495586/GPT-HISTORY-PRINTER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * @param {string} selectors 
     * @returns {HTMLElement[]}
     */
    function my$(selectors) {
        return [...document.querySelectorAll(selectors)];
    }

    function clean() {
        const to_be_removed = '[class*="juice:p-3"], button.cursor-pointer:nth-child(7)';
        my$(to_be_removed).forEach(el => el.remove());

        my$("div.mx-auto").filter(
            el => el.textContent.search("到目前为止，此对话有帮助吗？") >= 0
        ).forEach(el => el.remove());
    }

    function black_font_color() {
        const style = "<style>*:not(pre, pre *) { color: black !important; }</style>";
        document.head.insertAdjacentHTML("beforeend", style); 
    }

    /**
     * @param {string} dialog 
     */
    function set_dialog_the_only_one(dialog) {
        document.body.outerHTML = "<body></body>";
        document.body.innerHTML = dialog;
    }

    /**
     * 当按下Ctrl+P时，重置页面，打印PDF
     * @param {KeyboardEvent} event 
     */
    function on_ctrl_p(event) {
        if (!(event.ctrlKey && event.code === "KeyP")) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        // 获取聊天DIV
        const div = my$(".pb-9")[0];
        if (!div) {
            alert("找不到聊天记录！");
            return;
        }
        const diaglog = div.outerHTML;

        // 重置页面
        clean();
        set_dialog_the_only_one(diaglog);
        black_font_color();

        // 打印PDF
        setTimeout(print, 500);
    }

    function main() {
        addEventListener("keydown", on_ctrl_p, true);
    }
    
    document.addEventListener("DOMContentLoaded", () => setTimeout(main, 2000));
})();