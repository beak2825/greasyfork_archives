// ==UserScript==
// @name         Twitter: hide promoted tweets
// @name:fr      Twitter : masque les tweets sponsorisés
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Hide promoted tweets
// @description:fr  Masque les tweets sponsorisés
// @author       Darth Obvious
// @match       *://twitter.com/*
// @match       *://*.twitter.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480598/Twitter%3A%20hide%20promoted%20tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/480598/Twitter%3A%20hide%20promoted%20tweets.meta.js
// ==/UserScript==
(function() {
    "use strict";
    let count_hidden = 0;
    const promoted_texts = ["Ad", "Promoted", "Gesponsert", "Promocionado", "Sponsorisé", "Sponsorizzato", "Promowane", "Promovido", "Реклама", "Uitgelicht", "Sponsorlu", "Promotert", "Promoveret", "Sponsrad", "Mainostettu", "Sponzorováno", "Promovat", "Ajánlott", "Προωθημένο", "Dipromosikan", "Được quảng bá", "推廣", "推广", "推薦", "推荐", "プロモーション", "프로모션", "ประชาสัมพันธ์", "प्रचारित", "বিজ্ঞাপিত", "تشہیر شدہ", "مُروَّج", "تبلیغی", "מקודם"];
    function hide_promoted(){
        // Select all <article> not processed
        const unprocessedArticles = document.querySelectorAll('article:not([data-processed])');

        // Loop on all articles
        unprocessedArticles.forEach(article => {
            article.setAttribute('data-processed', 'true');
            // Search all divs
            const divs = article.querySelectorAll('div');

            // Test if a div contains only the "promoted" text
            let containsAd = false;
            divs.forEach(div => {
                const spans = div.querySelectorAll('span');
                spans.forEach(span => {
                    if (promoted_texts.includes(span.textContent.trim())) {
                        containsAd = true;
                    }
                });
            });

            // If it looks like a promoted tweet, it's hidden
            if (containsAd) {
                article.style.display = 'none';
                count_hidden += 1;
                console.log("Promoted tweet hidden (" + count_hidden + ")");
            }
        });
    }


    // MutationObserver to observe changes in <body>
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                // Is this node a <div>?
                if (node instanceof HTMLDivElement) {
                    // Check all children of the <div> to find <article> tags
                    const articlesInDiv = node.querySelectorAll('article');
                    if (articlesInDiv.length > 0) {
                        hide_promoted();
                    }
                }
            });
        });
    });

    // Observer for changes in <body>
    const observerConfig = { childList: true, subtree: true };
    observer.observe(document.body, observerConfig);
})();
