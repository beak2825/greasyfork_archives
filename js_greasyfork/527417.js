// ==UserScript==
// @name         多邻双倍经验
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动获取Duolingo boost
// @author       Crazyuncle
// @match        https://www.duolingo.com/*
// @match        https://www.duolingo.cn/*
// @grant        GM_xmlhttpRequest
// @connect      duolingo.com
// @downloadURL https://update.greasyfork.org/scripts/527417/%E5%A4%9A%E9%82%BB%E5%8F%8C%E5%80%8D%E7%BB%8F%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/527417/%E5%A4%9A%E9%82%BB%E5%8F%8C%E5%80%8D%E7%BB%8F%E9%AA%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .boost-container {
            position: fixed;
            top: 10px;
            right: 10px;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            width: 300px;
        }
        .boost-container select {
            width: 100%;
            padding: 8px;
            margin: 10px 0;
            border: 2px solid #e5e5e5;
            border-radius: 8px;
        }
        .boost-container button {
            width: 100%;
            padding: 10px;
            background-color: #58cc02;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }
        .boost-container button:hover {
            background-color: #46a302;
        }
        .boost-result {
            margin-top: 10px;
            padding: 10px;
            border-radius: 8px;
            background: #f5f5f5;
        }
    `;
    document.head.appendChild(style);

    // 创建UI界面
    const container = document.createElement('div');
    container.className = 'boost-container';
    container.innerHTML = `
        <select id="boostType">
            <option value="xp_boost_15">15分钟 Boost</option>
            <option value="general_xp_boost">30分钟 Boost</option>
            <option value="xp_boost_60">60分钟 Boost</option>
        </select>
        <button id="getBoost">获取Boost</button>
        <div id="boostResult" class="boost-result" style="display:none;"></div>
    `;
    document.body.appendChild(container);

    // 获取用户ID和JWT token
    function getUserInfo() {
        const cookies = document.cookie;
        let jwt = '';
        let userId = '';

        // 提取JWT token
        const jwtMatch = cookies.match(/jwt_token=(.*?)(?:;|$)/);
        if (jwtMatch) {
            jwt = jwtMatch[1];
        }

        // 尝试从JWT解码获取用户ID
        if (jwt) {
            try {
                const jwtPayload = JSON.parse(atob(jwt.split('.')[1]));
                userId = jwtPayload.sub;
            } catch (e) {
                console.error('解析JWT失败:', e);
            }
        }

        // 如果从JWT获取失败，尝试从其他可能的来源获取
        if (!userId) {
            // 尝试从全局变量获取
            if (window.duo && window.duo.user) {
                userId = window.duo.user.id;
            }
            // 尝试从页面元素获取
            const userDataElement = document.querySelector('[data-user-id]');
            if (userDataElement) {
                userId = userDataElement.getAttribute('data-user-id');
            }
        }

        console.log('获取到的用户信息:', { jwt, userId }); // 调试信息

        return { jwt, userId };
    }

    // 处理获取boost的请求
    document.getElementById('getBoost').addEventListener('click', async () => {
        const { jwt, userId } = getUserInfo();
        const boostType = document.getElementById('boostType').value;
        const resultDiv = document.getElementById('boostResult');

        if (!jwt || !userId) {
            resultDiv.textContent = '无法获取必要信息，请确保已登录';
            resultDiv.style.display = 'block';
            return;
        }

        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://www.duolingo.com/2017-06-30/users/${userId}/shop-items`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Origin': 'https://www.duolingo.cn',
                'Referer': 'https://www.duolingo.cn/'
            },
            data: JSON.stringify({
                itemName: boostType,
                isFree: true
            }),
            onload: function(response) {
                console.log('完整响应:', response); // 保留调试日志

                let resultMessage = '';
                if (response.status === 200) {
                    resultMessage = 'Boost获取成功！\n\n';
                } else {
                    resultMessage = '获取失败！\n\n';
                }

                resultMessage += '响应内容:\n';
                try {
                    // 尝试格式化 JSON 响应
                    const jsonResponse = JSON.parse(response.responseText);
                    resultMessage += JSON.stringify(jsonResponse, null, 2);
                } catch (e) {
                    // 如果不是 JSON，直接显示文本
                    resultMessage += response.responseText;
                }

                resultDiv.style.whiteSpace = 'pre-wrap';
                resultDiv.style.fontFamily = 'monospace';
                resultDiv.textContent = resultMessage;
                resultDiv.style.display = 'block';
            },
            onerror: function(error) {
                console.error('请求错误:', error); // 在控制台显示错误详情
                resultDiv.textContent = `请求错误: ${JSON.stringify(error, null, 2)}`;
                resultDiv.style.display = 'block';
            }
        });
    });
})();
