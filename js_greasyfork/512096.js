// ==UserScript==
// @name         考试宝免vip查看答案解析
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2.9
// @description  隐藏“查看全部”按钮、会员购买banner，并显示答案解析内容
// @author       DoraeYaki
// @match        *://www.kaoshibao.com/*
// @icon         https://resource.zaixiankaoshi.com/pc/favicon.ico?1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512096/%E8%80%83%E8%AF%95%E5%AE%9D%E5%85%8Dvip%E6%9F%A5%E7%9C%8B%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/512096/%E8%80%83%E8%AF%95%E5%AE%9D%E5%85%8Dvip%E6%9F%A5%E7%9C%8B%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个观察者来监控 DOM 的变化
    const observer = new MutationObserver(() => {
        // 移除“查看全部”按钮
        const viewAllButton = document.querySelector('#body > div.middle-container.bj-eee:nth-child(2) > div.layout-container.prative-page:first-child > div.clearfix:last-child > div.layout-left.pull-left.lianxi-left:first-child > div > div.answer-box:last-child > div.answer-box-detail:last-child > div.mb16:first-child > div.answer-analysis-row.hide-height:nth-child(2) > button.el-button.el-button--warning.el-button--mini:last-child');
        if (viewAllButton) {
            console.log('找到“查看全部”按钮，正在移除');
            viewAllButton.remove();
        }

        // 移除广告 banner
        const vipBanner = document.querySelector('#body > div.middle-container.bj-eee:nth-child(2) > div.layout-container.prative-page:first-child > div.clearfix:last-child > div.layout-left.pull-left.lianxi-left:first-child > div > div.vip-quanyi:nth-child(2)');
        if (vipBanner) {
            console.log('找到广告 banner，正在移除');
            vipBanner.remove();
        }

        // 修改答案解析的类名
        const answerAnalysis = document.querySelectorAll('p.answer-analysis');
        answerAnalysis.forEach(function(elem) {
            elem.className = 'answer'; // 修改类名，使解析内容可见
        });
    });

    // 持续监控整个文档的变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始修改答案解析的类名
    const initialAnswerAnalysis = document.querySelectorAll('p.answer-analysis');
    initialAnswerAnalysis.forEach(function(elem) {
        elem.className = 'answer'; // 修改类名，使解析内容可见
    });
})();