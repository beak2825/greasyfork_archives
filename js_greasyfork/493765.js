// ==UserScript==
// @name         lc自用-图集岛一行显示多张图
// @namespace    lc1
// @version      2.0
// @description  自动触发图集岛网站的懒加载机制加载所有图片，并在完成后快速滚动到页面顶部260像素位置。同时允许用户设置每行显示的图片数量。
// @match        *://*.yaltuji.com/a/*
// @match        *://*.sqmuying.com/a/*
// @match        www.sqmuying.com/a/*
// @match        *://www.sqmuying.com/a/*
// @match        *.sqmuying.com/a/*
// @match        *://*.sqmuying.com/a/*
// @match        *://*.sqmuying.com/a/*
// @exclude      *://*.yaltuji.com/s/*
// @exclude      *://*.yaltuji.com/u/*
// @exclude      *://*.yaltuji.com/t/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/493765/lc%E8%87%AA%E7%94%A8-%E5%9B%BE%E9%9B%86%E5%B2%9B%E4%B8%80%E8%A1%8C%E6%98%BE%E7%A4%BA%E5%A4%9A%E5%BC%A0%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/493765/lc%E8%87%AA%E7%94%A8-%E5%9B%BE%E9%9B%86%E5%B2%9B%E4%B8%80%E8%A1%8C%E6%98%BE%E7%A4%BA%E5%A4%9A%E5%BC%A0%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取用户设置的每行图片数量，默认为3
    var imagesPerRow = GM_getValue('imagesPerRow', 3);

    // 创建设置容器并添加到页面左下角
    var settingsContainer = document.createElement('div');
    settingsContainer.style.position = 'fixed';
    settingsContainer.style.bottom = '10px';
    settingsContainer.style.left = '10px';
    settingsContainer.style.zIndex = '1000';
    settingsContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    settingsContainer.style.padding = '5px';
    settingsContainer.style.borderRadius = '5px';

    // 创建选择框
    var selectElement = document.createElement('select');
    selectElement.id = 'images-select';
    var options = [1, 2,3,4,5, 6,8, 10, 12, 14, 15, 16, 18, 20]; // 增加12, 14, 15, 16, 18选项
    for (var i = 0; i < options.length; i++) {
        var option = document.createElement('option');
        option.value = options[i];
        option.textContent = options[i] + '图显示';
        if (options[i] === imagesPerRow) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    }
    settingsContainer.appendChild(selectElement);
    document.body.appendChild(settingsContainer);

    // 创建关闭按钮容器并添加到页面右下角
    var buttonsContainer = document.createElement('div');
    buttonsContainer.style.position = 'fixed';
    buttonsContainer.style.bottom = '10px';
    buttonsContainer.style.right = '40px'; // 向左移动30个像素
    buttonsContainer.style.zIndex = '1000';

    // 创建关闭按钮
    var closeButton = document.createElement('button');
    closeButton.textContent = '关闭此网页';
    closeButton.style.height = '40px'; // 高度变成现在的2倍
    closeButton.onclick = function() {
        window.close();
    };
    buttonsContainer.appendChild(closeButton);

    document.body.appendChild(buttonsContainer);

    // 根据用户选择的图片数量设置样式
    setDisplayStyle();

    // 设置图片显示样式的函数
    function setDisplayStyle() {
        var styleRules = `
            #kbox {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                width: 100%; /* 确保容器宽度为100% */
            }
            #kbox > img {
                width: ${100 / imagesPerRow}%; /* 根据选择的图片数量设置图片宽度 */
                max-width: 100%; /* 确保图片最大宽度为100% */
                height: auto; /* 保持图片的宽高比 */
                margin-bottom: 10px; /* 增加一些间隔 */
                object-fit: cover;
            }
        `;
        GM_addStyle(styleRules);
    }

    // 监听选择框变化事件，保存用户选择并更新样式
    selectElement.addEventListener('change', function() {
        imagesPerRow = parseInt(this.value);
        GM_setValue('imagesPerRow', imagesPerRow); // 保存用户选择
        console.log('用户选择的每行图片数量:', imagesPerRow); // 调试信息
        setDisplayStyle(); // 更新样式
        simulateScrollAndBackToTop(); // 触发滚动并快速回到顶部
    });

    // 监听窗口大小变化，以动态更新图片显示样式
    window.addEventListener('resize', function() {
        setDisplayStyle(); // 更新样式
        simulateScrollAndBackToTop(); // 触发滚动并快速回到顶部
    });

    // 定义一个函数来模拟滚动事件，自动加载图片并快速回到顶部
    function simulateScrollAndBackToTop() {
        // 滚动到页面底部，以触发懒加载
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });

        // 设置延迟，等待图片加载完毕
        setTimeout(function() {
            // 快速滚动到页面顶部260像素位置
            window.scrollTo({
                top: 250,
                behavior: 'auto'
            });
        }, 1100); // 延迟时间可以根据实际情况调整
    }

    // 初始滚动并快速回到顶部
    simulateScrollAndBackToTop();
})();
