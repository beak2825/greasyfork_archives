// ==UserScript==
// @name         亚马逊标题显示（shopthelook页面）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add a button to the page; clicking it extracts all ASIN values, combines them with Amazon product URL, displays for easy copying, and auto-closes the display on copy. Also adds a function to extract titles from linked pages and display them on the original page.
// @author       You
// @match        https://www.amazon.com/s?k=*
// @match        https://www.amazon.com/gp/bestsellers/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.com/shopthelook?q=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505553/%E4%BA%9A%E9%A9%AC%E9%80%8A%E6%A0%87%E9%A2%98%E6%98%BE%E7%A4%BA%EF%BC%88shopthelook%E9%A1%B5%E9%9D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/505553/%E4%BA%9A%E9%A9%AC%E9%80%8A%E6%A0%87%E9%A2%98%E6%98%BE%E7%A4%BA%EF%BC%88shopthelook%E9%A1%B5%E9%9D%A2%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 提取标题并更新页面的函数
    async function updatePageWithTitles() {
        const targetElements = document.querySelectorAll('#product_grid_container > div > section > article');
        for (const element of targetElements) {
            const linkElement = element.querySelector('a');
            if (linkElement && linkElement.href) {
                try {
                    const response = await fetch(linkElement.href);
                    const text = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');
                    const titleElement = doc.querySelector('#productTitle');
                    if (titleElement && titleElement.textContent) {
                        const span = document.createElement('span');
                        span.textContent = titleElement.textContent;
                        linkElement.appendChild(span);
                    }
                } catch (error) {
                    console.error(`Error fetching title for ${linkElement.href}: ${error}`);
                }
            }
        }
    }

    // 在页面加载或刷新时执行标题提取和更新
    window.addEventListener('load', async () => {
        if (window.location.href.includes('https://www.amazon.com/shopthelook?q=*')) {
            await updatePageWithTitles();
        }
    });
})();