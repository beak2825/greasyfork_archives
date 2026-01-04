// ==UserScript==
// @name         百度教育直接查看答案
// @version      0.1.0
// @description  百度教育直接查看答案，免去繁琐的点击
// @author       shiquda
// @match        https://easylearn.baidu.com/edu-page/tiangong/questiondetail*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @namespace    https://github.com/shiquda/shiquda_UserScript
// @supportURL   https://github.com/shiquda/shiquda_UserScript/issues
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475172/%E7%99%BE%E5%BA%A6%E6%95%99%E8%82%B2%E7%9B%B4%E6%8E%A5%E6%9F%A5%E7%9C%8B%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/475172/%E7%99%BE%E5%BA%A6%E6%95%99%E8%82%B2%E7%9B%B4%E6%8E%A5%E6%9F%A5%E7%9C%8B%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let intervalId; // 在全局作用域中定义 intervalId 变量

    intervalId = setInterval(() => {
        if (document.querySelector('.mask')) {
            removeMasks();
            clearInterval(intervalId); // 在检测到元素后停止 Interval
        }
        if (document.querySelector('.kaixue-dialog-close')) {
            document.querySelector('.kaixue-dialog-close').click();
        }
        if (document.querySelector('.close')) {
            document.querySelector('.close').click();
        }
        console.log('waiting...');
    }, 200);

    function removeMasks() {
        document.querySelectorAll('.mask').forEach((e) => {
            e.remove();
        });
    }
    // Your code here...
})();
