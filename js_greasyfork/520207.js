// ==UserScript==
// @name         Steam 家庭共享检测（图标提示）
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  检测Steam游戏是否支持家庭共享，并在游戏标题上方显示图标，鼠标悬浮显示提示，点击图标跳转并高亮“家庭共享”位置
// @author       你
// @license      MIT
// @match        https://store.steampowered.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520207/Steam%20%E5%AE%B6%E5%BA%AD%E5%85%B1%E4%BA%AB%E6%A3%80%E6%B5%8B%EF%BC%88%E5%9B%BE%E6%A0%87%E6%8F%90%E7%A4%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/520207/Steam%20%E5%AE%B6%E5%BA%AD%E5%85%B1%E4%BA%AB%E6%A3%80%E6%B5%8B%EF%BC%88%E5%9B%BE%E6%A0%87%E6%8F%90%E7%A4%BA%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建图标元素
    const iconElement = document.createElement('span');
    iconElement.style.fontSize = '32px'; // 设置图标大小
    iconElement.style.marginBottom = '10px'; // 设置与标题的间距
    iconElement.style.cursor = 'pointer';  // 设置图标为可点击
    iconElement.style.transition = 'transform 0.2s ease-in-out'; // 添加平滑过渡效果
    iconElement.style.position = 'absolute'; // 设置为绝对定位
    iconElement.style.top = '0'; // 图标位置在标题上方
    iconElement.style.left = '0'; // 调整水平位置，使其与标题左对齐
    iconElement.style.zIndex = '10'; // 确保图标在标题上方

    // 监听 DOM 变动，直到找到游戏标题元素
    const observer = new MutationObserver(function(mutations) {
        const gameTitleElement = document.querySelector('.apphub_AppName');

        // 如果找到了游戏标题元素，则执行插入操作
        if (gameTitleElement) {
            // 查找是否有包含“家庭共享”的链接
            const familySharingLink = Array.from(document.querySelectorAll('a')).find(link =>
                link.textContent.includes('家庭共享') || link.textContent.includes('Family Sharing')
            );

            // 如果找到了“家庭共享”链接
            if (familySharingLink) {
                // 模拟点击该链接并检测跳转 URL
                const originalHref = familySharingLink.href;
                const isValidLink = originalHref && originalHref.startsWith("https://store.steampowered.com/");

                // 根据跳转 URL 判断是否支持家庭共享
                if (isValidLink) {
                    iconElement.textContent = '✔';  // 显示绿色√
                    iconElement.style.color = 'green';  // 设置为绿色
                    iconElement.title = '支持家庭共享';  // 鼠标悬浮提示
                } else {
                    iconElement.textContent = '❌';  // 显示红色×
                    iconElement.style.color = 'red';  // 设置为红色
                    iconElement.title = '不支持家庭共享';  // 鼠标悬浮提示
                }

                // 添加点击事件，点击图标时滚动到“家庭共享”链接并高亮显示
                iconElement.onclick = function() {
                    // 查找“家庭共享”文本位置并平滑滚动到该位置
                    const familySharingText = Array.from(document.querySelectorAll('a')).find(link =>
                        link.textContent.includes('家庭共享') || link.textContent.includes('Family Sharing')
                    );

                    if (familySharingText) {
                        // 平滑滚动到“家庭共享”位置
                        familySharingText.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        // 高亮“家庭共享”文本
                        const range = document.createRange();
                        const selection = window.getSelection();
                        range.selectNodeContents(familySharingText);
                        selection.removeAllRanges();
                        selection.addRange(range);

                        // 高亮背景色
                        familySharingText.style.backgroundColor = 'yellow';  // 高亮背景色为黄色

                        // 一定时间后恢复原背景色
                        setTimeout(() => {
                            familySharingText.style.backgroundColor = '';  // 恢复背景色
                        }, 2000);
                    }
                };
            } else {
                // 如果没有找到“家庭共享”链接，认为不支持家庭共享
                iconElement.textContent = '❌';  // 显示红色×
                iconElement.style.color = 'red';  // 设置为红色
                iconElement.title = '不支持家庭共享';  // 鼠标悬浮提示
            }

            // 将图标插入到标题区域的上方
            const headerElement = document.querySelector('.apphub_HeaderStandardTop');
            if (headerElement) {
                headerElement.style.position = 'relative'; // 确保标题区域是相对定位
                headerElement.appendChild(iconElement);  // 将图标添加到标题区域上方
            }

            // 停止观察，避免不必要的重复操作
            observer.disconnect();
        }
    });

    // 配置观察器以监听 DOM 变动
    observer.observe(document.body, { childList: true, subtree: true });
})();
