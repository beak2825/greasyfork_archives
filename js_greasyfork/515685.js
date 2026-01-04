// ==UserScript==
// @name         Bilibili隐藏短视频
// @namespace    http://tampermonkey.net/
// @version      6.4
// @description  视频检测设置面板，样式自定义、临界时长调整，支持禁用检测恢复原样，添加自定义规则
// @match        *://www.bilibili.com/*
// @grant        GM_registerMenuCommand
// @license      GPL 2.0
// @downloadURL https://update.greasyfork.org/scripts/515685/Bilibili%E9%9A%90%E8%97%8F%E7%9F%AD%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/515685/Bilibili%E9%9A%90%E8%97%8F%E7%9F%AD%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let minDuration = parseInt(localStorage.getItem('minDuration')) || 300;
    let debounceDelay = parseInt(localStorage.getItem('debounceDelay')) || 500;
    let isActive = JSON.parse(localStorage.getItem('isActive')) || true;
    let isPanelVisible = JSON.parse(localStorage.getItem('isPanelVisible')) || false;
    let styleChoice = localStorage.getItem('styleChoice') || '半透明';
    let detectedElements = [];
    let customRules = JSON.parse(localStorage.getItem('customRules')) || [];

    let settings = {
        warnMarketingAccount: JSON.parse(localStorage.getItem('warnMarketingAccount')) || true,
        warnLowQualityName: JSON.parse(localStorage.getItem('warnLowQualityName')) || true,
        warnClickbaitTitle: JSON.parse(localStorage.getItem('warnClickbaitTitle')) || true,
        warnFakeHacker: JSON.parse(localStorage.getItem('warnFakeHacker')) || true,
        warnPseudoScience: JSON.parse(localStorage.getItem('warnPseudoScience')) || true,
    };

    function initControlPanel() {
        if (document.getElementById("controlPanel")) return;

        const panel = document.createElement("div");
        panel.style.position = "fixed";
        panel.style.top = "10px";
        panel.style.right = "10px";
        panel.style.width = "260px";
        panel.style.padding = "10px";
        panel.style.backgroundColor = "#f9f9f9";
        panel.style.border = "1px solid #ccc";
        panel.style.borderRadius = "8px";
        panel.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
        panel.style.zIndex = "9999";
        panel.id = "controlPanel";
        panel.style.display = isPanelVisible ? "block" : "none";

        panel.innerHTML = `
            <h3>检测设置 <span id="closePanel" style="cursor:pointer;float:right;">×</span></h3>
            <label>分界时间 (秒): <input type="number" id="minDuration" value="${minDuration}"></label><br>
            <label>防抖延迟 (毫秒): <input type="number" id="debounceDelay" value="${debounceDelay}"></label><br>
            <label>样式选择:
                <select id="styleChoice">
                    <option value="半透明" ${styleChoice === '半透明' ? 'selected' : ''}>半透明</option>
                    <option value="边框高亮" ${styleChoice === '边框高亮' ? 'selected' : ''}>边框高亮</option>
                    <option value="背景高亮" ${styleChoice === '背景高亮' ? 'selected' : ''}>背景高亮</option>
                </select>
            </label><br>
            <label><input type="checkbox" id="warnMarketingAccount" ${settings.warnMarketingAccount ? 'checked' : ''}> 警惕营销号</label><br>
            <label><input type="checkbox" id="warnLowQualityName" ${settings.warnLowQualityName ? 'checked' : ''}> 小心科技区小学生低质视频</label><br>
            <label><input type="checkbox" id="warnClickbaitTitle" ${settings.warnClickbaitTitle ? 'checked' : ''}> 小心标题党</label><br>
            <label><input type="checkbox" id="warnFakeHacker" ${settings.warnFakeHacker ? 'checked' : ''}> 警惕假黑客</label><br>
            <label><input type="checkbox" id="warnPseudoScience" ${settings.warnPseudoScience ? 'checked' : ''}> 小心伪科普</label><br>
            <button id="toggleDetection">${isActive ? "禁用检测" : "启用检测"}</button>
            <button id="addCustomRule">添加自定义规则</button>
            <button id="clearLogs">清空日志</button>
            <h4>检测日志</h4>
            <div id="logInfo" style="height: 100px; overflow-y: auto; background: #e9e9e9; padding: 5px; border-radius: 4px;"></div>
        `;

        document.body.appendChild(panel);

        document.getElementById("toggleDetection").onclick = toggleDetection;
        document.getElementById("closePanel").onclick = closePanel;
        document.getElementById("minDuration").onchange = updateSettings;
        document.getElementById("debounceDelay").onchange = updateSettings;
        document.getElementById("styleChoice").onchange = updateSettings;
        document.getElementById("warnMarketingAccount").onchange = updateSettings;
        document.getElementById("warnLowQualityName").onchange = updateSettings;
        document.getElementById("warnClickbaitTitle").onchange = updateSettings;
        document.getElementById("warnFakeHacker").onchange = updateSettings;
        document.getElementById("warnPseudoScience").onchange = updateSettings;
        document.getElementById("addCustomRule").onclick = addCustomRule;
        document.getElementById("clearLogs").onclick = clearLogs;
    }

    function toggleDetection() {
        isActive = !isActive;
        localStorage.setItem("isActive", isActive);
        document.getElementById("toggleDetection").textContent = isActive ? "禁用检测" : "启用检测";
        if (!isActive) {
            clearMarkers();
        } else {
            runDetection();
        }
    }

    function closePanel() {
        isPanelVisible = false;
        localStorage.setItem("isPanelVisible", isPanelVisible);
        document.getElementById("controlPanel").style.display = "none";
    }

    function updateSettings() {
        minDuration = parseInt(document.getElementById("minDuration").value);
        debounceDelay = parseInt(document.getElementById("debounceDelay").value);
        styleChoice = document.getElementById("styleChoice").value;
        settings.warnMarketingAccount = document.getElementById("warnMarketingAccount").checked;
        settings.warnLowQualityName = document.getElementById("warnLowQualityName").checked;
        settings.warnClickbaitTitle = document.getElementById("warnClickbaitTitle").checked;
        settings.warnFakeHacker = document.getElementById("warnFakeHacker").checked;
        settings.warnPseudoScience = document.getElementById("warnPseudoScience").checked;

        localStorage.setItem("minDuration", minDuration);
        localStorage.setItem("debounceDelay", debounceDelay);
        localStorage.setItem("styleChoice", styleChoice);
        localStorage.setItem("warnMarketingAccount", settings.warnMarketingAccount);
        localStorage.setItem("warnLowQualityName", settings.warnLowQualityName);
        localStorage.setItem("warnClickbaitTitle", settings.warnClickbaitTitle);
        localStorage.setItem("warnFakeHacker", settings.warnFakeHacker);
        localStorage.setItem("warnPseudoScience", settings.warnPseudoScience);

        runDetection();
    }

    function addCustomRule() {
        const rule = prompt("请输入自定义规则（格式：关键词:提示）");
        if (rule) {
            const [keyword, tip] = rule.split(":");
            if (keyword && tip) {
                customRules.push({ keyword: keyword.trim(), tip: tip.trim() });
                localStorage.setItem("customRules", JSON.stringify(customRules));
            } else {
                alert("规则格式不正确，请使用“关键词:提示”的格式！");
            }
        }
    }

    function clearLogs() {
        detectedElements = [];
        document.getElementById("logInfo").innerHTML = "";
    }

    function updateLogInfo() {
        const logDiv = document.getElementById("logInfo");
        logDiv.innerHTML = `
            当前检测到的视频数量：${detectedElements.length}<br>
            索引位置：${detectedElements.map((elem) => elem.index).join(", ")}
        `;
    }

    function convertDurationToSeconds(durationText) {
        const timeParts = durationText.split(":").map(Number);
        if (timeParts.length === 2) {
            return timeParts[0] * 60 + timeParts[1];
        } else if (timeParts.length === 3) {
            return timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
        }
        return 0;
    }

    function clearMarkers() {
        detectedElements.forEach((item) => {
            item.element.style.opacity = "1";
            item.element.style.border = "";
            item.element.style.backgroundColor = "";
            const warning = item.element.querySelector(".short-video-warning");
            if (warning) warning.remove();
        });
        detectedElements = [];
        updateLogInfo();
    }

    function applyStyle(element, warningText) {
        if (styleChoice === "半透明") {
            element.style.opacity = "0.5";
        } else if (styleChoice === "边框高亮") {
            element.style.border = "2px solid red";
        } else if (styleChoice === "背景高亮") {
            element.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
        }

        if (warningText) {
            const warning = document.createElement("div");
            warning.className = "short-video-warning";
            warning.style.position = "absolute";
            warning.style.top = "10px";
            warning.style.left = "10px";
            warning.style.padding = "4px 8px";
            warning.style.backgroundColor = "rgba(255, 0, 0, 1)"; // 不透明
            warning.style.color = "white";
            warning.style.fontSize = "12px";
            warning.style.fontWeight = "bold";
            warning.style.borderRadius = "4px";
            warning.style.zIndex = "10";
            warning.textContent = warningText;
            element.style.position = "relative";
            element.appendChild(warning);
        }
    }

    function processVideoCards() {
        const videoSelectors = ['.bili-video-card', '.video-page-card-small'];
        videoSelectors.forEach((selector) => {
            const videoCards = document.querySelectorAll(selector);

            videoCards.forEach((card, index) => {
                if (detectedElements.find((elem) => elem.element === card)) return;

                const followedElement = card.querySelector('.bili-video-card__info--icon-text') || card.querySelector('.upname .name');
                if (followedElement && followedElement.textContent.includes('已关注')) return;

                const upNameElement = card.querySelector('.bili-video-card__info--author') || card.querySelector('.upname .name');
                const titleElement = card.querySelector('.bili-video-card__info--tit a') || card.querySelector('.title a');
                const durationElement = card.querySelector('.bili-video-card__stats__duration') || card.querySelector('.duration');

                let warningText = "";

                // 检测营销号
                if (settings.warnMarketingAccount && upNameElement && upNameElement.textContent.includes("观察")) {
                    warningText = "警惕营销号";
                }

                // 检测低质量视频
                else if (settings.warnLowQualityName && upNameElement && (upNameElement.textContent.match(/_/g) || []).length >= 2) {
                    warningText = "小心科技区小学生低质视频";
                }

                // 检测标题党
                else if (settings.warnClickbaitTitle && titleElement && (titleElement.textContent.match(/!/g) || []).length >= 2) {
                    warningText = "小心标题党";
                }

                // 检测假黑客
                else if (settings.warnFakeHacker && upNameElement && /(黑客|网安|白帽)/.test(upNameElement.textContent)) {
                    warningText = "警惕假黑客";
                }

                // 检测伪科普
                else if (settings.warnPseudoScience && titleElement && /(禁止废话|废话)/.test(titleElement.textContent)) {
                    warningText = "小心伪科普";
                }

                // 自定义规则检测
                else {
                    for (let rule of customRules) {
                        if ((upNameElement && upNameElement.textContent.includes(rule.keyword)) || (titleElement && titleElement.textContent.includes(rule.keyword))) {
                            warningText = rule.tip;
                            break;
                        }
                    }
                }

                // 检测短视频
                if (!warningText && durationElement) {
                    const durationText = durationElement.textContent.trim();
                    const durationInSeconds = convertDurationToSeconds(durationText);
                    if (durationInSeconds < minDuration) {
                        warningText = durationInSeconds < 60 ? "小心沉迷短视频！" : "短视频";
                    }
                }

                if (warningText) {
                    applyStyle(card, warningText);
                    detectedElements.push({ element: card, index });
                    updateLogInfo();
                }
            });
        });
    }

    // 防抖函数定义
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const observer = new MutationObserver(debounce(() => {
        if (isActive) runDetection();
    }, debounceDelay));

    function runDetection() {
        clearMarkers();
        processVideoCards();
    }

    initControlPanel();
    observer.observe(document.body, { childList: true, subtree: true });

    GM_registerMenuCommand("显示/隐藏控制面板", () => {
        isPanelVisible = !isPanelVisible;
        localStorage.setItem("isPanelVisible", isPanelVisible);
        document.getElementById("controlPanel").style.display = isPanelVisible ? "block" : "none";
    });
})();
