// ==UserScript==
// @name         双击复制知乎/wiki中的数学公式tex
// @homepageURL  https://github.com/Lysanleo/little-piece-crisps
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      GPLv3
// @description  双击latex公式将其复制到剪切板
// @author       Lysanleo
// @match        *://*.wikipedia.org/*
// @match        *://*.wikipedia.org/*
// @match        *://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463103/%E5%8F%8C%E5%87%BB%E5%A4%8D%E5%88%B6%E7%9F%A5%E4%B9%8Ewiki%E4%B8%AD%E7%9A%84%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8Ftex.user.js
// @updateURL https://update.greasyfork.org/scripts/463103/%E5%8F%8C%E5%87%BB%E5%A4%8D%E5%88%B6%E7%9F%A5%E4%B9%8Ewiki%E4%B8%AD%E7%9A%84%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8Ftex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getAttributeName(url) {
        if (url.includes('wikipedia.org')) {
            return 'alt';
        } else if (url.includes('zhihu.com')) {
            return 'data-tex';
        }
        // Add more conditions for other websites here
    }

    function addDoubleClickHandler() {
        const attribute = getAttributeName(window.location.href);

        if (!attribute) return;

        document.querySelectorAll(`[${attribute}]`).forEach(e => e.ondblclick = () => navigator.clipboard.writeText(e.getAttribute(attribute)));
    }

    // Add event listener for when the page is loaded or changed
    document.addEventListener('DOMContentLoaded', addDoubleClickHandler);
    new MutationObserver(addDoubleClickHandler).observe(document.documentElement, {childList: true, subtree: true});
})();