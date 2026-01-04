// ==UserScript==
// @name         自动兑换和下单脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动兑换并下单
// @author       你的名字
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521302/%E8%87%AA%E5%8A%A8%E5%85%91%E6%8D%A2%E5%92%8C%E4%B8%8B%E5%8D%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/521302/%E8%87%AA%E5%8A%A8%E5%85%91%E6%8D%A2%E5%92%8C%E4%B8%8B%E5%8D%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const monitorButton = document.createElement('button');
    monitorButton.textContent = '开始监控';
    monitorButton.style.position = 'fixed';
    monitorButton.style.top = '10px';
    monitorButton.style.right = '10px';
    monitorButton.style.zIndex = 1000;
    monitorButton.style.backgroundColor = '#ff5722';
    monitorButton.style.color = '#ffffff';
    monitorButton.style.border = 'none';
    monitorButton.style.padding = '10px 20px';
    monitorButton.style.borderRadius = '5px';
    monitorButton.style.cursor = 'pointer';
    monitorButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    document.body.appendChild(monitorButton);

    let monitoring = false;
    let interval;

    monitorButton.addEventListener('click', function() {
        if (!monitoring) {
            startMonitoring();
        } else {
            const stop = confirm('是否停止监控？');
            if (stop) {
                stopMonitoring();
            }
        }
    });

    function startMonitoring() {
        monitoring = true;
        monitorButton.textContent = '监控中...';
        localStorage.setItem('monitoring', 'true');
        interval = setInterval(() => {
            const exchangeButton = document.querySelector('.SubmitExchange--FCckR');
            if (exchangeButton && exchangeButton.textContent.includes('立即兑换')) {
                clearInterval(interval);
                exchangeButton.click();
                setTimeout(() => {
                    const confirmButton = document.querySelector('.AlertOKBtn--3GSKb');
                    if (confirmButton) {
                        confirmButton.click();
                        //alert('已点击“确定”按钮');
                        localStorage.setItem('proceedToBuy', 'true');
                    }
                    stopMonitoring();
                }, 500);
            } else {
                location.reload();
            }
        }, 500);
    }

    function stopMonitoring() {
        clearInterval(interval);
        monitoring = false;
        monitorButton.textContent = '开始监控';
        localStorage.removeItem('monitoring');
    }

    function proceedToBuy() {
        const observer = new MutationObserver(() => {
            const buyNowButton = document.querySelector('.dx-event-node[aria-label="立即购买"] span');
            if (buyNowButton) {
                buyNowButton.click();
                console.log('已点击“立即购买”按钮');
                setTimeout(() => {
                    buyNowButton.click();
                    console.log('已再次点击“立即购买”按钮');
                    localStorage.setItem('proceedToOrder', 'true');
                    localStorage.removeItem('proceedToBuy');
                }, 500);
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function proceedToOrder() {
        const orderInterval = setInterval(() => {
            const submitOrderButton = document.querySelector('button:contains("提交订单")');
            if (submitOrderButton) {
                submitOrderButton.click();
                console.log('已点击“提交订单”按钮');
                clearInterval(orderInterval);
                localStorage.removeItem('proceedToOrder');
            }
        }, 1000);
    }

    window.addEventListener('load', function() {
        if (window.location.href.startsWith('https://detail.m.tmall.com/')) {
            if (localStorage.getItem('proceedToBuy') === 'true') {
                proceedToBuy();
            }

            if (localStorage.getItem('proceedToOrder') === 'true') {
                proceedToOrder();
            }
        }

        if (localStorage.getItem('monitoring') === 'true') {
            startMonitoring();
        }
    });
})();