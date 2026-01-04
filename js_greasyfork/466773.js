// ==UserScript==
// @name         GPT-4 自动请求计数器
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  自动记录gpt-4的剩余使用次数，以及次数恢复情况（每7.2分钟恢复一次），方便规划管理，显示于右上角
// @author       GPT4  learn from Mojibake-1 (https://greasyfork.org/zh-CN/scripts/462961-gpt-4-%E6%89%8B%E5%8A%A8%E8%AF%B7%E6%B1%82%E8%AE%A1%E6%95%B0%E5%99%A8-chatgpt-gpt-4-request-counter-manual-only) and mefengl (https://greasyfork.org/zh-CN/scripts/466663-chatgpt-auto-continue)
// @match        https://chat.openai.com/*
// @match        https://chat.zhile.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466773/GPT-4%20%E8%87%AA%E5%8A%A8%E8%AF%B7%E6%B1%82%E8%AE%A1%E6%95%B0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/466773/GPT-4%20%E8%87%AA%E5%8A%A8%E8%AF%B7%E6%B1%82%E8%AE%A1%E6%95%B0%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SECONDS_IN_7_2_MINUTES = 7.2 * 60;
    const MAX_REQUEST_COUNT = 25;

    const wrapperDiv = document.createElement('div');
    wrapperDiv.style.position = 'fixed';
    wrapperDiv.style.top = '20px';
    wrapperDiv.style.right = '20px';
    wrapperDiv.style.zIndex = '9999';
    document.body.appendChild(wrapperDiv);

    const counterButton = document.createElement('button');
    counterButton.style.padding = '10px';
    counterButton.style.backgroundColor = '#007bff';
    counterButton.style.color = '#ffffff';
    counterButton.style.border = 'none';
    counterButton.style.cursor = 'pointer';
    counterButton.textContent = '记录';
    wrapperDiv.appendChild(counterButton);

    const resetButton = document.createElement('button');
    resetButton.style.marginTop = '5px';
    resetButton.style.padding = '10px';
    resetButton.style.backgroundColor = '#dc3545';
    resetButton.style.color = '#ffffff';
    resetButton.style.border = 'none';
    resetButton.style.cursor = 'pointer';
    resetButton.textContent = '重置';
    wrapperDiv.appendChild(resetButton);

    const requestCountSpan = document.createElement('span');
    requestCountSpan.style.display = 'block';
    requestCountSpan.style.marginTop = '10px';
    requestCountSpan.style.color = '#007bff';
    requestCountSpan.style.fontSize = '16px';
    wrapperDiv.appendChild(requestCountSpan);

    const countdownSpan7_2Min = document.createElement('span');
    countdownSpan7_2Min.style.display = 'block';
    countdownSpan7_2Min.style.marginTop = '5px';
    countdownSpan7_2Min.style.color = '#007bff';
    countdownSpan7_2Min.style.fontSize = '14px';
    wrapperDiv.appendChild(countdownSpan7_2Min);

    let requestCount = parseInt(localStorage.getItem('gpt4RequestCount')) || MAX_REQUEST_COUNT;
    let firstRequestTimestamp = parseInt(localStorage.getItem('gpt4FirstRequestTimestamp'));
    let isTimerStarted = localStorage.getItem('gpt4TimerStarted') === 'true' || false;
    let lastRegenerationTimestamp = parseInt(localStorage.getItem('gpt4LastRegenerationTimestamp')) || 0;

    function updateRequestCountDisplay() {
        requestCountSpan.textContent = `剩余次数：${requestCount}`;
    }

    function updateCountdownDisplay7_2Min() {
        if (isTimerStarted && firstRequestTimestamp) {
            const now = Math.floor(Date.now() / 1000);
            const elapsedTime = now - firstRequestTimestamp;
            const remainingTime = SECONDS_IN_7_2_MINUTES - (elapsedTime % SECONDS_IN_7_2_MINUTES);

            const remainingMinutes = Math.floor(remainingTime / 60);
            const remainingSeconds = remainingTime % 60;
            countdownSpan7_2Min.textContent = `${remainingMinutes}分${remainingSeconds}秒`;

            // Check if the timer has reached 0
            if (remainingTime <= 1 && now - lastRegenerationTimestamp >= SECONDS_IN_7_2_MINUTES) {
                if (requestCount < MAX_REQUEST_COUNT) { // Only increment requestCount if it's less than the maximum
                    requestCount++;
                    lastRegenerationTimestamp = now;
                    localStorage.setItem('gpt4RequestCount', requestCount);
                    localStorage.setItem('gpt4LastRegenerationTimestamp', lastRegenerationTimestamp);
                    updateRequestCountDisplay();
                }
            }
                    // If requestCount equals MAX_REQUEST_COUNT, trigger a click on the reset button
            if (requestCount === MAX_REQUEST_COUNT) {
                const clickEvent = new Event('click');
                resetButton.dispatchEvent(clickEvent);
            }
        } else {
            countdownSpan7_2Min.textContent = `7分12秒`;
        }
    }

    function checkRegenerateResponseButton() {
        const button = getRegenerateButton();
        if (button) {
            window.alert("Regenerate response button detected!");
        }
    }

    updateRequestCountDisplay();
    updateCountdownDisplay7_2Min();

    setInterval(updateCountdownDisplay7_2Min, 1000);

    counterButton.addEventListener('click', () => {
        if (requestCount > 0) {
            requestCount--;
        }
        localStorage.setItem('gpt4RequestCount', requestCount);
        updateRequestCountDisplay();

        if (!isTimerStarted) {
            isTimerStarted = true;
            firstRequestTimestamp = Math.floor(Date.now() / 1000);
            localStorage.setItem('gpt4FirstRequestTimestamp', firstRequestTimestamp);
            localStorage.setItem('gpt4TimerStarted', 'true');
        }

        updateCountdownDisplay7_2Min();

    });

    resetButton.addEventListener('click', () => {
        requestCount = MAX_REQUEST_COUNT;
        isTimerStarted = false;
        localStorage.removeItem('gpt4FirstRequestTimestamp');
        localStorage.removeItem('gpt4TimerStarted');
        localStorage.removeItem('gpt4LastRegenerationTimestamp');
        localStorage.setItem('gpt4RequestCount', requestCount);
        updateRequestCountDisplay();
        updateCountdownDisplay7_2Min();
    });
    // 按钮点击事件
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


    // Update request count and display function
    function updateRequestCountAndDisplay() {
        if (requestCount < MAX_REQUEST_COUNT) {
            requestCount += 1;
            updateRequestCountDisplay();
        }
    }

    // Monitor for div with class 'bg-red-500/10'
    function getBgRedDiv() {
        const divs = document.querySelectorAll("div");
        const result = Array.from(divs).find((div) => {
            return div.classList.contains("bg-red-500/10");
        });
        return result;
    }

    // 监听模型选择按钮
    function listenToGpt4Button() {
        const gpt4Button = getthreeButton();
        const urlParams = new URLSearchParams(window.location.search);
        const model = urlParams.get('model');
        if (gpt4Button || model === 'gpt-4' || model === 'gpt-4-browsing' || model.includes("gpt-4-plugins")) {
            listenToButtons();
        }
    }

    // 为指定的按钮添加事件监听器
    function listenToButtons() {
        const submitButton = getSubmitButton();
        const saveSubmitButton = getSaveSubmitButton();
        const regenerateButton = getRegenerateButton();
        const continueGeneratingButton = getContinueGeneratingButton2();
        const BgRedDiv = getBgRedDiv();
        const textarea = getTextarea();
        //let undefinedAlertShown = false;
        //let definedAlertShown = false;
        //if (saveSubmitButton) {
        //    if (!definedAlertShown) {
        //        window.alert('Save Submit Button is now defined');
        //        definedAlertShown = true;
        //    }
        //} else {
        //    if (!undefinedAlertShown) {
        //        window.alert('Save Submit Button is undefined');
        //        undefinedAlertShown = true;
        //    }
        //}
        //window.alert(saveSubmitButton);
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


    // 使用 MutationObserver 监视页面变化
    const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                listenToGpt4Button();
            }
        }
    });
    // 开始使用 MutationObserver 监视页面变化
    observer.observe(document, { childList: true, subtree: true });

})();
