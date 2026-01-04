// ==UserScript==
// @name         广行自动点击登录按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动识别网页的登录按钮并点击
// @match        http://1.1.1.1:8888/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477043/%E5%B9%BF%E8%A1%8C%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%99%BB%E5%BD%95%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/477043/%E5%B9%BF%E8%A1%8C%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%99%BB%E5%BD%95%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找登录按钮
    var loginButton = document.querySelector('#submitForm');

    // 如果找到登录按钮，则点击它
    if (loginButton) {
        loginButton.click();
    }
})();
