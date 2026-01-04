// ==UserScript==
// @name         Python文档双语显示（逐段翻译）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在Python官方文档中逐段显示中英双语内容
// @author       Mushroom-duck
// @match        https://docs.python.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505550/Python%E6%96%87%E6%A1%A3%E5%8F%8C%E8%AF%AD%E6%98%BE%E7%A4%BA%EF%BC%88%E9%80%90%E6%AE%B5%E7%BF%BB%E8%AF%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/505550/Python%E6%96%87%E6%A1%A3%E5%8F%8C%E8%AF%AD%E6%98%BE%E7%A4%BA%EF%BC%88%E9%80%90%E6%AE%B5%E7%BF%BB%E8%AF%91%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面URL
    const currentURL = window.location.href;
    
    if (currentURL.includes('docs.python.org/3')) {
        // 替换URL中的语言标识，获取对应的中文文档URL
        const chineseURL = currentURL.replace('docs.python.org/3', 'docs.python.org/zh-cn/3');
    
        // 使用Fetch API获取中文文档内容
        fetch(chineseURL)
            .then(response => response.text())
            .then(data => {
                // 创建一个DOM解析器，将获取的HTML字符串解析为DOM对象
                const parser = new DOMParser();
                const chineseDoc = parser.parseFromString(data, 'text/html');
    
                // 获取中文文档的主要内容
                const chineseContent = chineseDoc.querySelector('.body');
    
                // 获取当前页面的主要内容
                const englishContent = document.querySelector('.body');
    
                // 在英文内容后插入对应翻译
                const insertChineseTrans = (element) => {
                    const englishElements = englishContent.querySelectorAll(element);
                    const chineseElements = chineseContent.querySelectorAll(element);
    
                    // 遍历英文段落并插入翻译
                    englishElements.forEach((origin, index) => {
                        if (chineseElements[index]) {
                            // 创建一个新的元素，用于存放中文内容
                            const chineseTrans = document.createElement(element);
                            chineseTrans.style.color = 'green'; // 设置中文段落文字颜色
                            chineseTrans.style.background = '#edf2fa'; // 设置中文段落背景色
                            chineseTrans.innerHTML = chineseElements[index].innerHTML;
    
                            // 在当前英文段落之后插入中文段落
                            origin.insertAdjacentElement('afterend', chineseTrans);
                        }
                    })
                };
                insertChineseTrans('h1');
                insertChineseTrans('h2');
                insertChineseTrans('h3');
                insertChineseTrans('p');
            })
            .catch(error => {
                console.error('无法加载中文文档:', error);
            });
    }
})();
