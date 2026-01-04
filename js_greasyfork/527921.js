// ==UserScript==
// @name         ZodGame 收费贴收入统计
// @namespace    XRM.WINKAI.TOP
// @version      0.1
// @description  自动统计ZodGame收费贴的收入数据
// @author       ArSunMi
// @match        https://zodgame.xyz/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527921/ZodGame%20%E6%94%B6%E8%B4%B9%E8%B4%B4%E6%94%B6%E5%85%A5%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/527921/ZodGame%20%E6%94%B6%E8%B4%B9%E8%B4%B4%E6%94%B6%E5%85%A5%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断是否为收费帖
    function isPaidPost() {
        return document.querySelector('em.y a[href*="viewpayments"]') !== null;
    }

    // 点击收费帖的“记录”按钮
    function clickPayLink() {
        const payLink = document.querySelector('em.y a[href*="viewpayments"]');
        if (payLink) {
            payLink.click();
        }
    }

    // 获取收入数据
    function getIncomeData() {
        const incomeData = [];
        const rows = document.querySelectorAll('#fwin_content_pay .list tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const user = cells[0].innerText.trim();
            const time = cells[1].innerText.trim();
            const amount = cells[2].innerText.trim();
            incomeData.push({ user, time, amount });
        });
        return incomeData;
    }

    // 统计收入
    function calculateIncome(data) {
        const total = data.reduce((sum, record) => {
            const amount = parseInt(record.amount.split(' ')[0], 10);
            return sum + amount;
        }, 0);
        return total;
    }

    // 显示浮动提示框
    function displayTooltip(totalIncome, unitPrice, numberOfBuyers, payLinkRect) {
        const tooltip = document.createElement('div');
        tooltip.style.position = 'absolute';
        tooltip.style.top = `${payLinkRect.bottom + window.scrollY + 10}px`;
        tooltip.style.right = `${window.innerWidth - payLinkRect.right}px`;
        tooltip.style.backgroundColor = 'black';
        tooltip.style.color = 'white';
        tooltip.style.padding = '10px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.zIndex = '10000';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.innerHTML = `
            <p>此主题售价: ${unitPrice} 瓶酱油</p>
            <p>售出人数: ${numberOfBuyers} 人</p>
            <p>总计收入: ${totalIncome} 瓶酱油</p>
        `;
        document.body.appendChild(tooltip);

        // 自动隐藏提示框
        setTimeout(() => {
            tooltip.remove();
        }, 10000);
    }

    // 监听弹出窗口内容变化
    function observePayWindow(payLinkRect) {
        const observer = new MutationObserver(() => {
            const payWindow = document.querySelector('#fwin_content_pay .list');
            if (payWindow) {
                setTimeout(() => {
                    observer.disconnect();
                    const incomeData = getIncomeData();
                    const totalIncome = calculateIncome(incomeData);
                    const unitPrice = incomeData.length > 0 ? parseInt(incomeData[0].amount.split(' ')[0], 10) : 0;
                    const numberOfBuyers = incomeData.length;
                    displayTooltip(totalIncome, unitPrice, numberOfBuyers, payLinkRect);
                    // 关闭记录窗口
                    document.querySelector('a.flbc.hidefocus[onclick*="hideWindow"]').click();
                }, 0);  // 延时
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }


    function main() {
        if (!isPaidPost()) {
            return;
        }

        const payLink = document.querySelector('em.y a[href*="viewpayments"]');
        const payLinkRect = payLink.getBoundingClientRect();
        clickPayLink();

        // 监听弹窗加载
        observePayWindow(payLinkRect);
    }


    window.addEventListener('load', main);
})();