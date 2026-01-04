// ==UserScript==
// @name         ModelScope Usage Display
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display current usage information on ModelScope (today's usage and total usage only)
// @author       You
// @match        https://modelscope.cn/*
// @grant        GM_xmlhttpRequest
// @connect      modelscope.cn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543582/ModelScope%20Usage%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/543582/ModelScope%20Usage%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to fetch usage data
    function fetchUsageData() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://modelscope.cn/api/v1/inference/rate-limit",
                headers: {
                    "Connection": "keep-alive",
                    "Referer": "https://modelscope.cn/organization/qwen",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "bx-v": "2.5.31",
                    "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"macOS"',
                    "x-modelscope-accept-language": "zh_CN"
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // Function to update the UI with usage information
    function updateUsageDisplay(data) {
        // Create or update the usage display element
        let usageElement = document.getElementById('modelscope-usage-display');
        if (!usageElement) {
            usageElement = document.createElement('div');
            usageElement.id = 'modelscope-usage-display';
            usageElement.style.cssText = `
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                width: 120px;
                padding: 12px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                color: white;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                z-index: 10000;
                font-size: 14px;
            `;
            document.body.appendChild(usageElement);
        }

        // Update the content with usage data (only today's usage and total limit)
        const todayUsage = data.Data.currentUsagePerDay;
        const todayLimit = data.Data.requestLimitPerDay;
        const percentage = Math.min(100, Math.round((todayUsage / todayLimit) * 100));

        usageElement.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 8px; text-align: center;">
                📊 使用统计
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span>今日:</span>
                <span style="font-weight: bold;">${todayUsage}/${todayLimit}</span>
            </div>
            <div style="background: rgba(255, 255, 255, 0.2); border-radius: 4px; height: 6px;">
                <div style="background: #4CAF50; height: 100%; border-radius: 4px; width: ${percentage}%; transition: width 0.5s;"></div>
            </div>
            <div style="margin-top: 6px; font-size: 11px; text-align: center; opacity: 0.9;">
                ${percentage}% 已使用
            </div>
        `;
    }

    // Main function to initialize the script
    async function init() {
        try {
            // Initial fetch and display
            const data = await fetchUsageData();
            updateUsageDisplay(data);

            // Update every 10 seconds
            setInterval(async () => {
                try {
                    const newData = await fetchUsageData();
                    updateUsageDisplay(newData);
                } catch (error) {
                    console.error('Failed to fetch usage data:', error);
                }
            }, 10000);
        } catch (error) {
            console.error('Failed to initialize usage display:', error);
        }
    }

    // Run the script when the page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
