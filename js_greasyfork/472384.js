// ==UserScript==
// @name         Add a quick jump link to arXiv
// @namespace    http://github.com/awyugan
// @version      0.2.1
// @description  Embed OpenReview link with arXiv paper title in the arXiv paper page
// @author       awyugan
// @match        https://arxiv.org/abs/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472384/Add%20a%20quick%20jump%20link%20to%20arXiv.user.js
// @updateURL https://update.greasyfork.org/scripts/472384/Add%20a%20quick%20jump%20link%20to%20arXiv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取 arXiv 页面中的论文标题
    let titleElement = document.querySelector('h1.title.mathjax');
    if (titleElement) {
        let titleText = titleElement.textContent.replace('Title:', '').trim();

        // 创建 openreview 的链接
        let openreviewLink = createLink('https://openreview.net/search?term=', titleText, 'Open in openreview\n');

        // 创建 hn.algolia 的链接
        let algoliaLink = createLink('https://hn.algolia.com/?q=', titleText, 'Search on hn.algolia\n');

        // 创建 paperswithcode 的链接
        let papersWithCodeLink = createLink('https://paperswithcode.com/search?q_meta=&q_type=&q=', titleText, 'Search on Papers with Code\n');

        // 创建 hugging face 的链接
        let huggingfaceLink = createLink('https://huggingface.co/search/full-text?q=', titleText, 'Search on hugging face\n');

        // 查找指定的div并将链接插入其中
        let fullTextDiv = document.querySelector('div.full-text');
        if (fullTextDiv) {
            fullTextDiv.appendChild(openreviewLink);
            fullTextDiv.appendChild(algoliaLink);
            fullTextDiv.appendChild(papersWithCodeLink);
            fullTextDiv.appendChild(huggingfaceLink);
        }
    }

    // 辅助函数，用于创建链接
    function createLink(baseURL, query, text) {
        let link = document.createElement('a');
        link.href = baseURL + encodeURIComponent(query);
        link.target = '_blank';
        link.innerText = text;
        link.style.display = 'block';
        return link;
    }
})();
