// ==UserScript==
// @name         excelhome签到
// @namespace    http://tampermonkey.net/
// @version      0.0.2.27
// @description  在excelhome论坛进行每日签到
// @match        https://club.excelhome.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511941/excelhome%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/511941/excelhome%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

function performSignIn() {
    'use strict';

    // 查找签到链接
    const signLink = document.querySelector('#JD_sign');

    if (signLink) {
        // 提取formhash用于构造URL
        const formhash = new URL(signLink.href).searchParams.get('formhash');
        const signUrl = `plugin.php?id=k_misign:sign&operation=qiandao&formhash=${formhash}&format=empty`;

        // 构造POST请求的数据
        const formData = new FormData();
        formData.append('formhash', formhash);
        formData.append('operation', 'qiandao'); // 根据实际情况添加更多必要的参数

        // 发送异步请求
        fetch(signUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include' // 确保发送cookie
        })
        .then(response => response.text())
        .then(data => {
            console.log('签到成功:', data);
            // 更新最后一次签到成功时间
            const currentDateTime = new Date().toLocaleString('zh-CN', { hour12: false });
            localStorage.setItem('lastSignTime', currentDateTime);
            console.log('更新lastSignTime为:', currentDateTime);

            // 如果签到成功，则刷新页面一次
            window.location.reload();
        })
        .catch(error => {
            console.error('签到失败:', error);
        });
    } else {
        console.log('未找到签到链接，可能已经签到过了或页面结构发生变化。');
    }
}

(function main() {
    // 检查用户是否已登录
    const loginIndicator = document.querySelector('#ls_username');
    if (loginIndicator) {
        console.log('用户未登录，不执行自动签到。');
        return;
    }

    // 获取当前日期和时间
    const currentDateTime = new Date().toLocaleString('zh-CN', { hour12: false });
    console.log('当前日期和时间:', currentDateTime);

    // 检查并打印lastSignTime
    const lastSignTime = localStorage.getItem('lastSignTime');
    console.log('上次签到时间:', lastSignTime);

    // 手动重置lastSignTime（仅用于测试）
    if (window.location.search.includes('reset')) {
        localStorage.removeItem('lastSignTime');
        console.log('已重置lastSignTime');
        return;
    }

    // 检查今天是否已经签到过
    if (lastSignTime) {
        const lastSignDate = new Date(lastSignTime).toLocaleDateString('zh-CN');
        const currentDate = new Date(currentDateTime).toLocaleDateString('zh-CN');
        if (lastSignDate === currentDate) {
            console.log('今天已经签到过，不再重复跳转。');
            return; // 直接退出脚本
        }
    }

    // 仅在非签到页面上执行跳转
    if (!window.location.pathname.includes('/plugin.php') || !window.location.search.includes('id=k_misign:sign')) {
        // 跳转到签到页面
        window.location.href = 'https://club.excelhome.net/plugin.php?id=k_misign:sign';
        return;
    }

    // 仅在签到页面上执行签到逻辑
    if (window.location.pathname.includes('/plugin.php') && window.location.search.includes('id=k_misign:sign')) {
        const signInComplete = document.querySelector('.font');
        if (signInComplete && signInComplete.textContent.includes('您的签到排名')) {
            console.log('签到已完成');
            // 更新最后一次签到成功时间
            localStorage.setItem('lastSignTime', currentDateTime);
            console.log('更新lastSignTime为:', currentDateTime);
        } else if (signInComplete && signInComplete.textContent.includes('您今天还没有签到')) {
            console.log('签到未完成，准备执行签到逻辑...');
            performSignIn();
        } else {
            console.log('签到状态未知，可能页面结构发生变化。');
        }
    } else {
        console.log('不是签到页面，不执行签到逻辑。');
    }
})();