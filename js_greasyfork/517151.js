// ==UserScript==
// @name         重庆大学校园网自动登录
// @version      1.0
// @description  自动登录CQU的校园网
// @author       叶老师
// @match        http://login.cqu.edu.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      cqu.edu.cn
// @license      MIT
// @namespace https://greasyfork.org/users/1395348
// @downloadURL https://update.greasyfork.org/scripts/517151/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/517151/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建设置按钮
    function createSettingButton() {
        const button = document.createElement('button');
        button.innerHTML = '设置账号密码';
        button.style.position = 'absolute';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '1000';

        // 在按钮点击时显示弹窗
        button.onclick = () => {
            showInputPopup();
        };

        document.body.appendChild(button);
    }

    // 显示输入弹窗
    function showInputPopup() {
        // 创建弹窗背景
        const popupBackground = document.createElement('div');
        popupBackground.style.position = 'fixed';
        popupBackground.style.top = '0';
        popupBackground.style.left = '0';
        popupBackground.style.width = '100%';
        popupBackground.style.height = '100%';
        popupBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        popupBackground.style.zIndex = '1001';
        popupBackground.onclick = () => document.body.removeChild(popupBackground);

        // 创建弹窗容器
        const popupContainer = document.createElement('div');
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '50%';
        popupContainer.style.left = '50%';
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupContainer.style.backgroundColor = 'white';
        popupContainer.style.padding = '20px';
        popupContainer.style.borderRadius = '10px';
        popupContainer.style.zIndex = '1002';
        popupContainer.onclick = (e) => e.stopPropagation();

        const userAccountLabel = document.createElement('label');
        userAccountLabel.innerHTML = '账号：';
        const userAccountInput = document.createElement('input');
        userAccountInput.type = 'text';
        userAccountInput.value = GM_getValue('user_account', '');


        const userPasswordLabel = document.createElement('label');
        userPasswordLabel.innerHTML = '密码：';
        const userPasswordInput = document.createElement('input');
        userPasswordInput.type = 'password';
        userPasswordInput.value = GM_getValue('user_password', '');

        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.innerHTML = '保存设置';
        saveButton.onclick = () => {
            GM_setValue('user_account', userAccountInput.value);
            GM_setValue('user_password', userPasswordInput.value);
            alert('已保存');
            document.body.removeChild(popupBackground);
        };

        // 添加元素到弹窗
        popupContainer.appendChild(userAccountLabel);
        popupContainer.appendChild(userAccountInput);
        popupContainer.appendChild(document.createElement('br'));
        popupContainer.appendChild(userPasswordLabel);
        popupContainer.appendChild(userPasswordInput);
        popupContainer.appendChild(document.createElement('br'));
        popupContainer.appendChild(saveButton);
        popupBackground.appendChild(popupContainer);

        document.body.appendChild(popupBackground);
    }

    // 在页面加载时创建设置按钮
    window.addEventListener('load', () => {
        createSettingButton();
    });

    // 自动请求登录
    function autoLogin() {
        const userAccount = GM_getValue('user_account', '');
        const userPassword = GM_getValue('user_password', '');

        if (userAccount && userPassword) {
            const loginUrl = `http://login.cqu.edu.cn:801/eportal/portal/login?callback=dr1004&login_method=1&user_account=%2C0%2C${userAccount}&user_password=${userPassword}`;

            // 发起请求
            GM_xmlhttpRequest({
                method: 'GET',
                url: loginUrl,
                onload: function(response) {
                    const result = JSON.parse(response.responseText.replace('dr1004(', '').replace(');', ''));
                    if (result.msg === 'Portal协议认证成功！') {
                        setTimeout(() => {
                            window.close();
                        }, 1000);
                        const popup = document.createElement('div');
                        popup.style.position = 'fixed';
                        popup.style.top = '50%';
                        popup.style.left = '50%';
                        popup.style.transform = 'translate(-50%, -50%)';
                        popup.style.backgroundColor = 'white';
                        popup.style.padding = '20px';
                        popup.style.borderRadius = '10px';
                        popup.style.zIndex = '1002';
                        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                        popup.style.textAlign = 'center';
                        popup.innerHTML = `<p>自动登录成功</p>`;
                        const closeButton = document.createElement('button');
                        closeButton.innerHTML = '关闭';
                        closeButton.style.marginTop = '10px';
                        closeButton.onclick = () => {
                            document.body.removeChild(popup);
                        };
                        popup.appendChild(closeButton);
                        document.body.appendChild(popup);
                    } else {
                        alert(result.msg);
                    }
                },
                onerror: function() {
                    alert('请求失败，请稍后再试');
                }
            });
        }
    }

    // 触发自动登录
    autoLogin();
})();
