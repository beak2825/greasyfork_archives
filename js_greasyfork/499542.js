// ==UserScript==
// @name         强化模拟
// @version      0.19
// @description  模拟游戏强化过程并输出结果到面板中
// @author       Truth_Light
// @license      Truth_Light
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/1313709
// @downloadURL https://update.greasyfork.org/scripts/499542/%E5%BC%BA%E5%8C%96%E6%A8%A1%E6%8B%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/499542/%E5%BC%BA%E5%8C%96%E6%A8%A1%E6%8B%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var currentVersion = "0.19"

    var panelCreated = false;

    // 获取本地存储中的设置，如果不存在则使用默认值
    function getSetting(key, defaultValue) {
        var value = localStorage.getItem(key);
        return value !== null ? JSON.parse(value) : defaultValue;
    }

    // 将设置保存到本地存储中
    function saveSetting(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function createPanel() {
        var parentElement = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div");
        if (!parentElement) return;

        // 检查是否已存在面板
        var existingPanel = parentElement.querySelector(".enhancementPanel");
        if (existingPanel) {
            return; // 如果已存在面板，则不再创建
        }

        // 创建面板
        var panel = document.createElement("div");
        panel.className = "enhancementPanel"; // 添加类名以便检查
        panel.style.position = "absolute";
        panel.style.left = "0";
        panel.style.top = "0";
        panel.style.backgroundColor = "var(--color-midnight-700)";
        panel.style.border = "1px solid var(--color-space-300)";
        panel.style.padding = "8px 12px";
        panel.style.zIndex = "1000";
        panel.style.fontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';
        panel.style.fontSize = "14px";
        panel.style.color = "var(--color-text-dark-mode)";
        panel.style.borderRadius = "4px";
        panel.style.width = "calc(100% + 9px)";
        panel.style.maxWidth = "300px";
        panel.style.maxHeight = "370px";
        panel.style.overflowY = "auto";
        panel.style.overflowX = "hidden";
        panel.style.display = "flex";
        panel.style.flexDirection = "column";
        panel.style.gap = "4px";

        // 创建隐藏/显示按钮
        var toggleButton = document.createElement("button");
        toggleButton.innerText = "隐藏面板";
        toggleButton.style.marginBottom = "10px";
        toggleButton.onclick = function() {
            var panelContent = document.getElementById("panelContent");
            if (panelContent.style.display === "none") {
                panelContent.style.display = "flex";
                toggleButton.innerText = "隐藏面板";
            } else {
                panelContent.style.display = "none";
                toggleButton.innerText = "显示面板";
            }
        };

        // 包装面板内容
        var panelContent = document.createElement("div");
        panelContent.id = "panelContent";
        panelContent.style.display = "flex";
        panelContent.style.flexDirection = "column";
        panelContent.style.gap = "4px";

        // 创建表单
        var form = document.createElement("form");

        // 输入框和标签生成函数
        function createInput(labelText, id, defaultValue) {
            var label = document.createElement("label");
            label.htmlFor = id;
            label.innerText = labelText;
            label.style.flex = "1";

            var input = document.createElement("input");
            input.type = "text";
            input.id = id;
            input.value = getSetting(id, defaultValue); // 从本地存储中获取值
            input.style.flex = "1";
            input.style.width = "100%";

            input.addEventListener("input", function() {
                saveSetting(id, input.value); // 用户输入时保存到本地存储
            });

            var container = document.createElement("div");
            container.style.display = "flex";
            container.style.justifyContent = "space-between";
            container.style.marginBottom = "8px";

            container.appendChild(label);
            container.appendChild(input);
            form.appendChild(container);
        }

        // 创建下拉框和标签生成函数
        function createSelect(labelText, id, options) {
            var label = document.createElement("label");
            label.htmlFor = id;
            label.innerText = labelText;
            label.style.flex = "1";

            var select = document.createElement("select");
            select.id = id;
            select.style.flex = "1";
            select.style.width = "100%";
            select.value = getSetting(id, options[0]); // 从本地存储中获取值

            options.forEach(optionText => {
                var option = document.createElement("option");
                option.value = optionText === "是" ? true : false;
                option.innerText = optionText;
                select.appendChild(option);
            });

            select.addEventListener("change", function() {
                saveSetting(id, select.value); // 用户选择时保存到本地存储
            });

            var container = document.createElement("div");
            container.style.display = "flex";
            container.style.justifyContent = "space-between";
            container.style.marginBottom = "8px";

            container.appendChild(label);
            container.appendChild(select);
            form.appendChild(container);
        }

        // 创建输入框和下拉框
        createInput("最高强化多少手:", "maxAttemptsPerRound", 1000);
        createInput("保护启用等级:", "protectionStoneStart", 5);
        createInput("保护最大数量:", "maxProtectionStones", 10);
        createInput("强化成功率加成:", "enhancementBonus", 0);
        createInput("初始强化等级:", "initialEnhancementLevel", 0);
        createInput("目标强化等级:", "targetEnhancementLevel", 10);
        createInput("模拟轮数:", "rounds", 10000);
        createSelect("使用祝福茶:", "useBlessingTea", ["是", "否"]);

        // 创建按钮
        var button = document.createElement("button");
        button.type = "button";
        button.innerText = "开始模拟";
        button.style.marginTop = "10px";
        button.onclick = runSimulation;

        // 结果显示区域
        var resultDiv = document.createElement("div");
        resultDiv.id = "simulationResult";
        resultDiv.style.marginTop = "10px";

        form.appendChild(button);
        panelContent.appendChild(form);
        panelContent.appendChild(resultDiv);
        panel.appendChild(toggleButton);
        panel.appendChild(panelContent);
        parentElement.appendChild(panel);

        panelCreated = true; // 设置面板已创建的标志
    }

    function runSimulation() {
        // 获取用户输入值，现在直接从本地存储中获取
        var maxAttemptsPerRound = parseInt(getSetting("maxAttemptsPerRound", 1000));
        var protectionStoneStart = parseInt(getSetting("protectionStoneStart", 5));
        var maxProtectionStones = parseInt(getSetting("maxProtectionStones", 10));
        var enhancementBonus = parseFloat(getSetting("enhancementBonus", 0));
        var initialEnhancementLevel = parseInt(getSetting("initialEnhancementLevel", 0));
        var targetEnhancementLevel = parseInt(getSetting("targetEnhancementLevel", 10));
        var rounds = parseInt(getSetting("rounds", 10000));
        var useBlessingTea = getSetting("useBlessingTea", "是") === "是"; // 将字符串转换为布尔值

        // 添加条件判断
        if (protectionStoneStart < 2) {
            protectionStoneStart = 20;
            maxProtectionStones = 25565;
        }

        // 强化成功率表
        var successRateTable = {
            1: 0.50,
            2: 0.45,
            3: 0.45,
            4: 0.40,
            5: 0.40,
            6: 0.40,
            7: 0.35,
            8: 0.35,
            9: 0.35,
            10: 0.35,
            11: 0.30,
            12: 0.30,
            13: 0.30,
            14: 0.30,
            15: 0.30,
            16: 0.30,
            17: 0.30,
            18: 0.30,
            19: 0.30,
            20: 0.30,
        };

        // 模拟强化过程
        var successfulRounds = 0;
        var totalAttempts = 0;
        var attemptsList = [];
        var totalProtectionStonesUsed = 0;
        var protectionStonesList = [];

        for (var i = 0; i < rounds; i++) {
            var currentLevel = initialEnhancementLevel;
            var attempts = 0;
            var protectionStonesUsed = 0;

            while (currentLevel < targetEnhancementLevel && attempts < maxAttemptsPerRound && protectionStonesUsed < maxProtectionStones) {
                attempts++;
                var successRate = successRateTable[currentLevel + 1] * (1 + enhancementBonus);

                if (Math.random() < successRate) {
                    // 强化成功
                    if (useBlessingTea && Math.random() < 0.01) {
                        currentLevel += 2;  // 使用祝福茶，1%几率+2
                    } else {
                        currentLevel++;
                    }
                } else {
                    // 强化失败
                    if (currentLevel >= protectionStoneStart && protectionStonesUsed < maxProtectionStones) {
                        protectionStonesUsed++;
                        currentLevel--;  // 使用保护石
                    } else {
                        currentLevel = 0;  // 强化等级归零
                    }
                }
            }

            if (currentLevel >= targetEnhancementLevel) {
                successfulRounds++;
                attemptsList.push(attempts);
                protectionStonesList.push(protectionStonesUsed);
            }
            totalAttempts += attempts;
            totalProtectionStonesUsed += protectionStonesUsed;
        }

        // 统计数据
        var averageSuccessRate = successfulRounds / rounds;
        var avgAttempts = successfulRounds > 0 ? attemptsList.reduce((a, b) => a + b, 0) / successfulRounds : 0;
        var avgProtectionStones = successfulRounds > 0 ? protectionStonesList.reduce((a, b) => a + b, 0) / successfulRounds : 0;
        var minAttempts = successfulRounds > 0 ? Math.min(...attemptsList) : 0;
        var maxAttempts = successfulRounds > 0 ? Math.max(...attemptsList) : 0;
        var minProtectionStones = successfulRounds > 0 ? Math.min(...protectionStonesList) : 0;
        var maxProtectionStones = successfulRounds > 0 ? Math.max(...protectionStonesList) : 0;

        // 输出结果
        var resultDiv = document.getElementById("simulationResult");
        resultDiv.innerHTML = `
            <p>成功率: ${(averageSuccessRate * 100).toFixed(2)}%</p>
            <p>平均强化次数: ${avgAttempts.toFixed(2)}</p>
            <p>最少强化次数: ${minAttempts}</p>
            <p>最大强化次数: ${maxAttempts}</p>
            <p>平均使用保护数量: ${avgProtectionStones.toFixed(2)}</p>
            <p>最少使用保护数量: ${minProtectionStones}</p>
            <p>最大使用保护数量: ${maxProtectionStones}</p>
        `;
    }

    function checkAndCreatePanel() {
        var parentElement = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1)");

        if (parentElement) {
            var childElement1 = parentElement.querySelector(".enhancementPanel");
            if (childElement1) {
                return;
            }
            var childElement2 = parentElement.querySelector(".EnhancingPanel_enhancingPanel__ysWpV");
            if (childElement2) {
                createPanel();
            }

        }
    }

    setInterval(checkAndCreatePanel, 1000); // 定时检查是否需要创建面板

    function showUpdatePrompt() {
        if (confirm("有新版本的 强化模拟 脚本可用。是否前往更新？")) {
            window.location.href = "https://update.greasyfork.org/scripts/499542/%E5%BC%BA%E5%8C%96%E6%A8%A1%E6%8B%9F.user.js";
        }
    }

    var versionCheckURL = "https://update.greasyfork.org/scripts/499542.meta.js"

    function checkForUpdate() {
        fetch(versionCheckURL)
            .then(response => response.text())
            .then(text => {
            var latestVersion = text.match(/@version\s+([\d.]+)/)[1];
            if (latestVersion !== currentVersion) {
                showUpdatePrompt();
            }
        })
            .catch(error => {
            console.error("版本检查失败:", error);
        });
    }

    checkForUpdate();
})();


