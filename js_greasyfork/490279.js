// ==UserScript==
// @name         考满分gre练习册预览题目
// @version      2024-03-19
// @description  考满分gre练习册verbal预览题目
// @author       AC-Dawn
// @match        https://gre.kmf.com/profile/logs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kmf.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/950050
// @downloadURL https://update.greasyfork.org/scripts/490279/%E8%80%83%E6%BB%A1%E5%88%86gre%E7%BB%83%E4%B9%A0%E5%86%8C%E9%A2%84%E8%A7%88%E9%A2%98%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/490279/%E8%80%83%E6%BB%A1%E5%88%86gre%E7%BB%83%E4%B9%A0%E5%86%8C%E9%A2%84%E8%A7%88%E9%A2%98%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 选择原始页面中的所有标题区域
    const titleElements = document.querySelectorAll('.title');

    // 遍历所有标题元素
    titleElements.forEach(titleElement => {
        // 构建题目链接
        const titleText = titleElement.outerText.trim();
        const articleKey = titleText.split(' - ')[1];
        const articleLink = 'https://gre.kmf.com/explain/question/' + articleKey + '-0.html';

        // 获取题目内容
        fetch(articleLink)
            .then(response => response.text())
            .then(html=>{
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            //题目
            const articleDiv = doc.querySelector('.content-info.js-translate-content').innerHTML;
            //选项
            const optionDiv = doc.querySelector('.fill-blank-box').innerHTML;
            //笔记
            const noteDiv = doc.querySelector('.note-cont').innerHTML;
            //拼接
            const questionDiv = articleDiv + '<br><br>' + optionDiv + '<br>' + noteDiv;
            titleElement.innerHTML = questionDiv;
        })

    });
})();
