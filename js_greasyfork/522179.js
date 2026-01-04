// ==UserScript==
// @name         登录码与激活码注入服务器
// @namespace    https://update.greasyfork.org
// @version      1.1
// @description  Script for managing activation and login codes using external library.
// @author       xiangye
// @license      Apache 2.0
// @match        https://yueyin.zhipianbang.com/*
// @require      https://update.greasyfork.org/scripts/522177/1511366/Activation%20and%20Login%20Code%20Library.js
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/522179/%E7%99%BB%E5%BD%95%E7%A0%81%E4%B8%8E%E6%BF%80%E6%B4%BB%E7%A0%81%E6%B3%A8%E5%85%A5%E6%9C%8D%E5%8A%A1%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/522179/%E7%99%BB%E5%BD%95%E7%A0%81%E4%B8%8E%E6%BF%80%E6%B4%BB%E7%A0%81%E6%B3%A8%E5%85%A5%E6%9C%8D%E5%8A%A1%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait for the external library to load
    function waitForLibrary(callback) {
        if (typeof window.ActivationLibrary !== 'undefined') {
            callback();
        } else {
            setTimeout(() => waitForLibrary(callback), 100);
        }
    }

    // Main script logic
    waitForLibrary(() => {
        console.log("Activation & Login Code Library loaded.");

        // Inject Activation Code Entry
        function injectActivationCodeEntry() {
            const durationOptions = ["1week", "1month", "3months", "6months", "1year", "forever"];
            const duration = prompt(`选择激活码存储时长:\n${durationOptions.join(', ')}`);

            if (!durationOptions.includes(duration)) {
                alert("选择的存储时长无效，请重试。");
                return;
            }

            const activationCode = window.ActivationLibrary.injectActivationCode(duration);
            GM_notification({
                title: "激活码生成成功",
                text: `激活码已生成并存储:\n${activationCode}`,
                timeout: 5000,
            });
        }

        // Inject Login Code Entry
        function injectLoginCodeEntry() {
            const loginCode = prompt("请输入要存储的登录码:");

            if (!loginCode) {
                alert("输入的登录码无效，请重试。");
                return;
            }

            window.ActivationLibrary.injectLoginCode(loginCode);
            GM_notification({
                title: "登录码存储成功",
                text: "登录码已成功存储。",
                timeout: 5000,
            });
        }

        // Register menu commands
        GM_registerMenuCommand("注入激活码", injectActivationCodeEntry);
        GM_registerMenuCommand("注入登录码", injectLoginCodeEntry);
    });
})();
