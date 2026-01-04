// ==UserScript==
// @name         精准删除 Highcharts/AmCharts 水印 - 17kqh.com
// @namespace    http://www.acornsemi.com/
// @version      1.8
// @description  删除 Highcharts 和 AmCharts 图表中的水印（如“一起看期货” 和 “17kqh.com”）
// @author       Jessy Tang
// @match        *://*.17kqh.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538448/%E7%B2%BE%E5%87%86%E5%88%A0%E9%99%A4%20HighchartsAmCharts%20%E6%B0%B4%E5%8D%B0%20-%2017kqhcom.user.js
// @updateURL https://update.greasyfork.org/scripts/538448/%E7%B2%BE%E5%87%86%E5%88%A0%E9%99%A4%20HighchartsAmCharts%20%E6%B0%B4%E5%8D%B0%20-%2017kqhcom.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 禁用 Highcharts 默认版权信息
    if (typeof Highcharts !== 'undefined') {
        Highcharts.setOptions({
            credits: {
                enabled: false
            }
        });
    }

    // 定义目标水印文本
    const targetTexts = [
        "一起看期货 ( www.17kqh.com ) - 持仓建仓分析",
        "一起看期货 ( www.17kqh.com ) - 持仓建仓分析网",
        "17kqh.com"
    ];

    // 查找并删除水印
    function removeWatermark() {
        // 支持的标签类型
        const tagNames = ['text', 'tspan', 'div', 'span'];

        tagNames.forEach(tag => {
            document.querySelectorAll(tag).forEach(el => {
                // 精准匹配目标文本
                if (targetTexts.some(text => el.textContent === text)) {
                    el.remove();
                    console.log(`✅ 已删除水印: ${el.textContent}`);
                }
            });
        });
    }

    // 延迟执行确保图表加载完成
    setTimeout(() => {
        removeWatermark();

        // 监听 DOM 变化，动态删除水印
        const observer = new MutationObserver(() => {
            removeWatermark();
        });

        // 限制监听范围为图表容器（可选）
        const chartContainer = document.querySelector("body") || document.documentElement;
        observer.observe(chartContainer, {
            childList: true,
            subtree: true
        });
    }, 2000);
})();