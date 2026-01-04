// ==UserScript==
// @name         MyDealz absolute Dealerstellungszeit
// @description  ergänzt hinter "Gepostet vor X Std." in Klammern die absolute Zeit "(06.02. 21:25)"
// @version      1.0
// @match        https://www.mydealz.de/deals*
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1419623
// @downloadURL https://update.greasyfork.org/scripts/526123/MyDealz%20absolute%20Dealerstellungszeit.user.js
// @updateURL https://update.greasyfork.org/scripts/526123/MyDealz%20absolute%20Dealerstellungszeit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function formatTimestamp(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);
        return `(${String(date.getDate()).padStart(2,'0')}.${String(date.getMonth()+1).padStart(2,'0')}. ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')})`;
    }

    function processArticle(article) {
        // Prüfen ob Artikel bereits verarbeitet wurde
        if (article.dataset.timestampProcessed) return;

        try {
            const vueData = article.querySelector('.js-vue2[data-vue2]');
            if (!vueData) return;

            const vueDataString = vueData.getAttribute('data-vue2');
            const data = JSON.parse(vueDataString);
            const publishedAt = data?.props?.thread?.publishedAt;

            if (!publishedAt) return;

            const timeBox = article.querySelector('.threadListCard-header');
            if (!timeBox) return;

            const timeSpan = document.createElement('div');
            timeSpan.className = 'size--all-s space--mt-1 color--gray';
            timeSpan.textContent = formatTimestamp(publishedAt);
            timeBox.appendChild(timeSpan);

            // Artikel als verarbeitet markieren
            article.dataset.timestampProcessed = 'true';

        } catch (e) {
            console.debug('Fehler:', e);
        }
    }

    function processAllArticles() {
        const articles = document.querySelectorAll('article.thread.cept-thread-item');
        articles.forEach(processArticle);
    }

    // Initial alle Artikel verarbeiten
    processAllArticles();

    // Observer für neue Artikel durch Endlos-Scrollen
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.matches && node.matches('article.thread.cept-thread-item')) {
                        processArticle(node);
                    }
                });
            }
        });
    });

    // Observer starten
    observer.observe(document.querySelector('.js-threadList'), {
        childList: true,
        subtree: true
    });
})();
