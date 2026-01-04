// ==UserScript==
// @name         【自制】问卷星(addUI)
// @namespace    http://tampermonkey.net/
// @version      0.6.0
// @description  enjoy it!
// @author       laisheng
// @match        https://www.wjx.cn/*
// @exclude      https://www.wjx.cn/newwjx/design/sendqstart.aspx?activity=264280650
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493247/%E3%80%90%E8%87%AA%E5%88%B6%E3%80%91%E9%97%AE%E5%8D%B7%E6%98%9F%28addUI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493247/%E3%80%90%E8%87%AA%E5%88%B6%E3%80%91%E9%97%AE%E5%8D%B7%E6%98%9F%28addUI%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let config = loadConfig();
    const activityId = getActivityIdFromUrl();
    let promiseQueue = [];
    let cancelRequested = false;
    let tempConfig;


    function addUI() {
        const panelHtml = `
        <style>
            #gm-control-panel { position: fixed; right: 20px; bottom: 20px; background: white; border: 1px solid #ccc; padding: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); z-index: 9999; }
            #gm-control-panel button { background-color: #2b88d8; color: white; border: none; padding: 5px 10px; margin: 4px 2px; cursor: pointer; border-radius: 2px; font-size: 12px; }
            #gm-control-panel button:hover { font-weight: bold; }
            #gm-control-panel input[type='number'] { padding: 4px; margin-right: 5px; border: 1px solid #ccc; border-radius: 2px; width: 100px; }
            .gm-label { margin-right: 5px; font-size: 14px; }
            #gm-cp-progress-line {display: flex; align-items: center; font-size: 12px; }
            #gm-cp-progress-container { flex-grow: 1; background-color: #f2f2f2; border-radius: 5px; overflow: hidden; margin-top: 10px; margin-bottom: 10px; margin-right: 5px; }
            #gm-cp-progress { background-color: #5FB878; height: 12px; width: 0%; transition: width 0.5s ease-in-out; }
            .status-running { color: white; background-color: #4CAF50; padding: 3px 6px; border-radius: 4px; text-align: center; font-size: 12px; font-weight: bold }
            .status-stopped { color: white; background-color: #f44336; padding: 3px 6px; border-radius: 4px; text-align: center; font-size: 12px; font-weight: bold }
            #gm-cp-toggle { cursor: pointer; position: fixed; right: 30px; bottom: 242px; width: 24px; height: 24px; z-index: 10000; }
            #gm-cp-toggle:hover { color: #555; }
            #gm-cp-settings { cursor: pointer; position: fixed; right: 60px; bottom: 242px; width: 24px; height: 24px; }
            #gm-cp-settings:hover { color: #555; }
            #gm-cp-settings-panel { display: none; position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%); background: white; border: 1px solid #ccc; padding: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); z-index: 10000; }
            #gm-cp-settings-panel input { padding: 4px; margin-right: 5px; border: 1px solid #ccc; border-radius: 2px; width: 100px; }
            #gm-cp-settings-panel button { background-color: #2b88d8; color: white; border: none; padding: 5px 10px; margin: 4px 2px; cursor: pointer; border-radius: 2px; font-size: 12px; }
            #gm-cp-settings-panel button:hover { font-weight: bold; }
            .config-item { display: flex; align-items: center; margin-bottom: 10px; font-size: 12px; }
            .config-item label { margin-right: 5px; }
            .feather { width: 24px; height: 24px; stroke-linecap: round; stroke-linejoin: round; stroke: currentColor; transition: fill 0.25s; cursor: pointer; }
            .feather:hover { color: #555; }
            hr { border: 0; border-top: 1px solid #ccc; margin: 10px 0; }
        </style>
        <svg id="gm-cp-toggle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down">
        </svg>
        <div id="gm-control-panel">
            <div style="font-size: 14px;">控制面板</div>
            <svg id="gm-cp-settings" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 .9A2 2 0 0 1 12 20a2 2 0 0 1-1.94-1.5 1.65 1.65 0 0 0-1-.9 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-.9-1A2 2 0 0 1 4 12a2 2 0 0 1 1.5-1.94 1.65 1.65 0 0 0 .9-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-.9A2 2 0 0 1 12 4a2 2 0 0 1 1.94 1.5 1.65 1.65 0 0 0 1 .9 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 .9 1A2 2 0 0 1 20 12a2 2 0 0 1-1.5 1.94 1.65 1.65 0 0 0-.9 1z"></path>
            </svg>
            <hr>
            <button id="gm-cp-start">开始自动填答</button>
            <button id="gm-cp-stop" style="float: right;">停止自动填答</button><br>
            <button id="gm-cp-reset" style="background-color: #ff8c00;">重置填答计数</button>
            <button id="gm-cp-clear-cache" style="background-color: #FF5722; float: right;">清除所有缓存</button>
            <div>
                <span class="gm-label">间隔:</span>
                <input id="gm-cp-interval" type="number" min="0" step="0.1" placeholder="支持小数">
                <button id="gm-cp-interval-apply">设置</button>
            </div>
            <div>
                <span class="gm-label">次数:</span>
                <input id="gm-cp-times" type="number" min="0">
                <button id="gm-cp-times-apply">设置</button>
            </div>
            <div id="gm-cp-progress-line">
                <div id="gm-cp-progress-container">
                    <div id="gm-cp-progress"></div>
                </div>
                <p id="gm-cp-answer-count"></p>
            </div>
            <p id="gm-cp-status"></p>
        </div>
        <div id="gm-cp-settings-panel">
            <div id="gm-cp-settings-content"></div>
            <hr>
            <button id="gm-cp-add">添加</button>
            <button id="gm-cp-save">保存</button>
            <button id="gm-cp-cancel">返回</button>
        </div>
            `;
        document.body.insertAdjacentHTML("beforeend", panelHtml);
        bindUIEvents();
    }



    function bindUIEvents() {
        document.getElementById("gm-cp-start").addEventListener("click", startAutoAnswer);
        document.getElementById("gm-cp-stop").addEventListener("click", stopAutoAnswer);
        document.getElementById("gm-cp-times-apply").addEventListener("click", applyTimes);
        document.getElementById("gm-cp-interval-apply").addEventListener("click", applyInterval);
        document.getElementById("gm-cp-reset").addEventListener("click", resetSurveyData);
        document.getElementById("gm-cp-clear-cache").addEventListener("click", clearCache);
        document.getElementById("gm-cp-toggle").addEventListener("click", togglePanel);
        document.getElementById("gm-cp-settings").addEventListener("click", toggleSettings);
        document.getElementById("gm-cp-add").addEventListener("click", addConfigItem);
        document.getElementById("gm-cp-save").addEventListener("click", saveConfig);
        document.getElementById("gm-cp-cancel").addEventListener("click", toggleSettings);
    }

    
    function startAutoAnswer() {
        localStorage.setItem("isRunning", true);
        cancelRequested = false;
        main();
    }

    function stopAutoAnswer() {
        cancelRequested = true;
        for (const promise of promiseQueue) {
            if (promise.cancel) {
                promise.cancel();
            }
        }
        promiseQueue = [];
        localStorage.setItem("isRunning", false);
    }

    function cancellableDelay(delay) {
        let timeoutId;
        let cancel; // 提前声明cancel函数

        const promise = new Promise((resolve, reject) => {
            timeoutId = setTimeout(resolve, delay);
            cancel = () => {
                clearTimeout(timeoutId);
                reject(new Error("Cancelled"));
            };
        });

        promise.cancel = cancel; // 将cancel函数赋值给promise的cancel属性
        return promise;
    }


    function applyTimes() {
        const times = parseInt(document.getElementById("gm-cp-times").value, 10);
        if (times >= 0) {
            localStorage.setItem(`totalTimes_${activityId}`, times.toString());
            updateProgressAndCount();

        } else {
            alert("填答次数不能为负数。");
        }
    }

    function applyInterval() {
        const interval = parseFloat(document.getElementById("gm-cp-interval").value);
        if (interval >= 0) {
            localStorage.setItem("interval", interval.toString());
            updateProgressAndCount();
        } else {
            alert("填答间隔不能为负数。");
        }
    }

    function resetSurveyData() {
        clearSurveyData();
        updateProgressAndCount();
    }

    function togglePanel() {
        const panel = document.getElementById("gm-control-panel");
        panel.style.display = panel.style.display === "none" ? "block" : "none";
        updateToggleIcon();
    }
    function toggleSettings() {
        const settings = document.getElementById("gm-cp-settings-panel");
        if (settings.style.display === "none" || settings.style.display === "") {
            settings.style.display = 'block';
            config = loadConfig();
            tempConfig = JSON.parse(JSON.stringify(config));
            updateSettingsPanel(tempConfig);
        } else {
            settings.style.display = "none";
            tempConfig = [];
        }
    }
    

    function updateToggleIcon() {
        const toggleIcon = document.getElementById("gm-cp-toggle");
        const panel = document.getElementById("gm-control-panel");
        toggleIcon.innerHTML = panel.style.display === "none" ? '<polyline points="6 9 12 15 18 9"></polyline>' : '<polyline points="18 15 12 9 6 15"></polyline>';
    }

    function loadConfig() {
        const configStr = localStorage.getItem("config_${activityId}");
        return configStr ? JSON.parse(configStr) : [];
    }


    function updateSettingsPanel(configToShow) {
        const settingsContent = document.getElementById("gm-cp-settings-content");
        settingsContent.style.maxHeight = '200px';
        settingsContent.style.overflowY = 'scroll';
        settingsContent.innerHTML = '';
        configToShow.forEach((item, index) => {
            const itemHtml = `
                <hr>
                <div id="config-item-${index}" class="config-item">
                    <label>题号: <input type="text" id="config-id-${index}" value="${item.id}" data-index="${index}" data-type="id"></label>
                    <label>答案: <input type="text" id="config-answer-${index}" value="${item.answer.join(', ')}" data-index="${index}" data-type="answer"></label>
                    <svg onclick="removeConfigItem(${index})" id="config-remove-${index}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </div>
                
            `;
            settingsContent.insertAdjacentHTML("beforeend", itemHtml);
        });
    }

    window.removeConfigItem = index => {
        tempConfig.splice(index, 1);
        updateSettingsPanel(tempConfig);
    }

    function addConfigItem() {
        tempConfig.push({ id: "", answer: [''] });
        updateSettingsPanel(tempConfig);
    }

    function saveConfig() {
        const inputs = document.querySelectorAll("#gm-cp-settings-content input");
        inputs.forEach(input => {
            const index = input.dataset.index;
            const type = input.dataset.type;
            if (!tempConfig[index]) {
                tempConfig[index] = { id: "", answer: [''] };
            }
            if (type === "id") {
                tempConfig[index].id = parseInt(input.value, 10);
            } else if (type === "answer") {
                tempConfig[index].answer = input.value.split(',').map(item => item.trim());
            }
        });
        config = JSON.parse(JSON.stringify(tempConfig));
        localStorage.setItem("config_${activityId}", JSON.stringify(config));
        updateSettingsPanel(config);
    }

    function clearCache() {
        localStorage.clear();
        updateProgressAndCount();
    }


    function updateProgressAndCount() {
        const currentTimes = getCurrentTimes(activityId);
        const totalTimes = getTotalTimes(activityId);
        const progress = totalTimes > 0 ? (currentTimes / totalTimes) * 100 : 0;
        const intervalValue = parseFloat(localStorage.getItem("interval") || 0.1, 2);
        document.getElementById("gm-cp-progress").style.width = `${progress}%`;
        document.getElementById("gm-cp-answer-count").innerText = `${currentTimes} / ${totalTimes}`;
        document.getElementById("gm-cp-interval").value = intervalValue;
        document.getElementById("gm-cp-times").value = totalTimes;
        const statusElement = document.getElementById("gm-cp-status");
        const isRunning = localStorage.getItem("isRunning");
        statusElement.className = isRunning ? "status-running" : "status-stopped";
        statusElement.innerText = `${isRunning ? "运行中" : "已停止"}`;
    }

    function getActivityIdFromUrl() {
        const queryStringPattern = /[?&]activityid=([\w\d]+)/i;
        const queryStringMatch = queryStringPattern.exec(window.location.search);

        if (queryStringMatch) {
            return queryStringMatch[1];
        }
        const pathPattern = /\/(?:jq|vm)\/([a-zA-Z\d]+)/;
        const pathMatch = pathPattern.exec(window.location.pathname);

        if (pathMatch) {
            return pathMatch[1];
        }

        return null;
    }




    function clearSurveyData() {
        localStorage.setItem(`currentTimes_${activityId}`, "0");
        updateProgressAndCount();
    }

    function getCurrentTimes(activityId) {
        const currentTimes = localStorage.getItem(`currentTimes_${activityId}`);
        return currentTimes ? parseInt(currentTimes, 10) : 0;
    }

    function getTotalTimes(activityId) {
        const totalTimes = localStorage.getItem(`totalTimes_${activityId}`);
        return totalTimes ? parseInt(totalTimes, 10) : 1;
    }


    function randomNum(length) {
        return Math.floor(Math.random() * length);
    }

    function randomDelay(minDelay = 500, maxDelay = 1000) {
        return new Promise(resolve => setTimeout(resolve, Math.random() * (maxDelay - minDelay) + minDelay));
    }

    function delayNextAction() {
        const interval = parseFloat(localStorage.getItem("interval") || "0.1", 10); 
        const promise = cancellableDelay(interval * 1000);
        promiseQueue.push(promise);
        return promise;
    }


    // 更简洁的处理单选和多选逻辑
    async function processSelection(options, isMultiple) {
        let shuffledOptions = shuffle(Array.from(options))
        const selectionCount = isMultiple ? randomNum(shuffledOptions.length) + 1 : 1;
        for (let i = 0; i < selectionCount; i++) {
            shuffledOptions[i].click();
            await randomDelay(100, 500);
        }

    }

    async function processBlank(question, config) {
        const inputField = question.querySelector('input[type="text"], textarea');
        if (inputField) {
            const questionId = question.getAttribute('id').split('div')[1];
            const matchingConfig = config.find(c => c.id.toString() === questionId);
            if (matchingConfig) {
                inputField.value = matchingConfig.answer[randomNum(matchingConfig.answer.length)];
            } else {
                generatedAnswers(question, inputField);
            }

        }
    }

    function generatedAnswers(question, inputField) {
        const questionText = question.innerText.toLowerCase();
        let answer = '';
        if (questionText.includes('姓名')) {
            answer = generateRandomName();
        } else if (questionText.includes('电话')) {
            answer = generateRandomPhoneNumber();
        } else if (questionText.includes('邮箱')) {
            answer = generateRandomEmail();
        } else {
            answer = "无";
        }
        inputField.value = answer;
    }

    function generateRandomEmail() {
        const emailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
        const randomDomain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
        const randomName = generateRandomName();
        return `${randomName}@${randomDomain}`;
    }

    function generateRandomPhoneNumber() {
        const areaCodes = ['010', '020', '030', '040', '050', '060', '070', '080', '090'];
        const randomAreaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
        const randomNumber = Math.floor(Math.random() * 100000000);
        return `${randomAreaCode}-${randomNumber}`;
    }

    function generateRandomName() {
        const firstNames = ['John', 'Jane', 'Mike', 'Emily', 'David', 'Sarah', 'James', 'Jessica', 'Robert', 'Michelle'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        return `${randomFirstName} ${randomLastName}`;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async function processQuestion(question) {
        const type = question.getAttribute('type');
        switch (type) {
            // For single and multiple choice questions (identified by '3' and '4')
            case '3':
            case '4': {
                const isMultiple = type === '4';
                const options = question.querySelectorAll('.ui-radio, .ui-checkbox');
                await processSelection(options, isMultiple);
                break;
            }
            // For fill-in-the-blank questions (identified by '1')
            case '1': {
                await processBlank(question, config);
                break;
            }
            // Optionally handle other types or default cases
            default:
                console.log(`Unhandled question type: ${type}`);
                break;
        }
    }

    function simulateDragAndDrop(element, distance) {
        const rect = element.getBoundingClientRect();
        const startX = rect.left + window.scrollX; // 修正可能的滚动偏移
        const startY = rect.top + window.scrollY;  // 修正可能的滚动偏移
        const endX = startX + distance;
        const mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: startX,
            clientY: startY
        });
        element.dispatchEvent(mouseDownEvent);

        // 模拟鼠标按下后的小延时，增加真实性
        setTimeout(() => {
            const steps = 20; // 模拟拖动的步数
            let stepCount = 0;
            const stepX = distance / steps;

            // 创建一个函数，用于执行每个拖动步骤
            const executeStep = () => {
                // 计算当前步的目标位置
                const targetX = startX + stepX * stepCount;
                const moveEvent = new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    clientX: targetX,
                    clientY: startY  // y坐标保持不变
                });
                document.dispatchEvent(moveEvent);

                stepCount++; // 增加步数

                // 如果还没有拖动完毕，则继续下一步
                if (stepCount <= steps) {
                    // 在执行步骤中随机增加轻微延迟
                    setTimeout(executeStep, 10 + Math.random() * 5);
                } else {
                    // 完成拖动，触发mouseup事件
                    const mouseUpEvent = new MouseEvent('mouseup', {
                        bubbles: true,
                        cancelable: true,
                        clientX: targetX,
                        clientY: startY
                    });
                    document.dispatchEvent(mouseUpEvent);
                }
            };

            // 开始模拟拖动
            executeStep();
        }, 100); // 开始前的小延时
    }

    async function simulateClick(element) {
        // 获取元素的位置和大小
        const rect = element.getBoundingClientRect();
        const left = window.scrollX + rect.left; // 加上滚动偏移
        const top = window.scrollY + rect.top; // 加上滚动偏移
        const width = rect.width;
        const height = rect.height;

        // 在元素内随机选择一个位置
        const randomX = left + Math.random() * width;
        const randomY = top + Math.random() * height;

        // 模拟鼠标按下
        const mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: randomX,
            clientY: randomY,
            view: window
        });
        element.dispatchEvent(mouseDownEvent);

        // 模拟鼠标松开
        const mouseUpEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            clientX: randomX,
            clientY: randomY,
            view: window
        });
        element.dispatchEvent(mouseUpEvent);

        // 模拟点击事件
        // 请注意，在某些情况下，click 事件可能会自动在 mouseup 事件之后触发，
        // 但是直接触发 click 事件可以确保无论如何都会进行处理。
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            clientX: randomX,
            clientY: randomY,
            view: window
        });
        element.dispatchEvent(clickEvent);
    }



    async function submitSurvey() {
        let currentTimes = getCurrentTimes(activityId) + 1;
        localStorage.setItem(`currentTimes_${activityId}`, currentTimes.toString());
        const submitButton = document.querySelector('#ctlNext');
        simulateClick(submitButton);
        await randomDelay();
        const confirmButton = document.querySelector('a.layui-layer-btn0');
        if (confirmButton && confirmButton.offsetParent !== null) {
            confirmButton.click();
            await randomDelay();
        }

        await validateAllAnswers();
        if (submitButton && confirmButton.offsetParent !== null) {
            confirmButton.click();
            await randomDelay();
        }



        const refresh = document.querySelector('#nc_1_refresh1');
        if (refresh && refresh.offsetParent !== null) {
            simulateClick(refresh);
            await randomDelay(2000, 3000);
        }

        const rectMask = document.querySelector('#rectMask');
        if (rectMask && rectMask.offsetParent !== null) {
            simulateClick(rectMask);
            await randomDelay(6000, 8000);

            const slider = document.querySelector('.icon.nc-iconfont.icon-slide-arrow') || document.querySelector('.nc_iconfont.btn_slide');
            if (slider) {
                simulateDragAndDrop(slider, 260);
                await randomDelay();
            }
        }


    }

    async function validateAllAnswers() {
        const questions = document.querySelectorAll('div[type]');
        for (let question of questions) {
            if (cancelRequested) break;
            const isSelected = question.querySelector('.checked');
            if (!isSelected) {
                await processQuestion(question);
            }
        }
    }

    async function processPageQuestion() {
        const questions = document.querySelectorAll('div[type]');
        for (let question of questions) {
            if (cancelRequested) break;
            await processQuestion(question);
            await delayNextAction();
        }
    }

    async function main() {
        updateProgressAndCount();
        if (window.location.href.includes("complete")) {
            window.location.href = `https://www.wjx.cn/vm/${activityId}.aspx`;
        } else {
            await processPageQuestion();
            await submitSurvey();
        }
    }


    addUI();

    if (localStorage.getItem("isRunning") === "true" && !cancelRequested && getCurrentTimes(activityId) < getTotalTimes(activityId)) {
        main();
    } else {
        localStorage.removeItem("isRunning");
    }
    updateProgressAndCount();
    updateToggleIcon();
})();