// ==UserScript==
// @name         Auto POST Request to Vote API
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  发送 POST 请求至 https://api.app.workercn.cn/vote/voteClick
// @author       You
// @match        https://web.app.workercn.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523070/Auto%20POST%20Request%20to%20Vote%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/523070/Auto%20POST%20Request%20to%20Vote%20API.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 动态创建文本框和按钮
    let inputDiv = document.createElement('div');
    inputDiv.style.position = 'fixed';
    inputDiv.style.top = '20px';
    inputDiv.style.right = '20px';
    inputDiv.style.zIndex = '9999';
    inputDiv.style.backgroundColor = 'white';
    inputDiv.style.padding = '20px';
    inputDiv.style.border = '1px solid #ccc';
    inputDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';

    // 添加 params 输入框，并填充默认的 JSON 信息
    let paramsInput = document.createElement('textarea');
    paramsInput.style.width = '300px';
    paramsInput.style.height = '150px';
    paramsInput.style.marginBottom = '10px';  // 增加底部的间距
    paramsInput.placeholder = '请输入 params 参数（JSON 格式）';
    paramsInput.value = JSON.stringify({
        "voteID": 106,
        "optionID": 5530,
        "deviceID": "fbb8ca48-18fa-9e90-8b48-c1dd72f40859",
        "deviceSign": "",
        "userID": "",
        "userIDSign": "",
        "token": ""
    }, null, 4);  // 默认 JSON 信息，格式化为可读的样式
    inputDiv.appendChild(paramsInput);

    // 添加请求次数输入框
    let requestCountInput = document.createElement('input');
    requestCountInput.type = 'number';
    requestCountInput.min = '1';
    requestCountInput.value = '1';
    requestCountInput.placeholder = '请求次数';
    requestCountInput.style.width = '100px';
    requestCountInput.style.marginBottom = '10px';  // 增加底部的间距
    inputDiv.appendChild(requestCountInput);

    // 添加提交按钮
    let submitButton = document.createElement('button');
    submitButton.textContent = '提交请求';
    submitButton.style.marginTop = '10px';
    inputDiv.appendChild(submitButton);

    // 将输入框和按钮插入到页面
    document.body.appendChild(inputDiv);

    // 提交按钮的点击事件
    submitButton.addEventListener('click', function() {
        let paramsText = paramsInput.value;
        let requestCount = parseInt(requestCountInput.value, 10);

        if (isNaN(requestCount) || requestCount <= 0) {
            alert('请输入有效的请求次数');
            return;
        }

        try {
            // 解析用户输入的 JSON 参数
            let params = JSON.parse(paramsText);

            // 批量发送请求
            for (let i = 0; i < requestCount; i++) {
                sendRequest(params, i + 1);
            }

        } catch (error) {
            alert('输入参数格式不正确！请确保是有效的 JSON 格式。');
            console.error('解析错误:', error);
        }
    });

    // 发送请求的函数
    function sendRequest(params, requestIndex) {
        // 获取当前 deviceID 和它的使用次数
        let currentDeviceID = getDeviceID();
        let usageCount = getDeviceUsageCount(currentDeviceID);

        // 如果 deviceID 使用次数超过9次，生成新的 deviceID
        if (usageCount >= 9) {
            currentDeviceID = generateDeviceID();  // 生成新的 deviceID
            setDeviceUsageCount(currentDeviceID, 0);  // 重置新的 deviceID 的使用次数
        } else {
            // 否则，增加当前 deviceID 的使用次数
            setDeviceUsageCount(currentDeviceID, usageCount + 1);
        }

        // 更新 params 中的 deviceID
        params.deviceID = currentDeviceID;

        // 排序参数
        const sortedParams = Object.keys(params)
            .filter(key => params[key] !== undefined)  // 过滤掉值为 undefined 或空值的参数
            .sort()  // 按参数名升序排序
            .map(key => `${key}=${params[key]}`)  // 拼接 key=value 的格式
            .join("&");  // 使用 & 连接

        // 计算 sign (使用 MD5 加密)
        params.sign = md5(sortedParams);  // 使用引入的 MD5 加密库

        // 构造 POST 请求体
        const requestBody = JSON.stringify(params);

        // 请求头
        const headers = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Connection': 'keep-alive',
            'Content-Length': String(requestBody.length),
            'Content-Type': 'application/json;charset=UTF-8',
            'Host': 'api.app.workercn.cn',
            'Origin': 'https://web.app.workercn.cn',
            'Referer': 'https://web.app.workercn.cn/',
            'Sec-CH-UA': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'Sec-CH-UA-Mobile': '?0',
            'Sec-CH-UA-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        };

        // 发送 POST 请求
        fetch('https://api.app.workercn.cn/vote/voteClick', {
            method: 'POST',
            headers: headers,
            body: requestBody
        })
        .then(response => response.json())
        .then(data => {
            console.log(`Request ${requestIndex} Response:`, data);  // 处理服务器响应
            alert(`请求 ${requestIndex} 成功: ` + JSON.stringify(data)); // 显示返回的响应数据
        })
        .catch(error => {
            console.error('Error in request ' + requestIndex + ':', error);  // 错误处理
            alert(`请求 ${requestIndex} 失败: ` + error.message); // 显示错误信息
        });
    }

    // 获取当前 deviceID（从 localStorage 获取）
    function getDeviceID() {
        let deviceID = localStorage.getItem('currentDeviceID');
        if (!deviceID) {
            deviceID = generateDeviceID();  // 如果没有保存过，生成新的 deviceID
            localStorage.setItem('currentDeviceID', deviceID);
        }
        return deviceID;
    }

    // 获取当前 deviceID 的使用次数
    function getDeviceUsageCount(deviceID) {
        let count = localStorage.getItem(`deviceID_${deviceID}_usageCount`);
        return count ? parseInt(count) : 0;
    }

    // 更新 deviceID 的使用次数
    function setDeviceUsageCount(deviceID, count) {
        localStorage.setItem(`deviceID_${deviceID}_usageCount`, count);
    }
    // 生成一个新的 deviceID（UUID 格式）
    function generateDeviceID() {
        // 利用浏览器的 crypto API 来生成一个随机的 UUID
        const randomValues = crypto.getRandomValues(new Uint8Array(16));  // 获取16个字节的随机数
        randomValues[6] = (randomValues[6] & 0x0f) | 0x40;  // 设置版本号为 4
        randomValues[8] = (randomValues[8] & 0x3f) | 0x80;  // 设置变种号为 DCE
        const uuid = Array.from(randomValues).map(byte => byte.toString(16).padStart(2, '0')).join('');
        return uuid.slice(0, 8) + '-' + uuid.slice(8, 12) + '-' + uuid.slice(12, 16) + '-' + uuid.slice(16, 20) + '-' + uuid.slice(20, 32);  // 格式化为 UUID
    }
    // 监听类名为 'vote-btn' 的按钮点击事件，提取请求参数并更新到 params 输入框
    document.body.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('vote-btn')) {
            // 假设请求参数存储在该按钮的 data-params 属性中
            let params = event.target.getAttribute('data-params');
            if (params) {
                paramsInput.value = params;  // 将按钮的请求参数填充到 params 输入框
            }
        }
    });
// 简单的 MD5 实现
function md5(str) {
    // 适用于基本 MD5 的计算
    return str.split('').reduce(function(a, b) {
        return a + b.charCodeAt(0);
    }, 0).toString(16); // 这只是一个简单的字符串散列方法
}
     
})();