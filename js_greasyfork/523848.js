// ==UserScript==
// @name         Alibaba阿里国际站自动显示产品关键词/标题首字母大写-公众号：玩转阿里国际站
// @namespace    https://qianpuyun.com/
// @version      2.3
// @description  阿里巴巴国际站快速显示产品关键词/标题首字母大写| 所有功能仅供个人学习研究使用，禁止用于非法用途
// @author       Jason
// @match        https://www.alibaba.com/product-detail/*
// @icon         https://www.alibaba.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523848/Alibaba%E9%98%BF%E9%87%8C%E5%9B%BD%E9%99%85%E7%AB%99%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E4%BA%A7%E5%93%81%E5%85%B3%E9%94%AE%E8%AF%8D%E6%A0%87%E9%A2%98%E9%A6%96%E5%AD%97%E6%AF%8D%E5%A4%A7%E5%86%99-%E5%85%AC%E4%BC%97%E5%8F%B7%EF%BC%9A%E7%8E%A9%E8%BD%AC%E9%98%BF%E9%87%8C%E5%9B%BD%E9%99%85%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/523848/Alibaba%E9%98%BF%E9%87%8C%E5%9B%BD%E9%99%85%E7%AB%99%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E4%BA%A7%E5%93%81%E5%85%B3%E9%94%AE%E8%AF%8D%E6%A0%87%E9%A2%98%E9%A6%96%E5%AD%97%E6%AF%8D%E5%A4%A7%E5%86%99-%E5%85%AC%E4%BC%97%E5%8F%B7%EF%BC%9A%E7%8E%A9%E8%BD%AC%E9%98%BF%E9%87%8C%E5%9B%BD%E9%99%85%E7%AB%99.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 主函数，提取标题和关键词并显示在页面指定位置
    function fetchAndDisplayContent() {
        const content = extractContent();

        // 创建显示容器
        const contentDiv = document.createElement('div');
        contentDiv.style.padding = '10px';
        contentDiv.style.margin = '10px 0';
        contentDiv.style.backgroundColor = '#f9f9f9';
        contentDiv.style.border = '1px solid #ddd';
        contentDiv.style.borderRadius = '5px';

        // 添加公众号链接
        const publicAccountLink = document.createElement('div');
        publicAccountLink.innerHTML = `<a href="https://qianpuyun.com/" target="_blank" style="color: blue; text-decoration: none; font-weight: bold;">公众号-玩转阿里国际站</a>`;
        publicAccountLink.style.marginBottom = '10px';
        contentDiv.appendChild(publicAccountLink);

        // 添加标题
        const titleHeader = document.createElement('h3');
        titleHeader.textContent = '首字母大写产品标题:';
        titleHeader.style.fontSize = '16px';
        titleHeader.style.marginBottom = '10px';
        contentDiv.appendChild(titleHeader);

        const titleContent = document.createElement('div');
        titleContent.style.marginBottom = '10px';
        titleContent.innerHTML = `<strong>${content.productTitle}</strong>`;
        contentDiv.appendChild(titleContent);

        // 添加关键词标题
        const keywordHeader = document.createElement('h3');
        keywordHeader.textContent = '产品关键词:';
        keywordHeader.style.fontSize = '16px';
        keywordHeader.style.marginBottom = '10px';
        contentDiv.appendChild(keywordHeader);

        // 添加关键词内容
        const keywordContent = document.createElement('div');
        keywordContent.innerHTML = content.keywordContent;
        contentDiv.appendChild(keywordContent);

        // 查找指定模块并插入显示容器
        const moduleCompanyElement = document.querySelector('[data-module-name="module_company"]');
        if (moduleCompanyElement) {
            moduleCompanyElement.appendChild(contentDiv);
        } else {
            console.log('未找到指定的模块元素: data-module-name="module_company"');
        }
    }

    // 提取页面中的标题和关键词
    function extractContent() {
        const keywordsMeta = document.querySelector('meta[name="keywords"]');
        const titleElement = document.querySelector('title');
        let keywords = '';
        let productTitle = '未知产品标题';

        if (titleElement) {
            const fullTitle = titleElement.textContent;
            const splitIndex = fullTitle.indexOf(' - Buy');
            if (splitIndex !== -1) {
                productTitle = fullTitle.substring(0, splitIndex).trim();
            } else {
                productTitle = fullTitle.trim();
            }
        }

        if (keywordsMeta) {
            keywords = keywordsMeta.getAttribute('content');
        }

        if (keywords) {
            // 删除标题部分和 "Product on Alibaba.com"
            const titleIndex = keywords.indexOf('- Buy');
            if (titleIndex !== -1) {
                keywords = keywords.substring(titleIndex + 5).trim();
            }
            const productOnIndex = keywords.indexOf('Product on Alibaba.com');
            if (productOnIndex !== -1) {
                keywords = keywords.substring(0, productOnIndex).trim();
            }

            // 解析关键词，按逗号或换行符分割，逐行显示
            const keywordArray = keywords
                .split(/,|\n/)
                .map(kw => kw.trim())
                .filter(kw => kw); // 移除空白项
            const formattedKeywords = keywordArray
                .map(
                    kw =>
                        `<div style="color: ${getRandomColor()}; font-weight: bold; margin-bottom: 5px;">${kw}</div>`
                )
                .join('');

            return {
                productTitle,
                keywordContent: formattedKeywords,
            };
        } else {
            return {
                productTitle,
                keywordContent: '<span style="color: red;">未找到关键词数据</span>',
            };
        }
    }

    // 获取随机颜色
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // 自动执行提取逻辑
    fetchAndDisplayContent();
})();
