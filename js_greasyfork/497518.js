// ==UserScript==
// @name         JAVlibrary磁力搜索
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  JAVlibrary磁力搜索，搜索引擎为btdigg与16magnet
// @author       xhj，chatGPT
// @match        http://www.javlibrary.com/*
// @match        https://www.javlibrary.com/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/497518/JAVlibrary%E7%A3%81%E5%8A%9B%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/497518/JAVlibrary%E7%A3%81%E5%8A%9B%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 XPath 获取元素
    function getElementByXPath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // 定义 XPath
    const xpath = '/html/body/div[3]/div[2]/table/tbody/tr/td[2]/div/div[1]/table/tbody/tr/td[2]';

    // 获取包含文字的<td>元素
    const textElement = getElementByXPath(xpath);
    if (!textElement) {
        console.log('未找到指定的<td>元素');
        return;
    }

    // 获取文字内容
    const textContent = textElement.textContent.trim();
    console.log('获取的文字:', textContent);

    // 创建按钮元素
    const createButton = (label, url) => {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.marginLeft = '5px';
        button.addEventListener('click', () => {
            window.open(url, '_blank');
        });
        return button;
    };

    // 生成搜索URL
    const url1 = `https://btdig.com/search?q=${encodeURIComponent(textContent)}`;
    const url2 = `https://16mag.net/search?q=${encodeURIComponent(textContent)}`;

    // 创建按钮
    const button1 = createButton('搜索BTDig', url1);
    const button2 = createButton('搜索16Mag', url2);

    // 将按钮添加到表格后面
    const tableElement = textElement.closest('table');
    if (tableElement) {
        tableElement.after(button1, button2);
    } else {
        console.log('未找到包含表格的父元素');
    }
})();
