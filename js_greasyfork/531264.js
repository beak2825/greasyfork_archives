// ==UserScript==
// @name         Hide Some Ads
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide some ads on online-fix.me
// @match        https://online-fix.me/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531264/Hide%20Some%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/531264/Hide%20Some%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideAds() {
        let adElements = document.querySelectorAll('.no-pop');
        adElements.forEach(element => {
            element.style.display = 'none';
        });

        let adBlockElement = document.querySelector('#dle-content > div > article > div.full-story-header.wide-block.clr');
        if (adBlockElement) {
            let childNodes = adBlockElement.childNodes;
            for (let node of childNodes) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().includes("РЕКЛАМНЫЙ БЛОК:")) {
                    node.textContent = '';
                    break;
                }
            }
        }

        let sidebarBlocks = document.querySelectorAll('.sidebar-block');
        sidebarBlocks.forEach(block => {
            if (block.textContent.includes("Если Вы хотите поддержать проект") ||
                block.textContent.includes("If you want to support the project")) {
                block.style.display = 'none';
            }
        });

        let adPlayerElements = document.querySelectorAll('div[data-ad-player]');
        adPlayerElements.forEach(element => {
            element.style.display = 'none';
        });


        let articleElement = document.querySelector('div.article.fixed.clr');
        if (articleElement) {
            let parentArticle = articleElement.closest('article');
            if (parentArticle) {
                parentArticle.style.display = 'none';
            }
        }
    }

    hideAds();

    let observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                hideAds();
            }
        }
    });
    observer.observe(document.body, {childList: true, subtree: true});
})();
