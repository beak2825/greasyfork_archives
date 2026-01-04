// ==UserScript==
// @name         [MWI]Enhancement Tool
// @name:zh-CN   [银河奶牛]强化工具(血压工具)
// @name:zh-TW   [銀河奶牛]強化工具
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Track the number of enhancement successes and failures
// @description:zh-CN 在线统计强化成功/失败次数
// @description:zh-TW 統計強化成功/失敗次數
// @author       Truth_Light
// @license      Truth_Light
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/506960/%5BMWI%5DEnhancement%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/506960/%5BMWI%5DEnhancement%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let enhancementLevel;
    let currentEnhancingIndex = 1;
    let enhancementData = {
        [currentEnhancingIndex]: { "强化数据": {}, "其他数据": {} }
    };
    let item_name_to_hrid;
    let item_hrid_to_name;

    const userLanguage = navigator.language || navigator.userLanguage;
    const isZH = userLanguage.startsWith("zh");

    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;

        dataProperty.get = hookedGet;
        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) {
                return oriGet.call(this);
            }
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message });

            return handleMessage(message);
        }
    }

    function handleMessage(message) {
        try {
            let obj = JSON.parse(message);
            if (obj && obj.type === "init_character_data") {
                const initClientData = localStorage.getItem('initClientData');
                if (!initClientData) return;
                let obj;
                try {
                    obj = JSON.parse(initClientData);
                } catch (error) {
                    console.error('数据解析失败:', error);
                    return;
                }
                if (obj.type !== 'init_client_data') return;
                item_hrid_to_name = obj.itemDetailMap;
                for (const key in item_hrid_to_name) {
                    if (item_hrid_to_name[key] && typeof item_hrid_to_name[key] === 'object' && item_hrid_to_name[key].name) {
                        item_hrid_to_name[key] = item_hrid_to_name[key].name;
                    }
                }
                item_name_to_hrid = Object.fromEntries(
                    Object.entries(item_hrid_to_name).map(([key, value]) => [value, key])
                );
            } else if (obj && obj.type === "action_completed" && obj.endCharacterAction && obj.endCharacterAction.actionHrid === "/actions/enhancing/enhance") {
                const now_enhancementLevel = parseInt(obj.endCharacterAction.primaryItemHash.match(/::(\d+)$/)[1]);
                const currentCount = obj.endCharacterAction.currentCount;
                if (enhancementLevel !== undefined) {
                    // 开始新的物品的强化
                    if (currentCount < enhancementData[currentEnhancingIndex]["强化次数"]) {
                        currentEnhancingIndex++;
                        enhancementData[currentEnhancingIndex] = { "强化数据": {}, "其他数据": {} };
                        enhancementLevel = undefined;
                        return message
                    }

                    const currentItem = enhancementData[currentEnhancingIndex]["强化数据"];


                    if (!currentItem[enhancementLevel]) {
                        currentItem[enhancementLevel] = { "成功次数": 0, "失败次数": 0, "成功率": 0 };
                    }

                    if (enhancementLevel < now_enhancementLevel) {
                        currentItem[enhancementLevel]["成功次数"]++;
                    } else {
                        currentItem[enhancementLevel]["失败次数"]++;
                        if (obj.endCharacterAction.enhancingProtectionMinLevel >= 2 && enhancementLevel >= obj.endCharacterAction.enhancingProtectionMinLevel) {
                            enhancementData[currentEnhancingIndex]["其他数据"]["保护消耗总数"]++;
                        }
                    }

                    const success = currentItem[enhancementLevel]["成功次数"];
                    const failure = currentItem[enhancementLevel]["失败次数"];
                    currentItem[enhancementLevel]["成功率"] = success / (success + failure);

                    // 计算强化状态
                    const highestSuccessLevel = Math.max(...Object.keys(currentItem).filter(level => currentItem[level]["成功次数"] > 0));
                    const enhancementState = (highestSuccessLevel + 1 >= enhancementData[currentEnhancingIndex]["其他数据"]["目标强化等级"]) ? "强化成功" : "强化失败";
                    enhancementData[currentEnhancingIndex]["强化状态"] = enhancementState;
                    enhancementLevel = now_enhancementLevel;
                } else {
                    // 初始化数据
                    enhancementLevel = now_enhancementLevel;
                    const itemName = item_hrid_to_name[obj.endCharacterAction.primaryItemHash.match(/::([^:]+)::[^:]*$/)[1]];
                    enhancementData[currentEnhancingIndex]["其他数据"] = {
                        "物品名称": itemName,
                        "目标强化等级": obj.endCharacterAction.enhancingMaxLevel,
                        "保护消耗总数": 0,
                    };
                }
                console.log(enhancementData)
                enhancementData[currentEnhancingIndex]["强化次数"] = currentCount;
                updateDisplay();
            } else {
                return message;
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
        return message;
    }

    function updateDisplay() {
        const targetElement = document.querySelector(".SkillActionDetail_enhancingComponent__17bOx");
        if (!targetElement) return;

        // 创建父容器
        let parentContainer = document.querySelector("#enhancementParentContainer");
        if (!parentContainer) {
            parentContainer = document.createElement("div");
            parentContainer.id = "enhancementParentContainer";
            parentContainer.style.display = "block"; // 设置为纵向布局（块级元素）
            parentContainer.style.borderLeft = "2px solid var(--color-divider)";
            parentContainer.style.padding = "0 4px";

            // 创建并添加标题
            const title = document.createElement("div");
            title.textContent = isZH ? "强化数据" : "Enhancement Data";
            title.style.fontWeight = "bold";
            title.style.marginBottom = "10px"; // 标题与下拉框之间的间距
            title.style.textAlign = "center";
            title.style.color = "var(--color-space-300)";
            parentContainer.appendChild(title);

            // 创建并添加下拉框
            const dropdownContainer = document.createElement("div");
            dropdownContainer.style.marginBottom = "10px"; // 下拉框与表格之间的间距

            const dropdown = document.createElement("select");
            dropdown.id = "enhancementDropdown";
            dropdown.addEventListener("change", function () {
                renderStats(this.value);
                updateDropdownColor();
            });

            dropdownContainer.appendChild(dropdown);
            parentContainer.appendChild(dropdownContainer);

            // 创建并添加表格容器
            const enhancementStatsContainer = document.createElement("div");
            enhancementStatsContainer.id = "enhancementStatsContainer";
            enhancementStatsContainer.style.display = "grid";
            enhancementStatsContainer.style.gridTemplateColumns = "repeat(4, 1fr)"; // 设置为4列
            enhancementStatsContainer.style.gap = "10px"; // 每列之间的间距
            enhancementStatsContainer.style.textAlign = "center";
            enhancementStatsContainer.style.marginTop = "10px";

            parentContainer.appendChild(enhancementStatsContainer);
            targetElement.appendChild(parentContainer); // 将父容器添加到目标元素中
        }

        // 更新下拉框内容
        const dropdown = document.querySelector("#enhancementDropdown");
        const previousSelectedValue = dropdown.value;
        dropdown.innerHTML = ""; // 清空下拉框内容

        Object.keys(enhancementData).forEach(key => {
            const item = enhancementData[key];
            const option = document.createElement("option");
            const itemName = item["其他数据"]["物品名称"];
            const targetLevel = item["其他数据"]["目标强化等级"];
            const currentLevel = Math.max(...Object.keys(item["强化数据"]));
            const enhancementState = item["强化状态"];

            option.text = isZH
                ? `${itemName} (目标: ${targetLevel}, 总计: ${item["强化次数"]}${item["其他数据"]["保护消耗总数"] > 0 ? `, 垫子: ${item["其他数据"]["保护消耗总数"]}` : ""})`
            : `${itemName} (Target: ${targetLevel}, Total: ${item["强化次数"]}${item["其他数据"]["保护消耗总数"] > 0 ? `, Protectors Used: ${item["其他数据"]["保护消耗总数"]}` : ""})`;

            option.value = key;
            option.style.color = enhancementState === "强化成功" ? "green"
            : (currentLevel < targetLevel && Object.keys(enhancementData).indexOf(key) === Object.keys(enhancementData).length - 1) ? "orange"
            : "red";

            dropdown.appendChild(option);
        });

        // 设置默认选中项并渲染表格数据
        if (Object.keys(enhancementData).length > 0) {
            dropdown.value = previousSelectedValue || Object.keys(enhancementData)[0];
            updateDropdownColor();
            renderStats(dropdown.value);
        }

        function updateDropdownColor() {
            const selectedOption = dropdown.options[dropdown.selectedIndex];
            dropdown.style.color = selectedOption ? selectedOption.style.color : "black";
        }
    }

    function renderStats(selectedKey) {
        const enhancementStatsContainer = document.querySelector("#enhancementStatsContainer");
        enhancementStatsContainer.innerHTML = ""; // 清空现有内容

        const item = enhancementData[selectedKey];

        // 表头
        const headers = ["等级", "成功", "失败", "概率"];
        headers.forEach(headerText => {
            const headerDiv = document.createElement("div");
            headerDiv.style.fontWeight = "bold";
            headerDiv.textContent = isZH ? headerText : (headerText === "等级" ? "Level" : headerText === "成功次数" ? "Success" : headerText === "失败次数" ? "Failure" : "Success Rate");
            enhancementStatsContainer.appendChild(headerDiv);
        });

        // 总计信息
        const totalSuccess = Object.values(item["强化数据"]).reduce((acc, val) => acc + val["成功次数"], 0);
        const totalFailure = Object.values(item["强化数据"]).reduce((acc, val) => acc + val["失败次数"], 0);
        const totalCount = totalSuccess + totalFailure;
        const totalRate = totalCount > 0 ? (totalSuccess / totalCount * 100).toFixed(2) : "0.00";

        // 将总计信息添加到表格中
        ["总计", totalSuccess, totalFailure, `${totalRate}%`].forEach((totalText, index) => {
            const totalDiv = document.createElement("div");
            totalDiv.textContent = isZH ? totalText : index === 0 ? "Total" : totalText;
            enhancementStatsContainer.appendChild(totalDiv);
        });

        // 渲染各个强化等级的数据
        Object.keys(item["强化数据"]).sort((a, b) => b - a).forEach(level => {
            const levelData = item["强化数据"][level];
            const levelDivs = [level, levelData["成功次数"], levelData["失败次数"], `${(levelData["成功率"] * 100).toFixed(2)}%`];

            levelDivs.forEach(data => {
                const dataDiv = document.createElement("div");
                dataDiv.textContent = data;
                enhancementStatsContainer.appendChild(dataDiv);
            });
        });
    }




    hookWS();
})();
