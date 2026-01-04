// ==UserScript==
// @name         Terminal Keep-Alive (with clean input)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  通过粘贴字符，保持 SSH 会话活跃
// @match        https://{jumpserver}/koko/terminal/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544073/Terminal%20Keep-Alive%20%28with%20clean%20input%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544073/Terminal%20Keep-Alive%20%28with%20clean%20input%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[KeepAlive] 脚本已加载（粘贴 + 回退）');

    function getTerminalInputTarget() {
        const canvas = document.querySelector('canvas');
        return canvas ? canvas.parentElement : document.body;
    }

    function simulatePasteCleaned(text = '\u200B') {
        const target = getTerminalInputTarget();
        if (!target) return;

        target.focus();

        // 第一次：粘贴不可见字符
        const pasteEvent1 = new ClipboardEvent('paste', {
            clipboardData: new DataTransfer(),
            bubbles: true,
            cancelable: true
        });
        pasteEvent1.clipboardData.setData('text/plain', text);
        target.dispatchEvent(pasteEvent1);
    }

    function getRandomInterval(min = 170000, max = 210000) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function scheduleNextPaste() {
        const delay = getRandomInterval();
        console.log(`[KeepAlive] 下次粘贴将在 ${(delay / 1000).toFixed(0)} 秒后`);

        setTimeout(() => {
            simulatePasteCleaned();
            scheduleNextPaste();
        }, delay);
    }

    scheduleNextPaste();
})();
