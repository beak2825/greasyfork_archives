// ==UserScript==
// @name         亚马逊Asin提取
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
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/490998/%E4%BA%9A%E9%A9%AC%E9%80%8AAsin%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/490998/%E4%BA%9A%E9%A9%AC%E9%80%8AAsin%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建Amazon产品链接、ASIN计数和附加功能的显示元素
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

        // 显示找到的ASIN数量
        const countDisplay = document.createElement('p');
        countDisplay.textContent = `找到ASIN: ${asinLinks.length}`;
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
        copyAsinButton.textContent = '复制ASIN';
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

        // Donate button code starts here
        const donateButton = document.createElement('button');
        donateButton.textContent = '❤️赞赏';
        donateButton.style.marginTop = '0px';
        donateButton.onclick = function() {
            const donationDialog = document.createElement('div');
            donationDialog.style.position = 'fixed';
            donationDialog.style.top = '50%';
            donationDialog.style.left = '50%';
            donationDialog.style.transform = 'translate(-50%, -50%)';
            donationDialog.style.padding = '20px';
            donationDialog.style.backgroundColor = 'white';
            donationDialog.style.border = '1px solid black';
            donationDialog.style.zIndex = '10001';


            const donationText = document.createElement('p');
            donationText.innerHTML = '<strong>❤️赞赏</strong><br>工具制作由兴趣和对效率追求驱使.<br>若分享有助于您,欢迎赞赏与激励:)<br>可在备注里写上您ID.<br>weibo:amzASIN'; // 使用innerHTML来解析HTML标签
            donationDialog.appendChild(donationText);

            const donationImage = document.createElement('img');
            donationImage.src = 'https://i.ibb.co/zNbxSVN/20240327171437.jpg'; // 指定图片URL
            donationImage.style.maxWidth = '300px'; // 设置最大宽度
            donationImage.style.maxHeight = '300px'; // 设置最大高度
            donationImage.style.margin = 'auto'; // 图片自动居中
            donationDialog.appendChild(donationImage);

            // 创建一个新的div用于包裹关闭按钮，以确保它出现在图片下方
            const buttonContainer = document.createElement('div');
            buttonContainer.style.textAlign = 'center'; // 可以设置为居中
            buttonContainer.style.marginTop = '10px'; // 添加一些上边距

            // 关闭按钮
            const closeDonationDialog = document.createElement('button');
            closeDonationDialog.textContent = '下次再来❤️';
            closeDonationDialog.onclick = function() {
                donationDialog.remove();
            };
            buttonContainer.appendChild(closeDonationDialog);

            // 将按钮容器添加到对话框中
            donationDialog.appendChild(buttonContainer);


            // 添加捐赠对话框到页面
            document.body.appendChild(donationDialog);
        };

        // 添加捐赠按钮到容器

        container.appendChild(textArea);
        container.appendChild(copyButton);
        container.appendChild(copyAsinButton);
        container.appendChild(openButton);
        container.appendChild(clearButton);
        container.appendChild(closeButton);
        document.body.appendChild(container);
		container.appendChild(donateButton);
    }

    // 提取ASIN值，生成Amazon产品链接，支持分页功能的函数
    function generateAmazonLinks() {
        let gridItemRootElements = document.querySelectorAll('#gridItemRoot');
        const asinLinks = JSON.parse(localStorage.getItem('asinLinks') || '[]');
        const asins = [];

        // 如果 '#gridItemRoot' 未找到任何元素，则使用 '[data-asin]'
        if (gridItemRootElements.length === 0) {
            gridItemRootElements = document.querySelectorAll('[data-asin]');
        }

        gridItemRootElements.forEach(root => {
            // 选择元素内部的 '[data-asin]' 元素，如果 root 是 '[data-asin]'，则直接添加
            const targetElements = root.matches('[data-asin]') ? [root] : root.querySelectorAll('[data-asin]');
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


    // 创建触发Amazon链接生成的按钮
    function createExtractionButton() {
        const button = document.createElement('button');
        button.textContent = '提取Asin和链接';
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
