// ==UserScript==
// @name         深圳图书馆WiFi自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在连接图书馆WiFi后，自动填写读者证和密码，并点击登录，解放双手。
// @author       abc_ooxx
// @match        http://10.5.12.50:8445/portalpage*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=library
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542344/%E6%B7%B1%E5%9C%B3%E5%9B%BE%E4%B9%A6%E9%A6%86WiFi%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/542344/%E6%B7%B1%E5%9C%B3%E5%9B%BE%E4%B9%A6%E9%A6%86WiFi%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ！！！请在这里修改为您自己的信息！！！ ---
    const MY_USERNAME = '请替换为你的读者证号'; // 例如: '1234567890'
    const MY_PASSWORD = '请替换为你的密码';   // 例如: 'yourpassword'
    // --- ！！！修改完毕，保存即可！！！ ---


    // --- 核心逻辑，一般无需修改 ---

    // 安全检查，提醒用户修改默认信息
    if (MY_USERNAME === '请替换为你的读者证号' || MY_PASSWORD === '请替换为你的密码') {
        // 在页面顶部插入一个明显的提示
        const alertBox = document.createElement('div');
        alertBox.style.padding = '15px';
        alertBox.style.backgroundColor = '#ffc107'; // 黄色背景
        alertBox.style.color = 'black';
        alertBox.style.textAlign = 'center';
        alertBox.style.fontSize = '16px';
        alertBox.style.fontWeight = 'bold';
        alertBox.style.position = 'fixed';
        alertBox.style.top = '0';
        alertBox.style.left = '0';
        alertBox.style.width = '100%';
        alertBox.style.zIndex = '9999';
        alertBox.innerText = '【油猴脚本提示】请先编辑脚本，修改你的读者证号和密码！';
        document.body.prepend(alertBox);
        return; // 停止执行后续代码
    }


    // 延迟执行，确保页面元素完全加载完毕，增加脚本的稳定性
    setTimeout(function() {
        // 1. 定位各个元素
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const agreeCheckImg = document.getElementById('agreeCheck');
        const loginBtn = document.getElementById('loginBtn');

        // 2. 检查所有元素是否存在，确保页面结构未改变
        if (usernameInput && passwordInput && agreeCheckImg && loginBtn) {
            console.log('自动登录脚本：已成功找到所有登录组件。');

            // 3. 填入读者证和密码
            usernameInput.value = MY_USERNAME;
            passwordInput.value = MY_PASSWORD;
            console.log('自动登录脚本：已填入用户名和密码。');

            // 4. 模拟点击勾选框
            // 因为它是一个img并且绑定了onclick事件，直接调用 .click() 是最有效的方式
            agreeCheckImg.click();
            console.log('自动登录脚本：已点击同意协议。');

            // 5. 模拟点击登录按钮
            loginBtn.click();
            console.log('自动登录脚本：已点击登录按钮，正在尝试登录...');

        } else {
            console.error('自动登录脚本：无法找到必要的登录组件，请检查页面元素ID是否已更改。');
        }
    }, 800); // 延迟800毫秒执行，给页面上的其他脚本留出加载时间

})();