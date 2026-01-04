// ==UserScript==
// @name         虚假品牌内容检测（页面边缘提示框 + 弹窗）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  检测网页中的虚假品牌内容，在页面边缘显示提示框，并弹窗一次性显示所有虚假品牌
// @author       JJYY
// @license      https://greasyfork.org/
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527622/%E8%99%9A%E5%81%87%E5%93%81%E7%89%8C%E5%86%85%E5%AE%B9%E6%A3%80%E6%B5%8B%EF%BC%88%E9%A1%B5%E9%9D%A2%E8%BE%B9%E7%BC%98%E6%8F%90%E7%A4%BA%E6%A1%86%20%2B%20%E5%BC%B9%E7%AA%97%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/527622/%E8%99%9A%E5%81%87%E5%93%81%E7%89%8C%E5%86%85%E5%AE%B9%E6%A3%80%E6%B5%8B%EF%BC%88%E9%A1%B5%E9%9D%A2%E8%BE%B9%E7%BC%98%E6%8F%90%E7%A4%BA%E6%A1%86%20%2B%20%E5%BC%B9%E7%AA%97%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义虚假品牌关键词列表
    const fakeBrands = [
        'GRISSO','格瑞索','New Health','新海思','Kicooted','凯康特','FLALIU','DDZ水蛭素','Qlane成长赖氨酸',
    ];

    // 用于存储检测到的虚假品牌
    const detectedBrands = new Set();

    // 遍历页面中的所有文本节点
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
        const text = node.nodeValue;

        // 检查文本中是否包含虚假品牌关键词
        fakeBrands.forEach(brand => {
            if (text.includes(brand)) {
                detectedBrands.add(brand); // 将检测到的品牌添加到集合中
            }
        });
    }

    // 如果有检测到虚假品牌
    if (detectedBrands.size > 0) {
        // 创建页面边缘提示框
        const warningBox = document.createElement('div');
        warningBox.style.position = 'fixed';
        warningBox.style.top = '20px';
        warningBox.style.right = '20px';
        warningBox.style.backgroundColor = '#ffebee';
        warningBox.style.border = '2px solid #ff1744';
        warningBox.style.borderRadius = '8px';
        warningBox.style.padding = '10px';
        warningBox.style.zIndex = '10000';
        warningBox.style.fontFamily = 'Arial, sans-serif';
        warningBox.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';

        // 创建提示框标题
        const title = document.createElement('h3');
        title.textContent = '⚠️ 检测到虚假品牌';
        title.style.color = '#d32f2f';
        title.style.margin = '0 0 10px 0';
        warningBox.appendChild(title);

        // 创建品牌列表
        const list = document.createElement('ul');
        list.style.margin = '0';
        list.style.paddingLeft = '20px';
        detectedBrands.forEach(brand => {
            const item = document.createElement('li');
            item.textContent = brand;
            item.style.color = '#d32f2f';
            list.appendChild(item);
        });
        warningBox.appendChild(list);

        // 将提示框添加到页面中
        document.body.appendChild(warningBox);

        // 创建弹窗提示
        const alertMessage = `检测到以下虚假品牌：\n${Array.from(detectedBrands).join('\n')}`;
        alert(alertMessage); // 弹窗显示所有虚假品牌
    }
})();
