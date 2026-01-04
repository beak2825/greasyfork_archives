// ==UserScript==
// @name         四种类型任务实际工时
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  分别统计页面四种 task-container 中任务实际工时总和
// @match        https://clearstream.springbeetle.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536456/%E5%9B%9B%E7%A7%8D%E7%B1%BB%E5%9E%8B%E4%BB%BB%E5%8A%A1%E5%AE%9E%E9%99%85%E5%B7%A5%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/536456/%E5%9B%9B%E7%A7%8D%E7%B1%BB%E5%9E%8B%E4%BB%BB%E5%8A%A1%E5%AE%9E%E9%99%85%E5%B7%A5%E6%97%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function parseHour(text) {
        if (!text) return 0;
        const match = text.match(/([\d.]+)h/);
        return match ? parseFloat(match[1]) : 0;
    }

    function calcHoursByContainer(container) {
        const taskCards = container.querySelectorAll('.task-card');
        let total = 0;

        taskCards.forEach(card => {
            const options = card.querySelectorAll('.task-detail-option');
            options.forEach(option => {
                const label = option.querySelector('.task-detail-option-label');
                const value = option.querySelector('.task-detail-option-value');

                if (label && label.textContent.includes('预估工时')) {
                    total += parseHour(value?.textContent?.trim() || '');
                }
            });
        });

        return total;
    }

    function renderHours() {
        const containers = document.querySelectorAll('.task-container');
        if (containers.length === 0) return false;
        let grandTotal = 0;

        containers.forEach((container, index) => {
            const total = calcHoursByContainer(container);
            grandTotal += total;

            const headerLeft = container.querySelector('.header .header-left');
            if (headerLeft) {
                let span = headerLeft.querySelector('.hour-total');
                if (!span) {
                    span = document.createElement('span');
                    span.className = 'hour-total';
                    span.style.marginLeft = '8px';
                    span.style.fontSize = '12px';
                    // span.style.color = 'red';
                    headerLeft.appendChild(span);
                }
                span.textContent = `合计: ${total.toFixed(2)}h`;
            }

            // console.log(`第${index + 1}类任务实际工时总和: ${total.toFixed(2)} 小时`);
        });

        const board = document.querySelector('.app-main .board');
        if (board) {
            const btn = board.querySelector('.btn');
            if (btn) {
                let totalSpan = board.querySelector('.grand-total-display');
                if (!totalSpan) {
                    totalSpan = document.createElement('span');
                    totalSpan.className = 'grand-total-display';
                    totalSpan.style.marginLeft = '8px';
                    totalSpan.style.fontWeight = 'bold';
                    totalSpan.style.fontSize = '15px';
                    totalSpan.style.color = '#333';
                    btn.insertAdjacentElement('afterend', totalSpan);
                }
                totalSpan.textContent = `⏱ 总工时: ${grandTotal.toFixed(2)} h`;
            }
        }

        return true;
    }

    let lastLength = 0;
    function checkAndRender() {
        const elems = document.querySelectorAll('.task-container .task-card .task-detail-option-value');
        const currentLength = elems.length;
        if (currentLength !== lastLength) {
            lastLength = currentLength;
            renderHours();
        }
    }

    checkAndRender();
    setInterval(checkAndRender, 1000);
})();



