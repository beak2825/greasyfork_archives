// ==UserScript==
// @license Elianbeyond
// @name         Custom Page Navigation in Purchase Popup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  允许手动输入页码进行购买弹窗导航
// @author       You
// @match        https://shy.xddfk.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488394/Custom%20Page%20Navigation%20in%20Purchase%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/488394/Custom%20Page%20Navigation%20in%20Purchase%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let commodityId = null; // 全局常量，用于存储商品ID

    // 创建输入框和按钮
    function createPageNavigation() {
        console.log('创建页面导航...');

        const container = document.createElement('div');
        container.style.marginBottom = '10px';

        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = '输入要跳转的页码';
        input.style.marginRight = '5px';
        input.id = 'input';

        const button = document.createElement('button');
        button.textContent = '跳转';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', navigateToPage);

        container.appendChild(input);
        container.appendChild(button);

        // 找到购买框并插入输入框和按钮
        const purchasePopup = document.querySelector('.card.animated.specified');
        if (purchasePopup) {
            console.log('购买弹窗找到。正在添加页面导航...');

            purchasePopup.insertBefore(container, purchasePopup.firstChild);

            // 如果商品ID尚未初始化，则初始化之
            if (commodityId === null) {
                const currentButton = document.querySelector('.card.animated.specified .card-block.anticipation input[type="checkbox"]');
                commodityId = currentButton ? parseInt(currentButton.value) : null;
                console.log('当前商品ID:', commodityId);
            }
        } else {
            console.log('购买弹窗未找到。');
        }
    }

    // 点击跳转按钮的事件处理程序
    function navigateToPage(event) {
        event.preventDefault(); // 阻止按钮的默认行为
        console.log('导航至页面...');

        const input = document.getElementById('input');
        const page = parseInt(input.value);

        if (!isNaN(page)) {
            console.log('页码:', page);

            // 计算需要点击下一组按钮的次数
            const numClicks = page - 1;

            console.log('当前商品ID:', commodityId);

            // 循环点击下一组按钮
            let counter = 0;
            const intervalId = setInterval(function() {
                if (counter < numClicks) {
                    clickNextPageButton();
                    counter++;
                } else {
                    clearInterval(intervalId);
                }
            }, 700); // 每0.5秒点击一次
        } else {
            console.log('请输入有效的页码');
        }
    }

    // 点击下一页按钮
    function clickNextPageButton() {
        console.log('点击下一页按钮...');

        // 查找指定购买部分
        const specifiedSection = document.querySelector('.card.animated.specified');

        if (specifiedSection) {
            // 在指定购买部分中查找下一页按钮
            const nextPageButton = specifiedSection.querySelector('.card-block.anticipation button:nth-child(2)');
            if (nextPageButton && nextPageButton.textContent.trim() === '下一页') {
                nextPageButton.click();
                console.log('下一页按钮已点击.');
            } else {
                console.log('未找到下一页按钮.');
            }
        } else {
            console.log('未找到指定购买部分.');
        }
    }

    // 等待购买框出现后再添加页面导航
    function waitForPurchasePopup() {
        console.log('等待购买弹窗...');
        const checkExist = setInterval(function() {
            const productFieldset = document.querySelector('.form-group.product');
            if (productFieldset) {
                console.log('商品选择框已检测到.');
                clearInterval(checkExist);
                createPageNavigation(); // 添加页面导航
            }
        }, 100); // 每100毫秒检查一次
    }

    // 页面加载完成后等待购买框出现
    window.addEventListener('load', waitForPurchasePopup);

    // 监听购买按钮点击事件
    document.addEventListener('click', function(event) {
        const target = event.target;
        if (target && target.tagName === 'A' && target.classList.contains('commodity-click')) {
            const id = target.getAttribute('data-id');
            if (id) {
                commodityId = parseInt(id);
                console.log('购买按钮点击。当前商品ID:', commodityId);
            }
        }
    });
})();
