// ==UserScript==
// @name         心理价位自动出价
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在拍拍京东拍卖页面中，根据心理价位自动出价：高于心理价位时提示，低于心理价位在倒计时结束前2秒出价加1
// @author       你的名字
// @match        https://paipai.jd.com/auction-detail/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529457/%E5%BF%83%E7%90%86%E4%BB%B7%E4%BD%8D%E8%87%AA%E5%8A%A8%E5%87%BA%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/529457/%E5%BF%83%E7%90%86%E4%BB%B7%E4%BD%8D%E8%87%AA%E5%8A%A8%E5%87%BA%E4%BB%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function () {
        // 添加心理价位输入界面
        addInputUI();
        // 动态监听出价输入框
        observeElement('.el-input .el-input__inner', function (bidInput) {
            // 恢复出价金额
            restoreBidAmount(bidInput);
            // 动态监听倒计时元素
            observeElement('#J-count-down', observeCountdown);
        });
    });

    // 添加心理价位输入界面的函数
    function addInputUI() {
        // 创建一个容器
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.zIndex = 1000;
        container.style.padding = '10px';
        container.style.backgroundColor = '#f0f0f0';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';

        // 添加输入框
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = '输入心理价位';
        input.style.marginRight = '10px';
        container.appendChild(input);

        // 添加确认按钮
        const button = document.createElement('button');
        button.textContent = '确认';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#007BFF';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', function () {
            const maxPrice = parseFloat(input.value);
            if (!isNaN(maxPrice)) {
                localStorage.setItem('maxPrice', maxPrice.toString());
                alert(`心理价位已设置为：${maxPrice}`);
            } else {
                alert('请输入有效的数字！');
            }
        });
        container.appendChild(button);

        // 将容器添加到页面中
        document.body.appendChild(container);
    }

    // 动态监听元素的函数
    function observeElement(selector, callback) {
        const observer = new MutationObserver(function (mutations, obs) {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                obs.disconnect(); // 停止观察
            }
        });

        // 开始观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 监听倒计时的函数
    function observeCountdown(countdownElement) {
        // 使用 MutationObserver 监听倒计时元素的变化
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                // 获取倒计时文本
                const countdownText = getCountdownText();
                // 检查倒计时是否为 "00:00:02"
                if (countdownText === '00:00:02') {
                    // 获取心理价位
                    const maxPrice = parseFloat(localStorage.getItem('maxPrice'));
                    if (!isNaN(maxPrice)) {
                        // 获取当前价格
                        const currentPrice = getCurrentPrice();
                        if (currentPrice < maxPrice) {
                            // 当前价格低于心理价位，执行出价
                            autoBid();
                        } else {
                            // 当前价格高于心理价位，提示用户
                            showMessage('当前价格高于心理价位，不出价。');
                        }
                    } else {
                        console.error('未设置心理价位。');
                    }
                }
            });
        });

        // 开始观察倒计时元素的内容变化
        observer.observe(countdownElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // 获取倒计时文本的函数
    function getCountdownText() {
        // 倒计时元素的选择器是 '#J-count-down'
        const countdownElement = document.querySelector('#J-count-down');
        if (countdownElement) {
            // 获取所有 <i> 标签的内容
            const parts = Array.from(countdownElement.querySelectorAll('i')).map(i => i.textContent.trim());
            // 拼接成 "00:00:00" 格式
            return parts.join(':');
        }
        return null;
    }

    // 获取当前价格的函数
    function getCurrentPrice() {
        // 当前价格元素的选择器是 '.summary-price.J-summary-price'
        const priceElement = document.querySelector('.summary-price.J-summary-price');
        if (priceElement) {
            const priceText = priceElement.textContent.trim().replace(/[^0-9.]/g, '');
            return parseFloat(priceText);
        }
        console.error("未找到当前价格元素，请检查选择器。");
        return NaN;
    }

    // 自动加1出价的函数
    function autoBid() {
        // 出价输入框的选择器是 '.el-input .el-input__inner'
        const bidInput = document.querySelector('.el-input .el-input__inner');
        // 出价按钮的选择器是 '.choose-btns.clearfix .btn-special6.btn-lg'
        const bidButton = document.querySelector('.choose-btns.clearfix .btn-special6.btn-lg');

        if (bidInput && bidButton) {
            // 获取当前出价
            let currentBid = parseFloat(bidInput.value);
            if (!isNaN(currentBid)) {
                // 加1
                const newBid = currentBid + 1;
                // 保存出价金额
                localStorage.setItem('lastBidAmount', newBid.toString());
                // 更新出价输入框的值
                bidInput.value = newBid.toString();
                // 触发出价按钮点击事件
                bidButton.click();
                console.log(`自动出价成功，出价金额：${newBid}`);
            } else {
                console.error("出价输入框的值不是有效的数字。");
            }
        } else {
            console.error("未找到出价输入框或出价按钮，请检查选择器。");
        }
    }

    // 恢复出价金额的函数
    function restoreBidAmount(bidInput) {
        if (bidInput) {
            // 获取保存的出价金额
            const lastBidAmount = localStorage.getItem('lastBidAmount');
            if (lastBidAmount) {
                // 恢复出价金额
                bidInput.value = lastBidAmount;
                console.log('出价金额已恢复：', lastBidAmount);
            }
        }
    }

    // 显示提示信息的函数
    function showMessage(message) {
        // 创建一个提示框
        const messageBox = document.createElement('div');
        messageBox.textContent = message;
        messageBox.style.position = 'fixed';
        messageBox.style.top = '50px';
        messageBox.style.right = '10px';
        messageBox.style.zIndex = 1000;
        messageBox.style.padding = '10px';
        messageBox.style.backgroundColor = '#ff4444';
        messageBox.style.color = '#fff';
        messageBox.style.borderRadius = '5px';
        messageBox.style.animation = 'fadeOut 3s forwards';

        // 添加动画效果
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                0% { opacity: 1; }
                90% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // 将提示框添加到页面中
        document.body.appendChild(messageBox);

        // 3秒后移除提示框
        setTimeout(() => {
            messageBox.remove();
        }, 3000);
    }
})();