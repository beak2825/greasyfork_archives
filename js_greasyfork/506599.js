// ==UserScript==
// @name         [MWI]Enhancement Tool
// @name:zh-CN   [银河奶牛]强化工具(血压工具)
// @name:zh-TW   [銀河奶牛]強化工具
// @namespace    http://tampermonkey.net/
// @version      1.02
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
// @downloadURL https://update.greasyfork.org/scripts/506599/%5BMWI%5DEnhancement%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/506599/%5BMWI%5DEnhancement%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let enhancementLevel;
    let list = {};
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
            if (obj && obj.type === "action_completed" && obj.endCharacterAction && obj.endCharacterAction.actionHrid === "/actions/enhancing/enhance") {
                const now_enhancementLevel = parseInt(obj.endCharacterAction.upgradeItemHash.match(/::(\d+)$/)[1]);
                if (enhancementLevel !== undefined) {
                    if (!list[enhancementLevel]) {
                        list[enhancementLevel] = { "成功次数": 0, "失败次数": 0, "成功率": 0 };
                    }
                    if (enhancementLevel < now_enhancementLevel) {
                        list[enhancementLevel]["成功次数"]++;
                    } else {
                        list[enhancementLevel]["失败次数"]++;
                    }
                    const success = list[enhancementLevel]["成功次数"];
                    const failure = list[enhancementLevel]["失败次数"];
                    list[enhancementLevel]["成功率"] = success / (success + failure);

                    enhancementLevel = now_enhancementLevel;
                } else {
                    enhancementLevel = now_enhancementLevel;
                }
                console.log("强化统计", list);
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

        let enhancementStats_Container = document.querySelector("#enhancementStatsContainer");

        if (!enhancementStats_Container) {
            enhancementStats_Container = document.createElement("div");
            enhancementStats_Container.id = "enhancementStatsContainer";
            enhancementStats_Container.style.display = "grid";
            enhancementStats_Container.style.gridTemplateColumns = "repeat(4, 1fr)";
            enhancementStats_Container.style.gap = "10px";
            enhancementStats_Container.style.textAlign = "center";
            enhancementStats_Container.style.marginTop = "10px";

            targetElement.appendChild(enhancementStats_Container);
        }

        enhancementStats_Container.innerHTML = "";

        const headers = ["等级", "成功次数", "失败次数", "成功率"];
        headers.forEach(headerText => {
            const headerDiv = document.createElement("div");
            headerDiv.style.fontWeight = "bold";
            headerDiv.textContent = isZH ? headerText : headerText === "等级" ? "Level" : headerText === "成功次数" ? "Success" : headerText === "失败次数" ? "Failure" : "Success Rate";
            enhancementStats_Container.appendChild(headerDiv);
        });

        let totalSuccess = Object.values(list).reduce((acc, val) => acc + val["成功次数"], 0);
        let totalFailure = Object.values(list).reduce((acc, val) => acc + val["失败次数"], 0);
        let totalCount = totalSuccess + totalFailure;
        let totalRate = totalCount > 0 ? (totalSuccess / totalCount * 100).toFixed(2) : "0.00";

        ["总计", totalSuccess, totalFailure, `${totalRate}%`].forEach((totalText, index) => {
            const totalDiv = document.createElement("div");
            totalDiv.textContent = isZH ? totalText : index === 0 ? "Total" : totalText;
            enhancementStats_Container.appendChild(totalDiv);
        });

        Object.keys(list).sort((a, b) => b - a).forEach(level => {
            [level, list[level]["成功次数"], list[level]["失败次数"], `${(list[level]["成功率"] * 100).toFixed(2)}%`].forEach(data => {
                const dataDiv = document.createElement("div");
                dataDiv.textContent = data;
                enhancementStats_Container.appendChild(dataDiv);
            });
        });
    }

    hookWS();
})();

