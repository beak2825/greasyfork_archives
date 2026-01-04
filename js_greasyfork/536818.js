// ==UserScript==
// @name         Layer3 自动点击按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 Layer3 页面自动点击特定按钮
// @author       @dami
// @match        https://app.layer3.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=layer3.xyz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536818/Layer3%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/536818/Layer3%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设定检查间隔时间（毫秒）
    const checkInterval = 1000;

    // 记录是否已点击过按钮二
    let hasClickedButtonTwo = false;

    // 记录当前尝试的答案索引
    let currentAnswerIndex = 0;

    // 记录上次点击答案的时间
    let lastAnswerClickTime = 0;

    // 定期检查按钮是否存在并点击
    setInterval(() => {
        const now = Date.now();

        // 查找Continue按钮
        const continueButtons = Array.from(document.querySelectorAll('button'))
            .filter(button =>
                button.textContent.includes('Continue') &&
                !button.disabled
            );

        if (continueButtons.length > 0) {
            console.log('找到可点击的Continue按钮，点击中...');
            continueButtons[0].click();
            // 重置答案索引，准备回答下一个问题
            currentAnswerIndex = 0;
            lastAnswerClickTime = 0;
        }

        // 查找并点击按钮二 (Open X 按钮)，仅点击一次
        if (!hasClickedButtonTwo) {
            const openXButtons = Array.from(document.querySelectorAll('button'))
                .filter(button => button.textContent.includes('Open X'));

            if (openXButtons.length > 0) {
                console.log('找到 Open X 按钮，点击一次...');
                openXButtons[0].click();
                hasClickedButtonTwo = true;
            }
        }

        // 检查是否存在选择题选项按钮
        const answerButtons = Array.from(document.querySelectorAll('button[id^="a"]'));
        if (answerButtons.length > 0 && currentAnswerIndex < answerButtons.length) {
            // 检查是否Continue按钮处于禁用状态
            const disabledContinueButton = Array.from(document.querySelectorAll('button'))
                .filter(button =>
                    button.textContent.includes('Continue') &&
                    button.disabled
                );

            // 如果至少已过去3秒，或者这是第一次点击答案
            if (now - lastAnswerClickTime > 3000 || lastAnswerClickTime === 0) {
                // 如果Continue按钮存在且被禁用，或者还没点过任何答案
                if (disabledContinueButton.length > 0 || lastAnswerClickTime === 0) {
                    console.log(`尝试第${currentAnswerIndex + 1}个答案: ${answerButtons[currentAnswerIndex].textContent}`);
                    answerButtons[currentAnswerIndex].click();
                    lastAnswerClickTime = now;
                    currentAnswerIndex++;
                }
            }
        }
    }, checkInterval);
})();