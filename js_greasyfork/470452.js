// ==UserScript==
// @name         GPT-4 自动请求计数器（2023.07适配）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动记录gpt-4的剩余使用次数，以及剩余重置时间（总共2小时50分钟），方便规划管理，显示于右上角
// @author       GPT4  learn from Mojibake-1 (https://greasyfork.org/zh-CN/scripts/462961-gpt-4-%E6%89%8B%E5%8A%A8%E8%AF%B7%E6%B1%82%E8%AE%A1%E6%95%B0%E5%99%A8-chatgpt-gpt-4-request-counter-manual-only) and mefengl (https://greasyfork.org/zh-CN/scripts/466663-chatgpt-auto-continue)
// @match        https://chat.openai.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470452/GPT-4%20%E8%87%AA%E5%8A%A8%E8%AF%B7%E6%B1%82%E8%AE%A1%E6%95%B0%E5%99%A8%EF%BC%88202307%E9%80%82%E9%85%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/470452/GPT-4%20%E8%87%AA%E5%8A%A8%E8%AF%B7%E6%B1%82%E8%AE%A1%E6%95%B0%E5%99%A8%EF%BC%88202307%E9%80%82%E9%85%8D%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SECONDS_IN_7_2_MINUTES = 7.2 * 60;
    const MAX_REQUEST_COUNT = 50;
    const RESET_TIME = 2 * 60 + 50; // 2小时50分钟，单位为分钟

    const wrapperDiv = document.createElement('div');
    wrapperDiv.style.position = 'fixed';
    wrapperDiv.style.top = '6px';
    wrapperDiv.style.right = '6px';
    wrapperDiv.style.zIndex = '9999';
    document.body.appendChild(wrapperDiv);

    const counterButton = document.createElement('button');
    counterButton.style.padding = '1px';
    counterButton.style.backgroundColor = '#007bff';
    counterButton.style.color = '#ffffff';
    counterButton.style.border = 'solid';
    counterButton.style.cursor = 'pointer';
    counterButton.textContent = '手动扣除一次';
    wrapperDiv.appendChild(counterButton);

    const resetButton = document.createElement('button');
    resetButton.style.marginTop = '5px';
    resetButton.style.padding = '1px';
    resetButton.style.backgroundColor = '#dc3545';
    resetButton.style.color = '#ffffff';
    resetButton.style.border = 'solid';
    resetButton.style.cursor = 'pointer';
    resetButton.textContent = '重置';
    wrapperDiv.appendChild(resetButton);

    const requestCountSpan = document.createElement('span');
    requestCountSpan.style.display = 'block';
    requestCountSpan.style.marginTop = '1px';
    requestCountSpan.style.color = '#007bff';
    requestCountSpan.style.fontSize = '1px';
    wrapperDiv.appendChild(requestCountSpan);

    const lastChangeSpan = document.createElement('span');
    lastChangeSpan.style.display = 'block';
    lastChangeSpan.style.marginTop = '1px';
    lastChangeSpan.style.color = '#007bff';
    lastChangeSpan.style.fontSize = '1px';
    wrapperDiv.appendChild(lastChangeSpan);

    const startInput = document.createElement('input');
    startInput.type = 'time'; // Set the input type to 'time'
    startInput.style.display = 'block';
    startInput.style.marginTop = '1px';
    startInput.style.padding = '1px';
    startInput.style.fontSize = '1px';
    wrapperDiv.appendChild(startInput);

    const startButton = document.createElement('button');
    startButton.style.marginTop = '1px';
    startButton.style.padding = '1px';
    startButton.style.backgroundColor = '#28a745';
    startButton.style.color = '#ffffff';
    startButton.style.border = 'solid';
    startButton.style.cursor = 'pointer';
    startButton.textContent = '手动开始计时';
    wrapperDiv.appendChild(startButton);

    const countdownSpan = document.createElement('span');
    countdownSpan.style.display = 'block';
    countdownSpan.style.marginTop = '1px';
    countdownSpan.style.color = '#007bff';
    countdownSpan.style.fontSize = '1px';
    wrapperDiv.appendChild(countdownSpan);

    const resetTimeSpan = document.createElement('span');
    resetTimeSpan.style.display = 'block';
    resetTimeSpan.style.marginTop = '1px';
    resetTimeSpan.style.color = '#007bff';
    resetTimeSpan.style.fontSize = '1px';
    wrapperDiv.appendChild(resetTimeSpan);

    let requestCount = parseInt(localStorage.getItem('gpt4RequestCount')) || MAX_REQUEST_COUNT;
    let remainingTime = parseInt(localStorage.getItem('gpt4RemainingTime')) || RESET_TIME * 60;
    let isCountdownStarted = localStorage.getItem('gpt4CountdownStarted') === 'true' || false;
    let lastChangeTime = localStorage.getItem('gpt4LastChangeTime') || '';
    let startTime = localStorage.getItem('gpt4StartTime');

    function updateRequestCountDisplay() {
        requestCountSpan.textContent = `剩余次数：${requestCount}`;
    }

    function formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function updateCountdownDisplay() {
        const remainingHours = Math.floor(remainingTime / 3600);
        const remainingMinutes = Math.floor((remainingTime % 3600) / 60);
        const remainingSeconds = remainingTime % 60;

        countdownSpan.textContent = `剩余重置时间：${remainingHours}小时 ${remainingMinutes}分钟`;

        // 计算并显示重置时间
        const currentTime = new Date();
        const resetTime = new Date(currentTime.getTime() + remainingTime * 1000);
        const resetHours = resetTime.getHours().toString().padStart(2, '0');
        const resetMinutes = resetTime.getMinutes().toString().padStart(2, '0');
        resetTimeSpan.textContent = `重置时间：${resetHours}:${resetMinutes}`;

        if (remainingTime === 0) {
            resetCountdown();
            requestCount = MAX_REQUEST_COUNT;
            localStorage.setItem('gpt4RequestCount', requestCount);
            updateRequestCountDisplay();
            alert('剩余次数已重置！');
        }
    }


    function startCountdown() {
        isCountdownStarted = true;
        localStorage.setItem('gpt4CountdownStarted', 'true');
    }

    function resetCountdown() {
        remainingTime = RESET_TIME * 60;
        isCountdownStarted = false;
        localStorage.setItem('gpt4RemainingTime', remainingTime);
        localStorage.removeItem('gpt4CountdownStarted');
    }

    function saveRemainingTime() {
        localStorage.setItem('gpt4RemainingTime', remainingTime);
    }

    function restoreRemainingTime() {
        remainingTime = parseInt(localStorage.getItem('gpt4RemainingTime')) || RESET_TIME * 60;
    }

    function handleWindowClose() {
        saveRemainingTime();
    }

    window.addEventListener('beforeunload', handleWindowClose);

    updateRequestCountDisplay();
    updateCountdownDisplay();

    setInterval(() => {
        if (isCountdownStarted) {
            const currentTime = new Date();
            const elapsedTime = Math.floor((currentTime - new Date(startTime)) / 1000);
            remainingTime = Math.max(0, RESET_TIME * 60 - elapsedTime);
            saveRemainingTime();
            updateCountdownDisplay();
        }
    }, 1000);

    counterButton.addEventListener('click', () => {
        if (requestCount === 50 && !isCountdownStarted) {
            startCountdown();
            startTime = new Date().toISOString();
            lastChangeTime = formatTime(new Date());
            localStorage.setItem('gpt4LastChangeTime', lastChangeTime);
            localStorage.setItem('gpt4StartTime', startTime);
            updateLastChangeDisplay();
        }
        if (requestCount > 0) {
            requestCount--;
            localStorage.setItem('gpt4RequestCount', requestCount);
            updateRequestCountDisplay();
        }
    });

    resetButton.addEventListener('click', () => {
        if (confirm('确定要重置剩余次数和倒计时吗？')) {
            resetCountdown();
            requestCount = MAX_REQUEST_COUNT;
            localStorage.setItem('gpt4RequestCount', requestCount);
            updateRequestCountDisplay();
            updateCountdownDisplay();
            startTime = null;
            lastChangeTime = '';
            localStorage.removeItem('gpt4StartTime');
            localStorage.removeItem('gpt4LastChangeTime');
            updateLastChangeDisplay();
        }
    });

startButton.addEventListener('click', () => {
    const timeInput = startInput.value.trim();
    if (validateTimeFormat(timeInput)) {
        startCountdown();
        // 清空自动开始时间
        localStorage.removeItem('gpt4StartTime');
        startTime = getStartTimeFromInput(timeInput);
        lastChangeTime = formatTime(new Date());
        localStorage.setItem('gpt4LastChangeTime', lastChangeTime);
        localStorage.setItem('gpt4StartTime', startTime);
        updateLastChangeDisplay();
    } else {
        alert('请输入正确的时间格式（hh:mm）');
    }
});

    function validateTimeFormat(time) {
        const pattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return pattern.test(time);
    }

    function getStartTimeFromInput(time) {
        const currentTime = new Date();
        const [hours, minutes] = time.split(':');
        currentTime.setHours(parseInt(hours));
        currentTime.setMinutes(parseInt(minutes));
        return currentTime.toISOString();
    }

    // 以下是原有的代码，未做修改

    function getTextarea() {
        const form = document.querySelector("form");
        if (!form)
            return;
        const textareas = form.querySelectorAll("textarea");
        const result = textareas[0];
        return result;
    }

    function getthreeButton() {
        const divs = document.querySelectorAll("div");
        const result = Array.from(divs).find((div) => {
            var _a;
            return (_a = div.textContent) == null ? void 0 : ["model: gpt-4", "model: web browsing", "model: plugins", "Model: Plugins•Enabled plugins:"].includes(_a.trim().toLowerCase());
        });
        return result;
    }

    function getSubmitButton() {
        const textarea = getTextarea();
        if (!textarea)
            return;
        return textarea.nextElementSibling;
    }

    function getRegenerateButton() {
        const form = document.querySelector("form");
        if (!form)
            return;
        const buttons = form.querySelectorAll("button");
        const result = Array.from(buttons).find((button) => {
            var _a;
            return (_a = button.textContent) == null ? void 0 : _a.trim().toLowerCase().includes("regenerate");
        });
        return result;
    }

    function getSaveSubmitButton() {
        const cancelButtons = Array.from(document.querySelectorAll('.btn-neutral'));
        for (let i = 0; i < cancelButtons.length; i++) {
            if (cancelButtons[i].textContent.includes("Cancel")) {
                // Check if previous sibling element is the "Save & Submit" button
                const saveSubmitButton = cancelButtons[i].previousElementSibling;
                if (saveSubmitButton && saveSubmitButton.textContent.includes("Save & Submit")) {
                    return saveSubmitButton;
                }
            }
        }
        return null;  // Return null if no matching button found
    }

    function getContinueGeneratingButton2() {
        const form = document.querySelector("form");
        if (!form)
            return;
        const buttons = form.querySelectorAll("button");
        const result = Array.from(buttons).find((button) => {
            var _a;
            return (_a = button.textContent) == null ? void 0 : _a.trim().toLowerCase().includes("continue generating");
        });
        return result;
    }

    function getStopGeneratingButton() {
        const form = document.querySelector("form");
        if (!form)
            return;
        const buttons = form.querySelectorAll("button");
        const result = Array.from(buttons).find((button) => {
            var _a;
            return (_a = button.textContent) == null ? void 0 : _a.trim().toLowerCase().includes("stop generating");
        });
        return result;
    }

    function send(message) {
        setTextarea(message);
        const textarea = getTextarea();
        if (!textarea)
            return;
        textarea.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    }

    function updateRequestCountAndDisplay() {
        if (requestCount < MAX_REQUEST_COUNT) {
            requestCount++;
            updateRequestCountDisplay();
        }
    }

    function getBgRedDiv() {
        const divs = document.querySelectorAll("div");
        const result = Array.from(divs).find((div) => {
            return div.classList.contains("bg-red-500/10");
        });
        return result;
    }

    function listenToGpt4Button() {
        const gpt4Button = getthreeButton();
        const urlParams = new URLSearchParams(window.location.search);
        const model = urlParams.get('model');
        if (gpt4Button || model === 'gpt-4' || model === 'gpt-4-browsing' || model.includes("gpt-4-plugins")) {
            listenToButtons();
        }
    }

    function listenToButtons() {
        const submitButton = getSubmitButton();
        const saveSubmitButton = getSaveSubmitButton();
        const regenerateButton = getRegenerateButton();
        const continueGeneratingButton = getContinueGeneratingButton2();
        const BgRedDiv = getBgRedDiv();
        const textarea = getTextarea();

        if (submitButton && !submitButton.hasAttribute('listener-added')) {
            submitButton.addEventListener('click', () => {
                counterButton.click();
            });
            submitButton.setAttribute('listener-added', '');
        }

        if (regenerateButton && !regenerateButton.hasAttribute('listener-added')) {
            regenerateButton.addEventListener('click', () => {
                counterButton.click();
            });
            regenerateButton.setAttribute('listener-added', '');
        }

        if (saveSubmitButton && !saveSubmitButton.hasAttribute('listener-added')) {
            saveSubmitButton.addEventListener('click', () => {
                counterButton.click();
            });
            saveSubmitButton.setAttribute('listener-added', '');
        }

        if (continueGeneratingButton && !continueGeneratingButton.hasAttribute('listener-added')) {
            continueGeneratingButton.addEventListener('click', () => {
                counterButton.click();
            });
            continueGeneratingButton.setAttribute('listener-added', '');
        }

        if (BgRedDiv && !BgRedDiv.hasAttribute('listener-added')) {
            updateRequestCountAndDisplay();
            BgRedDiv.setAttribute('listener-added', '');
        }

        if (textarea && !textarea.hasAttribute('listener-added')) {
            textarea.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    counterButton.click();
                }
            });
            textarea.setAttribute('listener-added', '');
        }
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                listenToGpt4Button();
            }
        }
    });

    observer.observe(document, { childList: true, subtree: true });

    // 页面加载时恢复剩余时间并继续倒计时
    window.addEventListener('load', () => {
        restoreRemainingTime();
        updateCountdownDisplay();
        restoreLastChangeTime();
        updateLastChangeDisplay();
    });

    // 以下是新增的代码
    function restoreLastChangeTime() {
        lastChangeTime = localStorage.getItem('gpt4LastChangeTime') || '';
    }

    function updateLastChangeDisplay() {
        lastChangeSpan.textContent = `自动开始时间：${lastChangeTime}`;
    }

    restoreLastChangeTime();
    updateLastChangeDisplay();
})();

