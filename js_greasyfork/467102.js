// ==UserScript==
// @name         Zhihu Latex 公式复制
// @name:en      Zhihu Latex Copy
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  双击以复制 Latex 公式代码。
// @description:en Double click to copy latex codes of formulas.
// @author       PRO
// @match        https://zhuanlan.zhihu.com/*
// @match        https://www.zhihu.com/question/*
// @icon         http://zhihu.com/favicon.ico
// @grant        none
// @license      gpl-3.0
// @require      https://update.greasyfork.org/scripts/462234/1322684/Message.js
// @downloadURL https://update.greasyfork.org/scripts/467102/Zhihu%20Latex%20%E5%85%AC%E5%BC%8F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/467102/Zhihu%20Latex%20%E5%85%AC%E5%BC%8F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const name = 'Zhihu Latex Copy';
    window.QMSG_GLOBALS = {
        DEFAULTS: {
            showClose:true,
            timeout: 2000
        }
    }
    function toast(s, error=false) {
        if (error) {
            Qmsg.error(`[${name}] ${s}`);
            console.error(`[${name}] ${s}`);
        } else {
            Qmsg.success(`[${name}] ${s}`);
            console.log(`[${name}] ${s}`);
        }
    };
    const emojis = ["🥳", "😘", "😇", "😉"];
    function randomEmoji() {
        return emojis[Math.floor(Math.random() * emojis.length)];
    };
    function tryCopy(e) {
        const el = e.target.closest("span.ztext-math");
        if (el) {
            const latex = el.getAttribute("data-tex");
            navigator.clipboard.writeText(latex);
            toast(randomEmoji() + " Copied!");
        }
    }
    document.addEventListener("dblclick", e => tryCopy(e));
})();