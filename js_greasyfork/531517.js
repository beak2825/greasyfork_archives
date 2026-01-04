// ==UserScript==
// @name         PUBG2025愚人节活动结局一键完成（看使用说明）
// @namespace    http://tampermonkey.net/
// @version      1.5.3
// @description  一键完成PUBG2025愚人节galgame活动任务
// @author       L
// @icon         https://wstatic-prod.pubg.com/web/live/static/favicons/apple-icon-57x57.png
// @match        *.pubg.com/*/events/wwrdevent*
// @connect      pubg.com
// @connect      www.pubg.com
// @connect      krafton.com
// @connect      api-foc.krafton.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531517/PUBG2025%E6%84%9A%E4%BA%BA%E8%8A%82%E6%B4%BB%E5%8A%A8%E7%BB%93%E5%B1%80%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%EF%BC%88%E7%9C%8B%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/531517/PUBG2025%E6%84%9A%E4%BA%BA%E8%8A%82%E6%B4%BB%E5%8A%A8%E7%BB%93%E5%B1%80%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%EF%BC%88%E7%9C%8B%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let token = "";
    let nickname = "";

    // 读取 sessionStorage 的 focToken
    function getTokenFromSession() {
        return sessionStorage.getItem("focToken") || "";
    }

    // 控制面板
    function createPanel() {
        const panel = document.createElement("div");
        panel.style.position = "fixed";
        panel.style.left = "10px";
        panel.style.top = "50px";
        panel.style.zIndex = "9999";
        panel.style.background = "rgba(0, 0, 0, 0.8)";
        panel.style.padding = "10px";
        panel.style.borderRadius = "5px";
        panel.style.color = "#fff";
        panel.style.fontSize = "14px";
        panel.style.fontFamily = "Arial";
        panel.style.display = "flex";
        panel.style.flexDirection = "column";

        // 输入框（游戏ID）
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "输入当前登入账号的游戏ID";
        input.style.margin = "5px 0";
        input.style.padding = "5px";
        input.style.border = "none";
        input.style.borderRadius = "3px";
        input.style.width = "180px";
        input.style.color = "#fff";
        input.style.backgroundColor = "#333";
        panel.appendChild(input);

        // 读取 sessionStorage 中的 token
        token = getTokenFromSession();
        if (!token) {
            alert("未能从读取Token，请检查是否已登录！");
        }

        const buttons = [
            { text: "完全免费开源禁止贩卖" },
            { text: "必看！！使用说明", action: showHelp },
            { text: "初始化", action: () => sendRequest(["67e501dfaf286778695d86a3"], input.value) },
            { text: "完成结局1", action: () => sendRequest(["67e501dfaf286778695d86a5", "67e501dfaf286778695d86a4"], input.value) },
            { text: "完成结局2", action: () => sendRequest(["67e501dfaf286778695d86a6", "67e501dfaf286778695d86a4"], input.value) },
            { text: "完成结局3", action: () => sendRequest(["67e501dfaf286778695d86a7", "67e501dfaf286778695d86a4"], input.value) },
            { text: "完成结局4", action: () => sendRequest(["67e501dfaf286778695d86a8"], input.value) },
            { text: "完成结局5", action: () => sendRequest(["67e501dfaf286778695d86a9"], input.value) },
            { text: "完成结局6", action: () => sendRequest(["67e501dfaf286778695d86aa"], input.value) }
        ];

        buttons.forEach(({ text, action }) => {
            const btn = document.createElement("button");
            btn.textContent = text;
            btn.style.margin = "5px 0";
            btn.style.padding = "5px 10px";
            btn.style.cursor = "pointer";
            btn.style.border = "none";
            btn.style.borderRadius = "3px";
            btn.style.background = "#ff9800";
            btn.style.color = "#fff";
            btn.style.fontSize = "14px";
            btn.addEventListener("click", action);
            panel.appendChild(btn);
        });

        document.body.appendChild(panel);
    }

    // 显示使用说明
    function showHelp() {
        alert(`使用说明：
1. 在输入框中输入你的游戏ID(如果进行过换号操作需刷新页面后继续)。
2. 确保你已登录，脚本会自动读取token。
3. 点击“初始化”后间隔2-5分钟依次点击完成任务(包括初始化后也要等几分钟)。
4. 任务结果会弹窗显示，内容包含"true"代表成功。

注意：完成任务必须间隔2-5分钟，否则无法正确完成任务
注意：禁止跳脸官方；脚本开源禁止贩卖
注意：只有1-3结局有奖励
`);
    }

    // 发送任务请求
    function sendRequest(missionIds, gameId) {
        if (!gameId) {
            alert("请先输入当前登入的游戏ID！");
            return;
        }
        if (!token) {
            alert("脚本提示：未获取到 Token，请确保已登录！");
            return;
        }

        const authHeader = `Bearer ${token}`;

        missionIds.forEach(missionId => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://api-foc.krafton.com/ec/mission/completeDataMission/${missionId}`,
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "authorization": authHeader,
                    "content-type": "application/json",
                    "eventkey": "2504-APRIL",
                    "nickname": gameId,
                    "platformtype": "steam",
                    "service-game": "pubg",
                    "service-namespace": "PUBG_OFFICIAL"
                },
                data: JSON.stringify({}),
                onload: function(response) {
                    alert(`任务 ${missionId} 结果: ${response.status} - ${response.responseText}`);
                },
                onerror: function() {
                    alert(`任务 ${missionId} 请求失败！请打开控制台截图后进行反馈`);
                }
            });
        });
    }

    // 启动
    createPanel();
})();
