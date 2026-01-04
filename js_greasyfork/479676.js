// ==UserScript==
// @name         考试试题抓取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  检测页面是否存在指定按钮，并点击按钮
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479676/%E8%80%83%E8%AF%95%E8%AF%95%E9%A2%98%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/479676/%E8%80%83%E8%AF%95%E8%AF%95%E9%A2%98%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 计数器，用于重命名页面
    var downloadCount = 1;

    // 检测按钮是否存在的函数
    function checkAndClickButtons() {
        // 检测并点击第一个按钮
        var button1 = document.querySelector('.btn-blue.sub-exam');
        if (button1) {
            button1.click();
            console.log('按钮1已点击！');
        } else {
            console.log('按钮1未找到');
        }

        // 检测并点击第二个按钮
        var button2 = document.querySelector('.btn-blue.ems-box-known.exam-dailog-ok-btn');
        if (button2) {
            // 点击按钮2
            button2.click();
            console.log('按钮2已点击！');

            // 等待5秒后执行下载页面并重命名的操作
            setTimeout(downloadPageAndRename, 5000);
        } else {
            console.log('按钮2未找到');
        }

        // 检测并点击第三个按钮
        var button3 = document.querySelector('.btn-blue1.try-again.fr');
        if (button3) {
            button3.click();
            console.log('按钮3已点击！');
        } else {
            console.log('按钮3未找到');
        }
    }

    // 下载页面并重命名的函数
    function downloadPageAndRename() {
        // 创建一个新的a标签
        var a = document.createElement('a');
        // 获取当前页面的HTML内容
        var htmlContent = document.documentElement.outerHTML;

        // 创建Blob对象，存储HTML内容
        var blob = new Blob([htmlContent], { type: 'text/html' });

        // 设置a标签的href为Blob URL
        a.href = URL.createObjectURL(blob);

        // 设置a标签的下载属性
        a.download = downloadCount + '.html';

        // 模拟点击a标签进行下载
        a.click();

        // 递增计数器，准备下一次下载
        downloadCount++;
    }

    // 设置定时器，每隔一段时间检测按钮是否存在并点击
    setInterval(checkAndClickButtons, 8000); // 每8秒检测一次，可以根据实际情况调整时间间隔
})();
