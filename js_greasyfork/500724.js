// ==UserScript==
// @name         RSS-后
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动勾选"抓取全文内容"选项,点击"更新"按钮,5秒后如果页面没有变化则关闭页面
// @author       You
// @match        http://域名/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500724/RSS-%E5%90%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/500724/RSS-%E5%90%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 勾选"抓取全文内容"复选框
    let crawlerCheckbox = document.querySelector('input[name="crawler"]');
    if (!crawlerCheckbox.checked) {
        crawlerCheckbox.click();
    }

    // 点击"更新"按钮
    let updateButton = document.querySelector('button.button-primary');
    updateButton.click();

    // 获取页面当前HTML
    let currentHTML = document.documentElement.innerHTML;

    // 监控页面变化
    let timer = setInterval(function() {
        if (document.documentElement.innerHTML === currentHTML) {
            // 5秒后页面没有变化,关闭页面
            window.close();
            clearInterval(timer);
        } else {
            // 页面有变化,更新当前HTML
            currentHTML = document.documentElement.innerHTML;
        }
    }, 5000);
})();