// ==UserScript==
// @name         B站动态批量删除工具
// @version      1.14514
// @description  用于清除B站动态的脚本，可区分转发动态、文字动态、图片动态、视频动态，并且可以输出删除日志及删除的动态内容
// @author       秦心桜
// @match        https://space.bilibili.com/*/dynamic
// @match        http://space.bilibili.com/*/dynamic
// @require      https://cdn.jsdelivr.net/npm/axios@1.7.3/dist/axios.min.js
// @icon         https://raw.githubusercontent.com/the1812/Bilibili-Evolved/preview/images/logo-small.png
// @copyright    2024, HatanoKokosa (https://github.com/hatanokokosa)
// @license      GPL-3.0
// @grant        none
// @namespace https://greasyfork.org/users/1033850
// @downloadURL https://update.greasyfork.org/scripts/521110/B%E7%AB%99%E5%8A%A8%E6%80%81%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/521110/B%E7%AB%99%E5%8A%A8%E6%80%81%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
//直接使用了Bilibili-Evolved的图标（因为好看）

(function () {
    'use strict';

    const uid = window.location.pathname.split("/")[1];
    const logs = [];
    let deleteCount = 0;
    let totalCount = 0;

    function getUserCSRF() {
        return document.cookie.split("; ").find(row => row.startsWith("bili_jct="))?.split("=")[1];
    }
    const csrfToken = getUserCSRF();

    class Api {
        async spaceHistory(offset = 0) {
            return this._api(
                `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?visitor_uid=${uid}&host_uid=${uid}&offset_dynamic_id=${offset}`,
                {}, "get"
            );
        }

        async removeDynamic(id) {
            return this._api(
                "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/rm_dynamic",
                { dynamic_id: id, csrf_token: csrfToken }
            );
        }

        async _api(url, data, method = "post") {
            return axios({
                url,
                method,
                data: this.transformRequest(data),
                withCredentials: true,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(res => res.data);
        }

        transformRequest(data) {
            return Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
        }

        async sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    const api = new Api();

    async function clearDynamicsByType(type, keyword = null) {
    let offset = 0;
    let hasMore = true;
    deleteCount = 0;
    totalCount = 0;
    updateProgress(0, 1);

    const delay = parseInt(document.getElementById("delayInput").value, 10) || 50;

    while (hasMore) {
        const { data } = await api.spaceHistory(offset);
        hasMore = data.has_more;

        const cards = data.cards || [];
        totalCount += cards.length;

        for (const card of cards) {
            offset = card.desc.dynamic_id_str;

            // 提取动态内容
            let content = "未知内容";
            try {
                const parsedCard = JSON.parse(card.card);

                // 如果是转发动态，尝试提取转发的原始内容
                if (parsedCard.origin) {
                    // 转发的原始动态
                    const origin = JSON.parse(parsedCard.origin);
                    content = origin.item?.description || origin.title || "内容提取失败";
                } else {
                    // 非转发动态
                    content = parsedCard.item?.description || parsedCard.title || "内容提取失败";
                }
            } catch (e) {
                console.error("解析动态内容出错", e);
            }

            // 判断动态类型，删除符合条件的动态
            if (card.desc.type === type && (!keyword || new RegExp(keyword).test(card.card))) {
                try {
                    const result = await api.removeDynamic(card.desc.dynamic_id_str);
                    if (result.code === 0) {
                        deleteCount++;
                        // 记录动态内容
                        logDeletion(card.desc.dynamic_id_str, "成功", type, content);
                    } else {
                        logDeletion(card.desc.dynamic_id_str, "失败", type, content);
                    }
                    updateProgress(deleteCount, totalCount);
                    await api.sleep(delay);
                } catch (error) {
                    logDeletion(card.desc.dynamic_id_str, "出错", type, content);
                    console.error("删除动态时出错", error);
                }
            }
        }
    }
    alert(`清理完成，共删除 ${deleteCount} 条类型为 ${type} 的动态！`);
}


    function logDeletion(dynamicId, status, type, content) {
    const log = {
        // 保存动态内容
        dynamicId,
        status,
        type,
        content,
        // 在控制台输出日志记录
        time: new Date().toLocaleString()
        };
        logs.push(log);
        console.table(log);
    }



    function exportLogs() {
    if (logs.length === 0) {
        alert("没有可导出的日志记录！");
        return;
    }
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `deletion_logs_${Date.now()}.json`;
    link.click();
    alert("日志导出成功！");
    }

    function updateProgress(current, total) {
        const progressBar = document.getElementById("progressBar");
        const deleteCountElem = document.getElementById("deleteCount");
        const totalCountElem = document.getElementById("totalCount");

        deleteCountElem.textContent = current;
        totalCountElem.textContent = total;
        progressBar.style.width = `${(current / total) * 100}%`;
    }

    function createControlPanel() {
    const panel = document.createElement("div");
    panel.style = `
        position: fixed; bottom: 30px; right: 30px;
        width: 280px; background: linear-gradient(135deg, #1e272e, #485460);
        color: #333; padding: 20px; border-radius: 12px;
        font-family: Arial, sans-serif; box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        z-index: 99999;
    `;

    panel.innerHTML = `
        <div style="font-size: 18px; font-weight: bold; text-align: center; color: #eeeeee; margin-bottom: 15px;">
            动态批量删除工具
        </div>

        <button class="custom-button" id="clearAllButton">删除转发动态</button>
        <button class="custom-button" id="clearTextButton">删除文字动态</button>
        <button class="custom-button" id="clearImageButton">删除图片动态</button>
        <button class="custom-button" id="clearVideoButton">删除视频动态</button>
        <button class="custom-button" id="exportLogsButton">导出清除日志及内容</button>

        <div style="margin-top: 15px; color: white; font-size: 14px;">
            删除间隔（毫秒）：<input id="delayInput" type="number" value="50" min="0"
            style="width: 80px; color: black; padding: 5px; border: 1px solid #ccc; border-radius: 5px; text-align: center;">
        </div>

        <div style="margin-top: 10px; color: white; font-size: 14px;">
            已删除：<span id="deleteCount" style="color: #ff6b6b;">0</span> /
            <span id="totalCount" style="color: #1e90ff;">0</span>
        </div>

        <div style="margin-top: 8px; height: 10px; background: #ddd; border-radius: 5px; overflow: hidden;">
            <div id="progressBar" style="height: 100%; width: 0%; background: #76c7c0;"></div>
        </div>
    `;

    document.body.appendChild(panel);

    const style = document.createElement("style");
    style.innerHTML = `
        .custom-button {
            width: 100%; margin-bottom: 10px; padding: 10px 0;
            background: rgba(255, 255, 255, 0.3);
            color: #f0f0f0; font-size: 15px;
            border: none; border-radius: 6px; cursor: pointer;
            transition: all 0.3s ease-in-out; font-weight: bold;
        }

        .custom-button:hover {
            background: rgba(255, 255, 255, 0.5);
            color: #eeeeee;
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }
    `;
    document.head.appendChild(style);

    // 事件监听
    document.getElementById("clearAllButton").addEventListener("click", () => clearDynamicsByType(1));
    document.getElementById("clearTextButton").addEventListener("click", () => clearDynamicsByType(4));
    document.getElementById("clearImageButton").addEventListener("click", () => clearDynamicsByType(2));
    document.getElementById("clearVideoButton").addEventListener("click", () => clearDynamicsByType(8));
    document.getElementById("exportLogsButton").addEventListener("click", exportLogs);
    }

    createControlPanel();
})();
