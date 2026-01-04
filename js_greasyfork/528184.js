// ==UserScript==
// @name         黑龙江省干部网络教育学院 学习视频自动点击确定按钮
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击网页上的确定按钮
// @author       CAN
// @match        https://www.hljgbjy.org.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528184/%E9%BB%91%E9%BE%99%E6%B1%9F%E7%9C%81%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%20%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E5%AE%9A%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/528184/%E9%BB%91%E9%BE%99%E6%B1%9F%E7%9C%81%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%20%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E5%AE%9A%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickConfirmButton() {
        const confirmButton = document.querySelector('.confirm-btn'); // 根据实际按钮的类名调整
        if (confirmButton) {
            console.log('找到确定按钮:', confirmButton);
            confirmButton.click();
            console.log('确定按钮已被点击');
        } else {
            console.log('未找到确定按钮');
        }
    }

    setInterval(clickConfirmButton, 5000); // 每5秒检查一次
})();
