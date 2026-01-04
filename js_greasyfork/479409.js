// ==UserScript==
// @name         网大知识中心成绩获取
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Fetch and display exam archive list from Zhixueyun in a popup
// @author       xiang
// @match        https://kc.zhixueyun.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479409/%E7%BD%91%E5%A4%A7%E7%9F%A5%E8%AF%86%E4%B8%AD%E5%BF%83%E6%88%90%E7%BB%A9%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/479409/%E7%BD%91%E5%A4%A7%E7%9F%A5%E8%AF%86%E4%B8%AD%E5%BF%83%E6%88%90%E7%BB%A9%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // 添加弹窗的HTML到页面
    const popupHTML = `
        <div id="my-custom-popup" style="
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            background-color: white;
            border: 1px solid #000;
            padding: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 9999;
            max-height: 500px;
            overflow: auto;
            display: none; /* 默认不显示 */
        ">
            <div style="
                text-align: right;
                cursor: pointer;
                font-weight: bold;
                margin-bottom: 5px;
            " onclick="document.getElementById('my-custom-popup').style.display='none'">关闭</div>
            <div id="my-custom-content">数据加载中...</div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // 从localStorage获取token信息
    const tokenString = localStorage.getItem('token');
    if (tokenString) {
        const tokenObject = JSON.parse(tokenString);
        const accessToken = tokenObject.access_token; // 提取access_token

        // 设置请求头
        const headers = {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Authorization": "Bearer__" + accessToken, // 使用从localStorage获取的access_token
            "Connection": "keep-alive",
            "Host": "kc.zhixueyun.com",
            "Referer": "https://kc.zhixueyun.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest",
            "sec-ch-ua": '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "Windows"
        };

        const statusMap = {
            1: "未开始",
            2: "进行中",
            4: "交卷异常",
            5: "待评卷",
            6: "及格",
            7: "不及格",
            8: "已完成",
            9: "良好",
            10: "优秀"
        };

        // 添加函数，用于请求数据
        async function fetchData(page) {
            const url = `https://kc.zhixueyun.com/api/v1/exam/exam/front/archivr-list?startTime=1672502400000&endTime=1804038399999&page=${page}&pageSize=10`;
            const response = await fetch(url, { headers: headers });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        }

        // 检查token并循环请求
        let content = '';
        for (let page = 1; page <= 10; page++) {
            try {
                const data = await fetchData(page);
                if (data && data.items && data.items.length > 0) {
                    data.items.forEach(item => {
                        const name = item.name;
                        const status = item.examRecord ? statusMap[item.examRecord.status] || "未知状态" : 'No status';
                        const score = item.examRecord ? item.examRecord.score / 100 : '无分数';
                        content += `<p>${name}: ${score} ${status}</p>`;
                    });
                } else {
                    break; // 如果items为空，则结束循环
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                content += '<p>获取数据失败。</p>';
                break;
            }
        }

        document.getElementById('my-custom-content').innerHTML = content;
        document.getElementById('my-custom-popup').style.display = 'block';
    } else {
        document.getElementById('my-custom-content').innerHTML = '未找到token。';
        console.error('No token found in localStorage');
    }
})();
