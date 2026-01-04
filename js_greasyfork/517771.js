// ==UserScript==
// @name         Horizon官网检查是否包含PDF
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate the process of clicking the PDF download button and close the tab after 5 seconds if the button is found and clicked
// @author       Kimi
// @match        https://techzone.omnissa.com/resource/*
// @match        https://techzone.omnissa.com/blog/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517771/Horizon%E5%AE%98%E7%BD%91%E6%A3%80%E6%9F%A5%E6%98%AF%E5%90%A6%E5%8C%85%E5%90%ABPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/517771/Horizon%E5%AE%98%E7%BD%91%E6%A3%80%E6%9F%A5%E6%98%AF%E5%90%A6%E5%8C%85%E5%90%ABPDF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 记录初始访问的URL
    console.log('访问的URL:', window.location.href);

    // 等待页面完全加载后再执行脚本
    window.onload = function() {
        // 页面加载完成后等待3秒
        setTimeout(function() {
            // 查找包含特定类名的按钮
            const pdfButton = document.querySelector('.print-pdf');

            // 如果按钮存在，模拟点击事件
            if (pdfButton) {
                pdfButton.click();
                console.log('PDF download button clicked');
                // 点击后等待5秒再关闭标签页
                setTimeout(function() {
                    console.log("关闭当前标签页");
                    window.close(); // 关闭当前标签页
                }, 5000);
            }
            // 如果按钮不存在，等待3秒后刷新页面
            else {
                console.log('PDF download button not found on this page. Refreshing in 3 seconds...');
                setTimeout(function() {
                    window.location.reload();
                }, 3000);
            }
        }, 3000); // 等待3000毫秒，确保页面上的脚本已经加载了按钮
    };
})();