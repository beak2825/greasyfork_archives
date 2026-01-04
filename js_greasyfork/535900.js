// ==UserScript==
// @name         Unlock the permission to copy in lark or Feishu sheet
// @namespace    https://gotocompany.sg.larksuite.com
// @version      1.3
// @description  Unlock replication restrictions in Lark sheet
// @author       kai.zhan(jaris)
// @match        https://gotocompany.sg.larksuite.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535900/Unlock%20the%20permission%20to%20copy%20in%20lark%20or%20Feishu%20sheet.user.js
// @updateURL https://update.greasyfork.org/scripts/535900/Unlock%20the%20permission%20to%20copy%20in%20lark%20or%20Feishu%20sheet.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const unlockCopy = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            div[contenteditable="false"] * {
                user-select: text !important;
                -webkit-user-select: text !important;
            }
            div[contenteditable="false"] br {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        // 解除事件绑定（包括 pointer 和 focus 类事件）
        const blockedEvents = [
            'copy', 'cut', 'paste', 'selectstart', 'contextmenu',
            'mousedown', 'mouseup', 'click', 'dblclick',
            'pointerdown', 'pointerup', 'pointermove',
            'keydown', 'keyup', 'keypress', 'focus'
        ];

        blockedEvents.forEach(type => {
            document.addEventListener(type, function (e) {
                e.stopImmediatePropagation();
            }, true);
        });

        // 清除新注入的阻止复制样式
        const observer = new MutationObserver(() => {
            document.querySelectorAll('*').forEach(el => {
                const style = getComputedStyle(el);
                if (style.userSelect === 'none') {
                    el.style.setProperty('user-select', 'text', 'important');
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    };

    window.addEventListener('load', () => {
        setTimeout(unlockCopy, 1000);
    });
})();