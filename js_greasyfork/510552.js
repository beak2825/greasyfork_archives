// ==UserScript==
// @name         FC2 Market Enhancer
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Display FC2 article number on the FC2 Market page
// @license MIT
// @author       scbmark
// @icon         https://static.fc2.com/share/image/favicon.ico
// @match        https://adult.contents.fc2.com/article/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510552/FC2%20Market%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/510552/FC2%20Market%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function extractArticleNumber() {
        const url = window.location.href;
        const match = url.match(/\/article\/(\d+)/);
        return match ? match[1] : null;
    }

    function insertArticleNumber(number) {
        const ele = document.createElement('a');
        ele.href = `https://sukebei.nyaa.si/?f=0&c=0_0&q=${number}`
        ele.target = '_blank';
        ele.textContent = `FC2-PPV-${number}`;
        ele.style.padding = '5px';
        ele.style.backgroundColor = '#f0f0f0';
        ele.style.border = '1px solid #ccc';
        ele.style.marginTop = '10px';
        const article_info_block = document.querySelector('.items_article_headerInfo');
        if (article_info_block) {
            article_info_block.appendChild(ele);
        }
    }

    const articleNumber = extractArticleNumber();
    if (articleNumber) {
        insertArticleNumber(articleNumber);
    }
})();
