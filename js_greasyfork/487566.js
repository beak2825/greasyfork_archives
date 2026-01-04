// ==UserScript==
// @name         Switch520自动关闭页面频繁跳出的弹窗
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动关闭switch520烦人的弹窗
// @author       fxalll
// @match        https://www.gamer520.com/*
// @match        https://www.switch520.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer520.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487566/Switch520%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E9%A1%B5%E9%9D%A2%E9%A2%91%E7%B9%81%E8%B7%B3%E5%87%BA%E7%9A%84%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/487566/Switch520%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E9%A1%B5%E9%9D%A2%E9%A2%91%E7%B9%81%E8%B7%B3%E5%87%BA%E7%9A%84%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
        function autoClose() {
        var intervalTime = 300;
        var btnList = ['button.swal2-close'];
        var closeBtn = document.querySelectorAll(btnList[0])[0];
        try {
            closeBtn.click();
            clearInterval(window.interval)
        } catch {
            window.interval = setInterval(autoClose, intervalTime)
        }
    }
    autoClose();
})();