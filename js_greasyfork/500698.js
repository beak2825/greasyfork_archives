// ==UserScript==
// @name         自动点击 luogu 跳转
// @namespace    http://tampermonkey.net/
// @version      2024.7.15
// @description  在 luogu 跳转的时候自动点击
// @author       Zhao_daodao
// @match        https://www.luogu.com.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500698/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%20luogu%20%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/500698/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%20luogu%20%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    // 获取指定的元素
    var targetButton = document.querySelector("body > div > div > p:nth-child(5) > a");
    // 检查元素是否存在并且文本内容是否为“继续访问”
    if (targetButton && targetButton.textContent === "继续访问") {
        // 触发点击事件
        targetButton.click();
    }
})();