// ==UserScript==
// @name         Pocket View Original/Pocket查看原文避免重定向
// @namespace    http://tampermonkey.net/
// @author       2niuhe
// @version      1.1.4
// @description  getpocket website view original pocket网站直接查看原文避免重定向
// @match        *://getpocket.com/*/saves
// @match        *://getpocket.com/saves
// @match        *://getpocket.com/saves*
// @match        *://getpocket.com/*/saves*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getpocket.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463580/Pocket%20View%20OriginalPocket%E6%9F%A5%E7%9C%8B%E5%8E%9F%E6%96%87%E9%81%BF%E5%85%8D%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/463580/Pocket%20View%20OriginalPocket%E6%9F%A5%E7%9C%8B%E5%8E%9F%E6%96%87%E9%81%BF%E5%85%8D%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

let globalOriginalText = 'View Original';

(function() {
    'use strict';
    if (window.location.href.includes('/zh/')) {
        globalOriginalText = '查看原始文档';
    }
    setInterval(()=>{execute();}, 3000);
})();

function execute() {
    // Select all the articles on the page
    const articles = document.querySelectorAll('article');

    // Loop through each article
    articles.forEach(article => {
        // Get the span, div, and a tags for the original href attribute
        const originalHrefElements = article.querySelectorAll('span div a');

        // Get the footer, cite, div, and a tags for the new href attribute
        const newHrefElement = article.querySelector('footer cite div a');

        // If the original href elements and the new href element exist, modify the href attribute
        if(originalHrefElements && newHrefElement){
            originalHrefElements.forEach(
                element => {
                    if (typeof element.href === 'string' && !element.href.startsWith('https://getpocket.com')) {
                        return;
                    }
                    element.rel = 'noopener noreferrer';
                    element.target = '_blank';
                    element.href = newHrefElement.href;
                     // Add a new child element to the original href element
                    const viewOriginal = document.createElement('span');
                    viewOriginal.className = 'view-original';
                    viewOriginal.setAttribute('data-cy', 'view-original');

                    const viewOriginalText = document.createElement('span');
                    viewOriginalText.className = 'view-original-text';
                    viewOriginalText.innerText = globalOriginalText;

                    const viewOriginalIcon = document.createElement('span');
                    viewOriginalIcon.className = 'i1qqph0t icon';

                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('fill', 'currentColor');
                    svg.setAttribute('viewBox', '0 0 24 24');
                    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    svg.setAttribute('aria-hidden', 'true');

                    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path1.setAttribute('fill-rule', 'evenodd');
                    path1.setAttribute('clip-rule', 'evenodd');
                    path1.setAttribute('d', 'M6 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3a1 1 0 1 1 2 0v3a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h3a1 1 0 0 1 0 2H6Z');

                    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path2.setAttribute('fill-rule', 'evenodd');
                    path2.setAttribute('clip-rule', 'evenodd');
                    path2.setAttribute('d', 'M13 3a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0V5.414l-7.293 7.293a1 1 0 0 1-1.414-1.414L18.586 4H14a1 1 0 0 1-1-1Z');

                    svg.appendChild(path1);
                    svg.appendChild(path2);
                    viewOriginalIcon.appendChild(svg);

                    viewOriginal.appendChild(viewOriginalText);
                    viewOriginal.appendChild(viewOriginalIcon);

                    element.appendChild(viewOriginal);
            });
        }
    });
}

