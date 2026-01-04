// ==UserScript==
// @name         获取Card信息并重构URL并跳转
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  获取第一组class="card"中属性data-log-title的值，并使用其中的itemid以及URL中的sp_no参数值重构URL，并自动跳转。
// @author       YourName
// @match        https://aiqicha.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479846/%E8%8E%B7%E5%8F%96Card%E4%BF%A1%E6%81%AF%E5%B9%B6%E9%87%8D%E6%9E%84URL%E5%B9%B6%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/479846/%E8%8E%B7%E5%8F%96Card%E4%BF%A1%E6%81%AF%E5%B9%B6%E9%87%8D%E6%9E%84URL%E5%B9%B6%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前URL是否包含指定的字符串
    if (window.location.href.includes("https://aiqicha.baidu.com/s?q=")) {
        // 获取页面中第一组class="card"的元素
        const firstCardElement = document.querySelector('.card[data-log-title]');

        if (firstCardElement) {
            // 获取属性data-log-title的值
            const dataLogTitle = firstCardElement.getAttribute('data-log-title');
            let itemid = '';

            // 判断dataLogTitle值中是否包含"-"
            if (dataLogTitle && dataLogTitle.includes('-')) {
                // 返回"-"后面的数据作为itemid
                itemid = dataLogTitle.split('-').pop().trim();
            }

            // 从URL中获取参数sp_no的函数
            function getQueryParam(param) {
                const urlParams = new URLSearchParams(window.location.search);
                return urlParams.get(param);
            }

            // 获取URL中的sp_no参数值
            const spNo = getQueryParam('sp_no');

            // 如果itemid和spNo都成功获取，拼接新的URL
            if (itemid && spNo) {
                const newUrl = `https://aiqicha.baidu.com/company_detail_${itemid}?sp_no=${spNo}`;
                console.log(newUrl); // 在控制台输出新URL

                // 使用window.open()在新窗口中打开新URL
                window.open(newUrl, '_blank');
            } else {
                console.error('无法获取itemid或sp_no参数值');
            }
        } else {
            console.error('没有找到class="card"的元素');
        }
    }
})();
