// ==UserScript==
// @name         飓风矩阵数据大屏
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Modify specific elements' values with random numbers within defined ranges and replace specific text on a specific page, using MutationObserver to handle dynamic content.
// @author       You
// @match        http://jufeng.jinrikuaituan.com/dydqtshoppc/user/home*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488744/%E9%A3%93%E9%A3%8E%E7%9F%A9%E9%98%B5%E6%95%B0%E6%8D%AE%E5%A4%A7%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/488744/%E9%A3%93%E9%A3%8E%E7%9F%A9%E9%98%B5%E6%95%B0%E6%8D%AE%E5%A4%A7%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const pathsAndRanges = [

        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[1]/div[1]/div/div[1]/div[1]/i', min: 25, max: 50},
        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[1]/div[1]/div/div[1]/div[2]/i[1]', min: 1, max: 3},
        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[1]/div[1]/div/div[1]/div[3]/i', min: 10, max: 20},
        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[1]/div[1]/div/div[1]/div[4]/i', min: 5, max: 20},
        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[1]/div[2]/div/div[1]/div[1]/div[2]/em', min: 2000, max: 10000},
        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[1]/div[2]/div/div[1]/div[2]/div[2]/em', min: 3000, max: 15000},
        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[1]/div[2]/div/div[1]/div[3]/div[2]/em', min: 500, max: 1000},
        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[2]/div[2]/div/div[1]/div', min: 1000000, max: 2000000},
        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[2]/div[2]/div/div[2]/div', min: 2000, max: 4000},
        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[2]/div[2]/div/div[3]/div', min: 3600, max: 7500},
        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[2]/div[2]/div/div[4]/div', min: 80, max: 160},
        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[2]/div[2]/div/div[5]/div', min: 1500, max: 2500},
        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[2]/div[2]/div/div[6]/div', min: 1, max: 5},
        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[2]/div[2]/div/div[7]/div', min: 200, max: 500},
        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[3]/div/div/div[1]/div[1]/div[2]/span', min: 500, max: 1000},
        {xpath: '//*[@id="content"]/div[3]/div/div/div/main/div/div[3]/div/div/div[1]/div[6]/div[2]/span', min: 220, max: 500},
    ];


    // Special case for text replacement
    function replaceTextContent(node, searchValue, newValue) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = node.nodeValue.replace(new RegExp(searchValue, 'g'), newValue);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(child => replaceTextContent(child, searchValue, newValue));
        }
    }

    const targetElementXPath = '//*[@id="content"]/div[3]/div/div/div/main/div/div[2]/div[3]/div';
    const targetElements = document.evaluate(targetElementXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < targetElements.snapshotLength; i++) {
        const element = targetElements.snapshotItem(i);
        replaceTextContent(element, '抖去推', '飓风矩阵');
    }

    // 定义一个函数来重新应用您的所有修改
    function periodicallyModifyElements() {
        const elementsDetails = [
            {selector: '#play_total', min: 100000, max: 200000},
            {selector: '#fans_total', min: 1000, max: 2000},
            {selector: '#like_total', min: 1500, max: 3000},
            {selector: '#comment_total', min: 200, max: 450},
        ];

        elementsDetails.forEach(detail => {
            const element = document.querySelector(detail.selector);
            if (element) {
                const newValue = getRandomInt(detail.min, detail.max);
                element.innerText = newValue;
            }
        });
    }

    function updateTextToAccumulatedPlays() {
        const xpath = '//*[@id="content"]/div[3]/div/div/div/main/div/div[2]/div[2]/div/div[1]/p[1]';
        const targetElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (targetElement) {
            targetElement.textContent = "累计播放量";
        }
    }

    // 使用 setInterval 来定期执行修改，例如每5秒执行一次
    setTimeout(() => {
        periodicallyModifyElements();
        updateTextToAccumulatedPlays(); // 调用新函数修改文本
    }, 1000);

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function modifyElementValue(observer) {

        pathsAndRanges.forEach(function(item) {
            const elements = document.evaluate(item.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if(elements && (!elements.getAttribute('data-modified') || elements.innerText !== item.newValue.toString())) {
                elements.innerText = getRandomInt(item.min, item.max);
                elements.setAttribute('data-modified', true); // 标记已修改，避免重复修改
            }
        });

        textReplacements.forEach(function(item) {
            const elements = document.evaluate(item.xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < elements.snapshotLength; i++) {
                let element = elements.snapshotItem(i);
                if(element.innerText.includes(item.oldText)) {
                    element.innerText = element.innerText.replace(new RegExp(item.oldText, 'g'), item.newText);
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }



    // 修改后的 MutationObserver 初始化和配置
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                modifyElementValue();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });


    // 首次尝试修改目标元素
    modifyElementValue();
})();
