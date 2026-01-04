// ==UserScript==
// @name         arXiv Clean Reader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Remove the top navigation bar, beta tag, and bottom right feedback prompt from the arXiv HTML article.
// @author       Naive
// @match        https://arxiv.org/html/*
// @match        https://arxiv.org/abs/*
// @icon         https://arxiv.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529901/arXiv%20Clean%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/529901/arXiv%20Clean%20Reader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cleanPage() {
        // header
        const header = document.querySelector('header');
        if (header) header.remove();

        // beta
        const observer = new MutationObserver(() => {
            const existingStyle = document.querySelector('style#custom-remove-after');
            if (!existingStyle) {
                const style = document.createElement('style');
                style.id = 'custom-remove-after';
                style.textContent = 'body::after { content: none !important; }';
                document.head.appendChild(style);
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });

        // feedback
        const feedbackDiv = document.querySelector('#openForm');
        if (feedbackDiv) feedbackDiv.remove();

        //const footer = document.querySelector('footer');
        //if (footer) footer.remove();

        const mainContent = document.querySelector('.ltx_page_main');
        if (mainContent) {
            mainContent.style.marginTop = '0';
            mainContent.style.paddingTop = '20px';
        }
    }

    const observer = new MutationObserver((mutations) => {
        cleanPage();
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // initial
    cleanPage();

    // resize
    window.addEventListener('resize', cleanPage);
})();