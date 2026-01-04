// ==UserScript==
// @name         Jason解锁复制
// @namespace    http://tampermonkey.net/
// @version      2025-07-09_01
// @description  666
// @author       Jason_Lv
// @match        https://mogubj.xiaosaas.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542070/Jason%E8%A7%A3%E9%94%81%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/542070/Jason%E8%A7%A3%E9%94%81%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function unlockPage() {
        const nullify = [
            'oncontextmenu',
            'oncopy',
            'oncut',
            'onpaste',
            'onkeydown',
            'onkeyup',
            'onkeypress',
            'onselectstart',
            'ondragstart'
        ];

        nullify.forEach(event => {
            document[event] = null;
            document.body && (document.body[event] = null);
        });
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
        `;
        document.head.appendChild(style);
    }

    window.addEventListener('load', () => {
        unlockPage();

        const observer = new MutationObserver(() => {
            unlockPage();
            observer.disconnect();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
