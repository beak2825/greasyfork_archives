// ==UserScript==
// @name         ChatGPT 回答完成提示音（WebAudio 方式）
// @namespace    https://github.com/xiaozhang
// @version      1.6
// @description  使用 Web Audio API 播放提示音，不依赖外链，避免无声，稳定可靠；每次回答后提醒一次。
// @author       小张
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544258/ChatGPT%20%E5%9B%9E%E7%AD%94%E5%AE%8C%E6%88%90%E6%8F%90%E7%A4%BA%E9%9F%B3%EF%BC%88WebAudio%20%E6%96%B9%E5%BC%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544258/ChatGPT%20%E5%9B%9E%E7%AD%94%E5%AE%8C%E6%88%90%E6%8F%90%E7%A4%BA%E9%9F%B3%EF%BC%88WebAudio%20%E6%96%B9%E5%BC%8F%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastContentLength = 0;
    let isAnswering = false;
    let hasAlerted = false;
    let lastAnswerId = null;
    let soundUnlocked = false;
    let audioCtx = null;
    let stableCounter = 0;  // 新增：稳定不变次数

    const STABLE_THRESHOLD = 10;  // 100ms × 10 = 1秒未变化才触发提醒

    // 解锁音频（需要用户首次点击）
    window.addEventListener('click', function unlockAudio() {
        if (!soundUnlocked) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            playBeep(); // 解锁一次
            soundUnlocked = true;
            console.log('🔓 音频权限已解锁');
        }
        window.removeEventListener('click', unlockAudio);
    });

    // 用 Web Audio 播放 Beep
    function playBeep() {
        if (!audioCtx) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
    }

    setInterval(() => {
        const chatContainer = document.querySelector('main');
        if (!chatContainer) return;

        const chatContents = chatContainer.querySelectorAll('[data-message-author-role="assistant"]');
        if (chatContents.length === 0) return;

        const lastContent = chatContents[chatContents.length - 1];
        const currentText = lastContent.innerText.trim();
        const currentLength = currentText.length;

        const currentId = lastContent.getAttribute('data-message-id') || lastContent.innerHTML.slice(0, 50);

        // 如果是新回答，重置所有状态
        if (currentId !== lastAnswerId) {
            lastAnswerId = currentId;
            lastContentLength = 0;
            isAnswering = false;
            hasAlerted = false;
            stableCounter = 0;
        }

        // 回答还在增长中
        if (currentLength > lastContentLength + 5) {
            isAnswering = true;
            hasAlerted = false;
            lastContentLength = currentLength;
            stableCounter = 0;
        }
        // 回答稳定不变
        else if (isAnswering && !hasAlerted && currentLength === lastContentLength) {
            stableCounter++;
            if (stableCounter >= STABLE_THRESHOLD) {
                playBeep();
                hasAlerted = true;
                isAnswering = false;
            }
        }

    }, 100);
})();
