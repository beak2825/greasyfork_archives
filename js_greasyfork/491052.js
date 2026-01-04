// ==UserScript==
// @name         Add API Key Config Button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  配置宝塔key
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491052/Add%20API%20Key%20Config%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/491052/Add%20API%20Key%20Config%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前页面是否为 IP:端口 格式
    const url = new URL(window.location.href);
    const isIpPort = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$/.test(url.host);

    if (isIpPort) {
        // 创建按钮
        const button = document.createElement('button');
        button.textContent = '配置 API Key';
        button.style.position = 'fixed';
        button.style.zIndex = '9999';
        button.style.top = '10px';
        button.style.right = '10px';

        // 添加点击事件处理程序
        button.addEventListener('click', async () => {
            var apiUrl = `http://${url.host}/config?action=set_token`;
            var requestBody = `t_type=3&limit_addr=${document.domain}`;

            var response = await sendRequest(apiUrl, requestBody);
            var decodedResult = decodeUnicode(response);
            alert(`API 响应结果:\n${JSON.stringify(decodedResult, null, 2)}`);

            apiUrl = `http://${url.host}/config?action=set_token`;
            requestBody = `t_type=2`;

            response = await sendRequest(apiUrl, requestBody);
            decodedResult = decodeUnicode(response);
            alert(`API 响应结果:\n${JSON.stringify(decodedResult, null, 2)}`);

        });

        // 将按钮添加到页面
        document.body.appendChild(button);


        const getKeyButton = document.createElement('button');
        getKeyButton.textContent = '获取 API Key';
        getKeyButton.style.position = 'fixed';
        getKeyButton.style.zIndex = '9999';
        getKeyButton.style.top = '50px';
        getKeyButton.style.right = '10px';

        // 添加点击事件处理程序
        getKeyButton.addEventListener('click', async () => {
            var apiUrl = `http://${url.host}/config?action=get_token`;
            var requestBody = `t_type=3&limit_addr=${document.domain}`;

            var response = await sendRequest(apiUrl, requestBody);
            var decodedResult = decodeUnicode(response);
            prompt('复制到shell执行可免输key',`echo -e "${decodedResult.token}\nhttp://${url.host}" >> /home/bt_config.txt`);

        });

        // 将按钮添加到页面
        document.body.appendChild(getKeyButton);
    }

    // 发送 API 请求并返回响应数据
    async function sendRequest(url, body) {
        var request_token = window.vite_public_request_token;
        const response = await fetch(url, {
            headers: {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "pragma": "no-cache",
                "proxy-connection": "keep-alive",
                "x-http-token": request_token,
                "x-requested-with": "XMLHttpRequest"
            },
            referrer: `http://${url.host}/config`,
            referrerPolicy: "strict-origin-when-cross-origin",
            body,
            method: "POST",
            mode: "cors",
            credentials: "include"
        });
        return await response.json();
    }

    // 解码 Unicode 编码的中文字符
    function decodeUnicode(data) {
        return JSON.parse(JSON.stringify(data).replace(/\\/g, '\\\\').replace(/\u([0-9a-fA-F]{4})/g, '\\u$1'));
    }
})();