// ==UserScript==
// @name         ChatGPT AccessToken 自动更新
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  根据token过期时间自动获取accessToken并发送POST请求后自动跳转到chatgpt.aicnm.cc
// @author       AMT
// @match        *://chatgpt.aicnm.cc/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      chatgpt.com
// @connect      chatgpt.aicnm.cc
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503433/ChatGPT%20AccessToken%20%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/503433/ChatGPT%20AccessToken%20%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // 定义ChatGPT登录页面的URL
    const chatgptLoginUrl = "https://chatgpt.com";
    // 定义获取accessToken的URL
    const tokenUrl = "https://chatgpt.com/api/auth/session";
    // 定义跳转的目标URL
    const redirectUrl = "https://chatgpt.aicnm.cc";
    // 定义GM存储的key
    const expiresKey = 'tokenExpires'; // 保存token过期时间的key
    // 获取当前时间的时间戳（毫秒）
    let currentTime = new Date().getTime();
    // 将延迟时间存储到GM存储中
    let delay = GM_getValue('delay', 60000);
    // 从GM存储获取token过期时间
    let expires = GM_getValue(expiresKey, 0);

    // 计算距离token过期的时间
    function calculateTimeUntilExpiry() {
        currentTime = new Date().getTime();
        const timeUntilExpiry = expires - currentTime;

        // 计算剩余时间的各个部分
        const daysUntilExpiry = Math.floor(timeUntilExpiry / (24 * 60 * 60 * 1000));
        const hoursUntilExpiry = Math.floor((timeUntilExpiry % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutesUntilExpiry = Math.floor((timeUntilExpiry % (60 * 60 * 1000)) / (60 * 1000));
        const secondsUntilExpiry = Math.floor((timeUntilExpiry % (60 * 1000)) / 1000);

        // 返回各个部分的时间和秒数
        return { daysUntilExpiry, hoursUntilExpiry, minutesUntilExpiry, secondsUntilExpiry };
    }
    // Base64URL 解码
    function base64UrlDecode(str) {
        return decodeURIComponent(atob(str.replace(/-/g, '+').replace(/_/g, '/')).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    // 解析 JWT
    function parseJWT(token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('Invalid JWT token');
            return null;
        }

        const payload = JSON.parse(base64UrlDecode(parts[1])); // 仅解析payload部分
        return payload;
    }
    //刷新时间
    // 创建可视化窗口
    const panel = document.createElement('div');
    panel.id = 'script-panel';
    const { daysUntilExpiry, hoursUntilExpiry, minutesUntilExpiry } = calculateTimeUntilExpiry();
    panel.innerHTML = `
    <div id="panel-content">
        <p>距离AccessToken过期还有：<br>
        <span id="time-until-expiry"></span></p>
        <button id="run-script-button">立即获取AccessToken</button>
        <br>
        <button id="jump-to-chatgpt-button">跳转到ChatGPT</button>
    </div>
    `;
    document.body.appendChild(panel);
    updateDisplay()
    // 添加样式
    GM_addStyle(`
        #script-panel {
            position: fixed;
            top: 10%;
            right: 0;
            width: 300px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 15px;
            border-radius: 10px 0 0 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            transform: translateX(98%);
            transition: transform 0.5s ease-in-out;
            cursor: move;
        }
        #panel-content {
            display: block;
            text-align: center;
        }
        #script-panel:hover {
            transform: translateX(0);
        }
        #run-script-button,#jump-to-chatgpt-button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 10px 0;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s, box-shadow 0.1s;
        }
        #run-script-button:hover,#jump-to-chatgpt-button:hover {
            background-color: #45a049;
        }
        #run-script-button:active,#jump-to-chatgpt-button:active {
            box-shadow: inset 0px 3px 5px rgba(0, 0, 0, 0.2);
            background-color: #39843b;
        }
    `);

    // 添加拖动功能
    let isDragging = false;
    let startY = 0;
    let startTop = 0;

    panel.addEventListener('mousedown', function(e) {
        isDragging = true;
        startY = e.clientY;
        startTop = panel.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            const deltaY = e.clientY - startY;
            panel.style.top = `${startTop + deltaY}px`;
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    function updateDisplay() {
        const { daysUntilExpiry, hoursUntilExpiry, minutesUntilExpiry, secondsUntilExpiry } = calculateTimeUntilExpiry();

        let displayText = "";
        if (daysUntilExpiry > 0) {
            displayText += `${daysUntilExpiry}天`;
        }
        if (hoursUntilExpiry > 0 ) {
            displayText += `${hoursUntilExpiry}小时`;
        }
        if (minutesUntilExpiry > 0 ) {
            displayText += `${minutesUntilExpiry}分钟`;
        }
        if (daysUntilExpiry === 0 && hoursUntilExpiry === 0 && minutesUntilExpiry === 0) {
            displayText = `${secondsUntilExpiry}秒`;
            if (delay !=1000) {
                delay = 1000; // 设置为每秒刷新一次
                GM_setValue('delay', delay);
            }
        }

        document.getElementById('time-until-expiry').textContent = displayText;
    }
    // 添加时间自动更新功能
    setInterval(() => {
        updateDisplay();
        if (shouldFetchToken()) {
            showAlert();
        }
    }, delay);

    // 添加按钮点击事件
    document.getElementById('run-script-button').addEventListener('click', function() {
        fetchAndPostToken();
    });
    document.getElementById('jump-to-chatgpt-button').addEventListener('click', function() {
        window.open(chatgptLoginUrl, '_blank'); // 在新标签页中打开 chatgpt.com
    });
    //showAlert();
    // 检查是否需要重新登录
    if (shouldFetchToken()) {
        showAlert();
    } else {
        console.log("Script not run: Token is still valid.");
    }
    // 判断是否需要获取token
    function shouldFetchToken() {
        currentTime = new Date().getTime();
        return currentTime > expires;
    }
    // 弹出过期提示并在1秒后自动跳转
    function showAlert() {
        // 创建一个div作为自定义弹窗
        let alertBox = document.createElement("div");
        alertBox.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            background-color: white;
            color: black;
            border: 2px solid #007BFF; /* 蓝色边框 */
            padding: 20px;
            z-index: 10000;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            font-family: Arial, sans-serif;
            font-size: 14px;
            text-align: center;
            animation: fadeIn 0.3s ease;
        ">
            <p>Access Token已过期，系统将自动获取Token</p>
        </div>`;
        // 添加淡入效果的动画
        const style = document.createElement("style");
        style.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        // 将自定义弹窗添加到页面中
        document.body.appendChild(alertBox);

        // 1.2秒后自动跳转并移除自定义弹窗
        setTimeout(function() {
            document.body.removeChild(alertBox); // 移除弹窗
            fetchAndPostToken() //重新登录
        }, 1200); // 延迟1.2秒后跳转
    }
    // 获取token并发送GET请求的函数
    function fetchAndPostToken() {
        GM_xmlhttpRequest({
            method: "GET",
            url: tokenUrl,
            onload: function(response) {
                if (response.status === 200) {
                    const responseData = JSON.parse(response.responseText);
                    const accessToken = responseData.accessToken;
                    const parsedToken = parseJWT(accessToken);
                    if (parsedToken && parsedToken.exp) {
                        const tokenExpires = parsedToken.exp * 1000;
                        GM_setValue(expiresKey, tokenExpires);
                        window.location.href = `${redirectUrl}/?token=${encodeURIComponent(accessToken)}`;
                    } else {
                        console.error("Failed to parse JWT token or exp not found.");
                    }
                } else {
                    console.error("Failed to fetch accessToken. Status:", response.status);
                }
            }
        });
    }
    // 使用 MutationObserver 监控 DOM 变化，确保自定义 UI 面板不会因网页动态更新而丢失
    const observer = new MutationObserver((mutations) => {
        if (!document.contains(panel)) {
            document.body.appendChild(panel);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();