// ==UserScript==
// @name         SparkAi 自动签到
// @icon         https://ai.sparkaigf.com/logo.png
// @namespace    https://github.com/NPC2000
// @version      1.0.0
// @description  SparkAi 无感知自动签到
// @author       NPC
// @match        https://ai.sparkaigf.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508839/SparkAi%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/508839/SparkAi%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取并解析 Authorization 令牌
    const secretToken = localStorage.getItem('SECRET_TOKEN');
    let token;

    if (secretToken) {
        try {
            const parsedToken = JSON.parse(secretToken);  // 解析 JSON
            token = parsedToken.data;  // 提取 data 字段中的令牌
        } catch (e) {
            console.error('无法解析 SECRET_TOKEN:', e);
            return;
        }
    } else {
        console.error('未找到 SECRET_TOKEN');
        return;
    }

    // 确保 token 存在
    if (!token) {
        console.error('未找到有效的 Authorization 令牌');
        return;
    }

    // 自动获取 X-Website-Domain 和 Fingerprint
    const xWebsiteDomain = document.querySelector('meta[name="x-website-domain"]')?.getAttribute('content') || 'ai.sparkaigf.com';

    // 生成一个随机的 Fingerprint（长度为10的随机数字）
    const randomFingerprint = Math.floor(Math.random() * 9000000000) + 1000000000;

    const fingerprint = document.querySelector('meta[name="fingerprint"]')?.getAttribute('content') || randomFingerprint.toString() ;

    // 获取用户信息
    const parsedToken = JSON.parse(atob(token.split('.')[1]));  // 解码 JWT 获取用户信息
    const username = parsedToken.username;  // 获取用户名

    // 获取当前日期
    const today = new Date().toISOString().split('T')[0];  // 格式化为 YYYY-MM-DD

    // 从 localStorage 检查此用户是否已经签到
    const lastSignInDate = localStorage.getItem(`lastSignIn_${username}`);

    if (lastSignInDate === today) {
        console.log(`用户 ${username} 今天已经签到，跳过签到`);
        return;  // 如果用户今天已经签到，直接返回
    }

    // 定义签到的 URL 和请求体
    const signInUrl = 'https://ai.sparkaigf.com/api/signin/sign';
    const requestBody = JSON.stringify({});  // 请求体为空的 JSON 对象

    // 发送 POST 请求
    fetch(signInUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,  // 使用从 localStorage 中解析的 Authorization 令牌
            'Content-Type': 'application/json',
            'X-Website-Domain': xWebsiteDomain,  // 自动获取的自定义头部字段
            'Fingerprint': fingerprint,  // 自动获取的自定义头部字段
        },
        body: requestBody
    })
    .then(response => response.json())  // 解析为 JSON
    .then(data => {
        console.log('签到请求已发送');
        console.log(data);  // 打印返回的响应，以便检查是否成功

        // 检查签到是否成功
        if (data.code === 200 || data.message.includes('今日已签到')) {
            console.log(`用户 ${username} 签到成功`);

            // 签到成功后，记录签到日期
            localStorage.setItem(`lastSignIn_${username}`, today);
        } else {
            console.error('签到失败:', data.message);
        }
    })
    .catch((error) => {
        console.error('签到请求失败:', error);
    });

})();
