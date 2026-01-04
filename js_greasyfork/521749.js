// ==UserScript==
// @name         Tower-EnergyAutoRefreshToken
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  每隔15分钟自动刷新并保存 Token
// @author       You
// @match        https://energy-iot.chinatowercom.cn/*
// @icon         http://hd.chinatowercom.cn:8082/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521749/Tower-EnergyAutoRefreshToken.user.js
// @updateURL https://update.greasyfork.org/scripts/521749/Tower-EnergyAutoRefreshToken.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建toast提示的函数
    function showToast(message) {
        // 创建一个新的div元素
        var toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;

        // 添加样式
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .toast {
                visibility: hidden;
                min-width: 250px;
                margin-left: -125px;
                background-color: #333;
                color: #fff;
                text-align: center;
                border-radius: 2px;
                box-shadow: 1px 1px 10px 1px;
                padding: 16px;
                position: fixed;
                z-index: 1;
                left: 50%;
                bottom: 30px;
                font-size: 17px;
                cursor: pointer;
            }
            .toast.show {
                visibility: visible;
                -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
                animation: fadein 0.5s, fadeout 0.5s 2.5s;
            }
            @-webkit-keyframes fadein {
                from {bottom: 0; opacity: 0;}
                to {bottom: 30px; opacity: 1;}
            }
            @keyframes fadein {
                from {bottom: 0; opacity: 0;}
                to {bottom: 30px; opacity: 1;}
            }
            @-webkit-keyframes fadeout {
                from {bottom: 30px; opacity: 1;}
                to {bottom: 0; opacity: 0;}
            }
            @keyframes fadeout {
                from {bottom: 30px; opacity: 1;}
                to {bottom: 0; opacity: 0;}
            }
        `;
        document.head.appendChild(style);

        // 添加到页面并显示
        document.body.appendChild(toast);
        toast.classList.add('show');

        // 3秒后自动移除
        setTimeout(function(){
            toast.remove();
        }, 3000);
    }


    // 定义一个函数来发送请求并更新存储
    function refreshAndSaveData() {
        // debugger
        // 从localStorage和sessionStorage中检测refreshToken和Admin-Token
        const refreshToken = localStorage.getItem('refreshToken');
        const adminToken = sessionStorage.getItem('Admin-Token');
        if (!refreshToken || !adminToken) {
            console.error('refreshToken or Admin-Token not found in storage.');
            return;
        }

        // 发送网络请求
        fetch('https://energy-iot.chinatowercom.cn/api/auth/refreshToken', { // 请求的端点
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            },
            body: JSON.stringify({
                "appId": "OI2VBVb/jWjRBDjXMcp+xjkyxF3QCHnjtS31dmoaMMeaAtCQa3UzkDJofGVPgu5lf731HKyViVuLs6tUTgAFpnl6z43licIevKgBLiXydSP58n1iGvCUa1cUaafAoqp644F2/SlVN/jD+QxllNcEZzIONYU9um5AM6Xnd6m6NqA=",
                "refreshToken": refreshToken
            })
        })
        .then(response => response.json())
        .then(data => {
            // debugger
            // 判断res.code是否为200
            if (data.code === 200) {
                // 从解析到的json中拿到access_token和refresh_token
                const accessToken = data.data.access_token;
                const newRefreshToken = data.data.refresh_token;

                // 存储新的refreshToken和Admin-Token
                localStorage.setItem('refreshToken', newRefreshToken);
                sessionStorage.setItem('Admin-Token', accessToken);

                console.log('Tokens refreshed and saved to storage.');

                // 显示toast提示
                showToast('Token刷新成功！');
            } else {
                console.error('Failed to refresh tokens, response code:', data.code);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    // 设置定时器，每隔15分钟执行一次
    setInterval(refreshAndSaveData, 900000);

    // 立即执行一次，以确保在脚本加载时也进行一次请求
    refreshAndSaveData();
})();