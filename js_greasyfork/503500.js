// ==UserScript==
// @name         Poe Content Summarizer
// @namespace    http://tampermonkey.net/
// @version      1.68
// @description  Summarize clipboard content on Poe and auto-submit with smooth delay
// @match        https://poe.com/*
// @icon         https://plus.unsplash.com/premium_photo-1673795754005-214e3e1fccba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzN3x8fGVufDB8fHx8fA%3D%3D
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503500/Poe%20Content%20Summarizer.user.js
// @updateURL https://update.greasyfork.org/scripts/503500/Poe%20Content%20Summarizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastKeyTime = 0;
    let consecutiveOne = 0;

    document.addEventListener('keydown', function(e) {
        if (e.key === '1') {
            let currentTime = new Date().getTime();
            if (currentTime - lastKeyTime < 500) {
                consecutiveOne++;
                if (consecutiveOne === 2) {
                    e.preventDefault();
                    summarizeClipboard();
                }
            } else {
                consecutiveOne = 1;
            }
            lastKeyTime = currentTime;
        } else {
            consecutiveOne = 0;
        }
    });

    function summarizeClipboard() {
        navigator.clipboard.readText().then(clipText => {
            let textArea = document.querySelector('textarea');
            if (textArea) {
                // 移除剪贴板内容开头和结尾的空白字符
                clipText = clipText.trim();
                textArea.value = `${clipText}\n\n##内容总结与分析提示：\n
你是一位内容总结专家，请对以下内容进行深入分析：
1.详细总结：请对内容进行全面总结，涵盖主要观点和细节。
2.提炼核心观点：从内容中提炼出5个或更多的核心观点，确保观点清晰且具有代表性。
3.相关问题：基于内容，提出一个相关的、同时期出现的问题，并进行详细回答。
4.尊重原文：确保总结和观点提炼忠实于内容原文，避免产生幻觉或误解。
请尽可能详细地回答，确保覆盖所有重要要点。##`;
                textArea.dispatchEvent(new Event('input', { bubbles: true }));

                // 添加延迟以使过程更加顺滑
                setTimeout(() => {
                    // 模拟按下回车键
                    const enterEvent = new KeyboardEvent('keydown', {
                        bubbles: true,
                        cancelable: true,
                        keyCode: 13,
                        which: 13,
                        key: 'Enter'
                    });
                    textArea.dispatchEvent(enterEvent);
                }, 300); // 300毫秒的延迟，可以根据需要调整
            }
        });
    }
})();