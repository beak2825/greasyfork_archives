// ==UserScript==
// @name         展开资源库
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  点击展开目录即可将全部展开，等加载完成后Ctrl+F组合键搜索就可以了
// @author       z-l.top
// @match        http://*.ysepan.com/*
// @icon         https://cdn.h5ds.com/space/files/600972551685382144/20231114/648860499810643968.webp
// @icon         https://zl88.github.io/img/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487502/%E5%B1%95%E5%BC%80%E8%B5%84%E6%BA%90%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/487502/%E5%B1%95%E5%BC%80%E8%B5%84%E6%BA%90%E5%BA%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加外部 CSS 文件
    var externalCSS = document.createElement('link');
    externalCSS.rel = 'stylesheet';
    externalCSS.type = 'text/css';
    externalCSS.href = 'https://xiadj.pages.dev/css/chat.css';
    document.head.appendChild(externalCSS);

    // 获取具有 id 为 "buyh" 的 div 元素并修改其 text-align 属性为 left
    var buyhDiv = document.getElementById('buyh');
    if (buyhDiv) {
        buyhDiv.style.textAlign = 'left';
    }


    // 创建按钮
    var searchButton = document.createElement('button');
    searchButton.innerHTML = '开始尬聊';
    searchButton.style.position = 'fixed';
    searchButton.style.fontSize = '16px';
    searchButton.style.top = '30px';
    searchButton.style.left = '604px';
    searchButton.style.borderRadius = '6px';
    searchButton.style.zIndex = '9999';
    searchButton.addEventListener('click', injectScript);
    document.body.appendChild(searchButton);

    // 注入脚本函数
    function injectScript() {
        // 添加外部 JavaScript 文件
        var externalScript = document.createElement('script');
        externalScript.src = 'https://topurl.cn/chat.js';
        externalScript.async = 'async';
        externalScript.setAttribute('fold', '');
        document.head.appendChild(externalScript);
    }



    // 函数：使用延迟模拟点击具有类“ml”的链接
    function simulateClickWithDelay() {
        // 获取所有具有类“ml”的链接
        var mlLinks = document.querySelectorAll('a.ml');

        // 模拟点击每个链接并设置延迟
        mlLinks.forEach(function(link, index) {
            setTimeout(function() {
                link.click();
                updateProgressBar((index + 1) / mlLinks.length * 100);
            }, index * 600); // 点击之间的延迟（根据需要调整）
        });
    }

    // 函数：延迟设置菜单元素的显示属性为块状
    function delaySetMenuDisplay() {
        // 获取所有具有类“menu”的元素
        var menuElements = document.querySelectorAll('.menu');

        // 元素之间设置为块状的延迟（以毫秒为单位）
        var delayBetweenElements = 6; // 根据需要调整此值

        // 使用延迟循环设置显示为“block”
        menuElements.forEach(function(element, index) {
            setTimeout(function() {
                element.style.display = 'block';
                updateProgressBar((index + 1) / menuElements.length * 100);
            }, index * delayBetweenElements);
        });
    }

    // 函数：更新进度条
    function updateProgressBar(progress) {
        progressBar.style.width = progress + '%';
        progressBar.innerHTML = Math.round(progress) + '%';
    }

    // 函数：按钮点击时执行的操作
    function executeScript() {
        // 重置进度条
        updateProgressBar(0);

        // 使用延迟模拟点击具有类“ml”的链接
        simulateClickWithDelay();

        // 延迟，然后设置菜单元素的显示属性为块状
        setTimeout(delaySetMenuDisplay, 10000); // 根据需要调整此延迟

        // 再次延迟一段时间后，检查是否还有更多的元素需要点击，并点击它们
        setTimeout(function() {
            var moreMenuElements = document.querySelectorAll('.menu');

            // 检查是否有更多需要点击的菜单元素
            if (moreMenuElements.length > 0) {
                moreMenuElements.forEach(function(element) {
                    element.querySelectorAll('a.ml').forEach(function(link) {
                        link.click();
                    });
                });

                // 再次延迟一段时间后，再次设置显示属性为块状
                setTimeout(delaySetMenuDisplay, 5000); // 根据需要调整此延迟
            }
        }, 12000); // 根据需要调整此延迟
    }

    // 创建按钮
    var button = document.createElement('button');
    button.innerHTML = '展开目录';
    button.style.position = 'fixed';
    button.style.fontSize = '16px';
    button.style.top = '30px';
    button.style.left = '514px';
    button.style.borderRadius = '6px';
    button.style.zIndex = '9999';
    button.addEventListener('click', executeScript);

    // 将按钮附加到body
    document.body.appendChild(button);


    // 创建进度条
    var progressBarContainer = document.createElement('div');
    progressBarContainer.style.position = 'fixed';
    progressBarContainer.style.top = '65px';
    progressBarContainer.style.left = '500px';
    progressBarContainer.style.width = '200px';
    progressBarContainer.style.height = '20px';
    progressBarContainer.style.backgroundColor = '#f0f0f0';
    progressBarContainer.style.border = '1px solid #ccc';
    progressBarContainer.style.borderRadius = '15px';
    document.body.appendChild(progressBarContainer);

    var progressBar = document.createElement('div');
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = '#4caf50';
    progressBar.style.width = '0';
    progressBar.style.borderRadius = '10px';
    progressBar.style.textAlign = 'center';
    progressBar.style.lineHeight = '20px';
    progressBar.style.color = 'white';
    progressBarContainer.appendChild(progressBar);
})();