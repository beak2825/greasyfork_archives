// ==UserScript==
// @name         亚马逊Asin提取（二改）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a button to the page; clicking it extracts all ASIN values, combines them with Amazon product URL, displays for easy copying, and auto-closes the display on copy.
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
// @downloadURL https://update.greasyfork.org/scripts/505383/%E4%BA%9A%E9%A9%AC%E9%80%8AAsin%E6%8F%90%E5%8F%96%EF%BC%88%E4%BA%8C%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/505383/%E4%BA%9A%E9%A9%AC%E9%80%8AAsin%E6%8F%90%E5%8F%96%EF%BC%88%E4%BA%8C%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建 Amazon 产品链接、ASIN 计数和附加功能的显示元素
    function createDisplayElement(asinLinks, asins) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.padding = '10px';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid black';
        container.style.zIndex = '10000';
        container.style.overflow = 'auto';
        container.style.maxHeight = '90vh';
        container.style.maxWidth = '600px'; // 设置最大宽度

        // 显示找到的 ASIN 数量
        const countDisplay = document.createElement('p');
        countDisplay.textContent = `找到 ASIN: ${asinLinks.length}`;
        container.appendChild(countDisplay);

        const textArea = document.createElement('textarea');
        textArea.value = asinLinks.join('\n');
        textArea.rows = '20';
        textArea.cols = '50';
        textArea.style.marginTop = '10px';

        const copyButton = document.createElement('button');
        copyButton.textContent = '复制链接';
        copyButton.onclick = function() {
            textArea.select();
            document.execCommand('copy');
        };

        const copyAsinButton = document.createElement('button');
        copyAsinButton.textContent = '复制 ASIN';
        copyAsinButton.onclick = function() {
            const asinTextArea = document.createElement('textarea');
            asinTextArea.value = asins.join('\n');
            document.body.appendChild(asinTextArea);
            asinTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(asinTextArea);
        };

        const openButton = document.createElement('button');
        openButton.textContent = '打开链接';
        openButton.onclick = function() {
            asinLinks.forEach(link => window.open(link, '_blank'));
        };

        const clearButton = document.createElement('button');
        clearButton.textContent = '清空数据';
        clearButton.onclick = function() {
            localStorage.removeItem('asinLinks');
            textArea.value = '';
            countDisplay.textContent = 'ASINs found: 0';
        };

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭窗口';
        closeButton.onclick = function() {
            container.remove();
        };
        container.appendChild(closeButton);

         // 添加捐赠按钮到容器
        container.appendChild(textArea);
        container.appendChild(copyButton);
        container.appendChild(copyAsinButton);
        container.appendChild(openButton);
        container.appendChild(clearButton);
        container.appendChild(closeButton);
        document.body.appendChild(container);
    }

    // 提取 ASIN 值，生成 Amazon 产品链接，支持分页功能的函数
    function generateAmazonLinks() {
        let gridItemRootElements = document.querySelectorAll('#gridItemRoot');
        const asinLinks = JSON.parse(localStorage.getItem('asinLinks') || '[]');
        const asins = [];

        // 如果 '#gridItemRoot' 未找到任何元素，则使用 '[data-asin]'
        if (gridItemRootElements.length === 0) {
            gridItemRootElements = document.querySelectorAll('[data-asin]');
        }

        if (gridItemRootElements.length === 0) {
            const targetElements = document.querySelectorAll('#product_grid_container > div > section > article');
            targetElements.forEach(element => {
                const asinAttr = element.getAttribute('data-csa-c-item-id');
                if (asinAttr) {
                    const asin = asinAttr.split('amzn1.asin.')[1];
                    if (asin) {
                        asins.push(asin);
                        asinLinks.push(`https://www.amazon.com/gp/product/${asin}`);
                    }
                }
            });
        }

        gridItemRootElements.forEach(root => {
            // 选择元素内部的 '[data-asin]' 元素，如果 root 是 '[data-asin]'，则直接添加
            const targetElements = root.matches('[data-asin]')? [root] : root.querySelectorAll('[data-asin]');
            targetElements.forEach(element => {
                const asin = element.getAttribute('data-asin');
                if (asin) {
                    asins.push(asin);
                    if (!asinLinks.includes(`https://www.amazon.com/gp/product/${asin}`)) {
                        asinLinks.push(`https://www.amazon.com/gp/product/${asin}`);
                    }
                }
            });
        });

        localStorage.setItem('asinLinks', JSON.stringify(asinLinks));

        if (asinLinks.length > 0) {
            createDisplayElement(asinLinks, asins);
        }
    }


    // 创建触发 Amazon 链接生成的按钮
    function createExtractionButton() {
        const button = document.createElement('button');
        button.textContent = '提取 Asin 和链接';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';

        button.onclick = generateAmazonLinks;

        document.body.appendChild(button);
    }

    // 向页面添加按钮
    createExtractionButton();
})();
