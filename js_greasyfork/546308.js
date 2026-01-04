// ==UserScript==
// @name         淘宝首页弹窗移除脚本
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  移除淘宝首页的顶部横幅、各类红包、活动提醒及居中弹窗，还您一个清爽的购物界面。
// @author       Gemini
// @match        *://*.taobao.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546308/%E6%B7%98%E5%AE%9D%E9%A6%96%E9%A1%B5%E5%BC%B9%E7%AA%97%E7%A7%BB%E9%99%A4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/546308/%E6%B7%98%E5%AE%9D%E9%A6%96%E9%A1%B5%E5%BC%B9%E7%AA%97%E7%A7%BB%E9%99%A4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // **定义一个包含所有要移除弹窗特征的列表 (selector list)**
    const popupSelectors = [
        '[class*="index_module_redPacket"]',   // 规则1：用于移除右下角的红包弹窗
        '[class*="basic-pop-tmp1-wrapper"]',   // 规则2：用于移除顶部的活动横幅
        '[class*="RedPacketReminderWrapper"]', // 规则3：用于移除左侧的红包提醒弹窗
        '[id*="TBPC_POP_home"]',                // **规则4：更新，用于移除各类居中活动弹窗 (匹配新旧版本)**
        '[class*="custom-pop-tmp1-wrapper"]'   // **规则5：新增，用于移除另一种居中活动弹窗**
    ];

    // 创建一个通用的移除函数
    const removeMatchingElements = () => {
        for (const selector of popupSelectors) {
            // 查找所有匹配当前规则的元素
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                elements.forEach(el => {
                    // 直接移除元素
                    el.remove();
                    console.log(`淘宝弹窗 (匹配规则: ${selector}) 已成功移除。`);
                });
            }
        }
    };

    // 创建一个监视器 (MutationObserver) 实例，持续观察页面变化
    const observer = new MutationObserver(() => {
        // 当页面发生任何变化时，都调用移除函数进行检查
        removeMatchingElements();
    });

    // 配置监视器
    const config = {
        childList: true, // 监视子节点的变动
        subtree: true    // 监视所有后代节点
    };

    // 在文档根节点上启动监视，确保脚本尽早生效
    observer.observe(document.documentElement, config);

    // 在脚本加载时也立即执行一次，以处理在监视开始前就已存在的弹窗
    removeMatchingElements();

})();