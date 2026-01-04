// ==UserScript==
// @name         自动获取每日microsoft reward（通过一次性搜索三十六天罡）
// @name:en      Automatically earn daily Microsoft Rewards points(a one-time search for the Thirty Six Sky Gang)
// @namespace    Bing36DaysStars
// @version      5
// @description  在 Bing 页面上添加一个圆形图标，点击后自动搜索每个三十六天罡，并在搜索完毕后等待15秒后关闭所有搜索页。在 cn.bing.com 也能显示按钮。（代码主体由ChatGPT编写）
// @description:en  Add a circular icon on the Bing page, which automatically searches for each of the 36 Heavenly Spirits when clicked. After the search is complete, wait for 15 seconds and close all search pages. The button also appear on cn.bing.com.（The main body of the code was written by ChatGPT）
// @author       Potaper
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @grant        none
// @license           AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/462162/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E6%AF%8F%E6%97%A5microsoft%20reward%EF%BC%88%E9%80%9A%E8%BF%87%E4%B8%80%E6%AC%A1%E6%80%A7%E6%90%9C%E7%B4%A2%E4%B8%89%E5%8D%81%E5%85%AD%E5%A4%A9%E7%BD%A1%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/462162/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E6%AF%8F%E6%97%A5microsoft%20reward%EF%BC%88%E9%80%9A%E8%BF%87%E4%B8%80%E6%AC%A1%E6%80%A7%E6%90%9C%E7%B4%A2%E4%B8%89%E5%8D%81%E5%85%AD%E5%A4%A9%E7%BD%A1%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个元素来表示圆形图标
    const icon = document.createElement('div');
    icon.style.position = 'fixed';
    icon.style.top = '90px';
    icon.style.left = '20px';
    icon.style.width = '30px';
    icon.style.height = '30px';
    icon.style.borderRadius = '50%';
    icon.style.backgroundColor = 'rgba(255, 192, 203, 0.6)';
    icon.style.cursor = 'pointer';
    icon.title = '搜索三十六天罡';

    // 点击图标时搜索每个三十六天罡
    icon.addEventListener('click', function() {
        const stars = [
            '角木蛟', '亢金龙', '氐土貉', '房日兔', '心月狐', '尾火虎',
            '箕水豹', '斗木獬', '牛金牛', '女土蝠', '虚日鼠', '危月燕',
            '室火猪', '壁水獝', '奎木狼', '娄金狗', '胃土雉', '昂日鸡',
            '毕月乌', '觜火猴', '参水猿', '井木犴', '鬼金羊', '柳土獐',
            '星日马', '张月鹿', '翼火蛇', '轸水蚓', '女木猱', '角金蝉',
        ];

        const pages = [];

        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            const page = window.open(`https://cn.bing.com/search?q=${encodeURIComponent(star)}+三十六天罡`);
            pages.push(page);
        }

        // 等待15秒后关闭所有搜索页
        setTimeout(function() {
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                if (!page.closed) {
                    page.close();
                }
            }
        }, 15000);
    });

    // 检测当前页面是否为 Bing
    const isBingPage = window.location.hostname === 'www.bing.com' || window.location.hostname === 'cn.bing.com';
    if (isBingPage) {
        // 在页面的左上角添加图标
         document.body.appendChild(icon);
    }
})();


