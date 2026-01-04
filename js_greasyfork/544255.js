// ==UserScript==
// @name         标普ETF定投策略
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  将平均值添加到52周范围的显示区块中
// @match        https://cn.investing.com/etfs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544255/%E6%A0%87%E6%99%AEETF%E5%AE%9A%E6%8A%95%E7%AD%96%E7%95%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/544255/%E6%A0%87%E6%99%AEETF%E5%AE%9A%E6%8A%95%E7%AD%96%E7%95%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function insertAverage() {
        // 定位包含平均值的父div
        const parentDiv = document.querySelector('div.flex.basis-1\\/2.flex-col.items-start.gap-1\\.5.sm\\:basis-\\[33\\.333\\%\\].md\\:basis-auto.md\\:flex-row.md\\:gap-2.md\\:order-4');
        // 定位目标div（52周范围）
        const targetDiv = document.querySelector('div.text-xs\\/4.flex-1');
        // 定位当前价格div
        const priceDiv = document.querySelector('div[data-test="instrument-price-last"]');
        // 定位所有匹配的div（text-xs/4 flex-1）
        const targetDivs = document.querySelectorAll('div.text-xs\\/4.flex-1');

        // 检查是否存在至少两个匹配的div
        if (targetDivs.length >= 2) {
            const secondTargetDiv = targetDivs[1]; // 获取第二个div
            console.log('第二个目标div:', secondTargetDiv);
            // 在这里对 secondTargetDiv 进行操作
        } else {
            console.error('未找到第二个目标div，匹配数量:', targetDivs.length);
        }

        if (priceDiv) {
            // 获取文本内容并转换为保留三位小数的数字
            const priceText = priceDiv.textContent.trim();
            const price = parseFloat(priceText);
            if (!isNaN(price)) {
                const priceFormatted = price.toFixed(3); // 保留三位小数
                console.log('价格（保留三位小数）:', priceFormatted); // 输出例如：2.156
            } else {
                console.error('无法解析价格:', priceText);
            }
        } else {
            console.error('未找到价格div');
        }

        if (parentDiv && targetDiv) {
            // 从父div中提取平均值
            const averageDiv = parentDiv.querySelector('div.self-stretch.text-xs.font-semibold.leading-4.text-black.rtl\\:text-right');
            if (averageDiv) {
                const averageValue = parseFloat(averageDiv.innerText);
                const priceText = priceDiv.textContent.trim();
                const price = parseFloat(priceText);
                const secondTargetDiv = targetDivs[1]; // 获取第二个div
                if (!isNaN(averageValue) && !document.querySelector('#inserted-average')) {
                    // 创建新div
                    const newDiv = document.createElement('div');
                    newDiv.id = 'inserted-average';
                    newDiv.className = 'text-xs/4 flex-1'; // 保留原布局类
                    if(averageValue>price){
                    newDiv.innerHTML = `
                        <div class="text-secondary mb-0.5" style="color: red; font-size: 14px;">30天均值</div>
                        <div class="font-bold tracking-[0.2px]" style="color: red; font-size: 22px;">${averageValue.toFixed(3)} > ${price} 本期需增加+</div>
                       <a href="https://intumu.com/" class="navbar-brand" style="margin-top: 20px; margin-bottom: 20px;">更多策略：<b>IN</b>tumu.com</a>
                    `;
                    // 插入到目标div后面
                    secondTargetDiv.insertAdjacentElement('afterend', newDiv);
                     }
                    else {
                    newDiv.innerHTML = `
                        <div class="text-secondary mb-0.5" style="color: blue; font-size: 14px;">30天均值</div>
                        <div class="font-bold tracking-[0.2px]" style="color: blue; font-size: 22px;">${averageValue.toFixed(3)} < ${price} 本期需减少-</div>
                       <a href="https://intumu.com/" class="navbar-brand" style="margin-top: 20px; margin-bottom: 20px;">更多策略：<b>IN</b>tumu.com</a>
                    `;
                    // 插入到目标div后面
                    secondTargetDiv.insertAdjacentElement('afterend', newDiv);
                    }
                    console.log('已插入平均值:', averageValue);
                    return true;
                } else {
                    console.error('无法解析平均数值或已插入:', averageDiv ? averageDiv.innerText : '未找到平均值div');
                }
            } else {
                console.error('未找到平均值子div');
            }
        } else {
            console.error('未找到目标元素:', {
                parentDiv: !!parentDiv,
                targetDiv: !!targetDiv
            });
        }
        return false;
    }

    // 初始尝试插入
    if (insertAverage()) return;

    // 观察DOM变化（动态加载支持）
    const observer = new MutationObserver(() => {
        if (insertAverage()) {
            observer.disconnect(); // 插入成功后停止观察
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();