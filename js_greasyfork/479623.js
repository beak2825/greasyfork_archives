// ==UserScript==
// @name         伊犁师范大学校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  自动保存并填写伊犁师范大学校园网账号密码，首次使用会弹出填写账号密码弹窗。本脚本不带有任何联网功能，纯本地运行，不会上传用户的任何数据。如需修改账号密码，请重新安装此脚本。
// @author       Nin_Han
// @license      MIn_Han
// @match        http://124.119.117.254:667/web
// @icon         https://bkimg.cdn.bcebos.com/pic/8d5494eef01f3a295672ee0e9425bc315d607cb3?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U4MA==,g_7,xp_5,yp_5/format,f_auto
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479623/%E4%BC%8A%E7%8A%81%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/479623/%E4%BC%8A%E7%8A%81%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const storageKey = 'accountInfo';
    let accountInfo = JSON.parse(localStorage.getItem(storageKey)) || {};

    if (!accountInfo.accountNumber || !accountInfo.accountPassword) {
        accountInfo.accountNumber = prompt("请输入账号：");
        accountInfo.accountPassword = prompt("请输入密码：");

        if (accountInfo.accountNumber === null || accountInfo.accountPassword === null) {
            console.log('用户取消了操作，停止执行');
            return;
        }

        localStorage.setItem(storageKey, JSON.stringify(accountInfo));
    }

    function fillLoginForm() {
        const inputs = {
            accountNumber: document.querySelector("#web-auth-user"),
            accountPassword: document.querySelector("#web-auth-password"),
            rememberCheckbox: document.querySelector("#remember")
        };

        for (const key in inputs) {
            if (!inputs[key]) {
                console.error(`找不到登录页面的 ${key}`);
                return;
            }
        }

        inputs.accountNumber.value = accountInfo.accountNumber;
        inputs.accountPassword.value = accountInfo.accountPassword;
        inputs.rememberCheckbox.checked = true;
    }

    function clickLogoutAndLogin() {
        const logoutButton = document.querySelector("#web-auth-delete");

        if (logoutButton) {
            logoutButton.click();

            setTimeout(() => {
                handleErrorMessage();
                login();
            }, 1000); // 确保下线操作完成
        } else {
            login();
        }
    }

    function handleErrorMessage() {
        const errorButton = document.querySelector("#web-auth-error > div > div > div > div.modal-footer > button.btn.btn-primary");
        if (errorButton) {
            errorButton.click();
        }
    }

    function login() {
        document.querySelector("#web-auth-connect").click();
    }

    fillLoginForm();
    clickLogoutAndLogin();

    setTimeout(() => window.close(), 3000);
})();
