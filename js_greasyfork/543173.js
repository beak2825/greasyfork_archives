// ==UserScript==
// @name         Feedly - Always Open Source Article
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make all clickable parts of a Feedly post go directly to the source article
// @author       djh816
// @match        https://feedly.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543173/Feedly%20-%20Always%20Open%20Source%20Article.user.js
// @updateURL https://update.greasyfork.org/scripts/543173/Feedly%20-%20Always%20Open%20Source%20Article.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const processArticles = () => {
        document.querySelectorAll('article.entry').forEach(article => {
            if (article.dataset.modified === "true") return;

            const sourceLink = article.querySelector('a.EntryTitleLink');
            if (!sourceLink) return;

            const url = sourceLink.href;

            // Add click override to the image and other non-title parts
            const targets = article.querySelectorAll('.SelectedEntryScroller, .TPNUeKsmp3A7x9hGrZqv');

            targets.forEach(el => {
                el.style.cursor = 'pointer';
                el.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(url, '_blank');
                }, { once: true }); // add once to avoid multiple bindings
            });

            article.dataset.modified = "true"; // prevent reprocessing
        });
    };

    const observer = new MutationObserver(processArticles);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    processArticles();
})();