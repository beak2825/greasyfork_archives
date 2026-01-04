// ==UserScript==
// @name         国家队挑战赛统计
// @namespace    mzblueAT
// @version      1.0
// @description  Extract MID numbers and corresponding date from HTML using Tampermonkey and auto-refresh every 30 minutes
// @author       bluemz
// @match        https://www.managerzone.com/?p=national_team_challenges&type=senior
// @grant        GM_xmlhttpRequest
// @connect      www.bluemz.cn
// @connect      127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/476967/%E5%9B%BD%E5%AE%B6%E9%98%9F%E6%8C%91%E6%88%98%E8%B5%9B%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/476967/%E5%9B%BD%E5%AE%B6%E9%98%9F%E6%8C%91%E6%88%98%E8%B5%9B%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有包含mid的行
    const rows = document.querySelectorAll('tbody tr');

    // 遍历行并逐条发送mid和日期
    function sendAndRefresh() {
        rows.forEach(row => {
            const timeCell = row.querySelector('td:first-child');
            if (timeCell) {
                const time = timeCell.textContent.trim().split(' ')[0]; // 提取日期部分
                const link = row.querySelector('a[href*="mid="]');
                if (link) {
                    const match = link.href.match(/mid=(\d+)/);
                    if (match) {
                        const mid = match[1];
                        const postData = {
                            mid: [mid],
                            area: "nation",
                            level: 0,
                            levelname: "challenge",
                            round: 1,
                            roundtime: time,
                            season: 88,
                            type: "senior"
                        };

                        // 创建要发送的JSON数据对象
                        const serverUrl = 'http://www.bluemz.cn:3001/api/matchlist/create/nation'; // 替换为你的服务端URL

                        // 使用GM_xmlhttpRequest发送POST请求
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: serverUrl,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify(postData),
                            onload: function(response) {
                                if (response.status === 200) {
                                    // 在成功时执行的操作，可以根据需要处理服务端的响应
                                    console.log('Data sent successfully:', response.responseText);
                                } else {
                                    console.error('Error sending data. Server returned status:', response.status);
                                }
                            },
                            onerror: function(error) {
                                // 在出现错误时执行的操作
                                console.error('Error sending data:', error);
                            }
                        });
                    }
                }
            }
        });

        // 刷新页面
        setTimeout(function() {
            location.reload();
        }, 30 * 60 * 1000); // 30分钟刷新一次
    }

    // 初始执行和定时执行
    sendAndRefresh();
})();
