// ==UserScript==
// @name         mydealz Deal Update und 3M Indicator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Färbt den Dealbilderhintergrund anhand der erfolgten Updates ein und hebt alte Deals hervor
// @author       MD928835
// @license      MIT
// @match        https://www.mydealz.de/profile/*/deals*
// @match        https://www.mydealz.de/search/deals*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/536381/mydealz%20Deal%20Update%20und%203M%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/536381/mydealz%20Deal%20Update%20und%203M%20Indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const UPDATE_QUERY = `query getThread($filter: IDFilter!) {
        thread(threadId: $filter) {
            threadUpdates {
                createdAt
            }
        }
    }`;

    async function fetchThreadUpdates(threadId) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://www.mydealz.de/graphql',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ query: UPDATE_QUERY, variables: { filter: { eq: threadId } } }),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        resolve(result.data?.thread?.threadUpdates || []);
                    } catch (e) {
                        console.error('Error parsing GraphQL response', e, response.responseText);
                        resolve([]);
                    }
                },
                onerror: function(error) {
                    console.error('Error fetching updates', error);
                    resolve([]);
                }
            });
        });
    }

    function formatUpdateDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('de-DE') + ' ' +
               date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
    }

    // Behandelt publishedAt als Unix-Timestamp (Sekunden)
    function isDealOlderThan3Months(unixTimestamp) {
        if (!unixTimestamp || typeof unixTimestamp !== 'number') return false;
        const publishedDate = new Date(unixTimestamp * 1000); // Umwandlung von Sekunden in Millisekunden
        const now = new Date();
        const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
        return publishedDate < threeMonthsAgo;
    }

    async function processCard(card) {
        const article = card.closest('article.thread'); // Genauerer Selektor für den Artikel
        if (!article) {
            // console.debug('No article found for card:', card);
            return;
        }

        const threadIdMatch = article.id.match(/thread_(\d+)/);
        if (!threadIdMatch) {
            // console.debug('No threadIdMatch for article:', article.id);
            return;
        }

        const threadId = threadIdMatch[1];
        const imageContainer = card.querySelector('.threadListCard-image');
        if (!imageContainer) {
            // console.debug('No imageContainer for card:', card);
            return;
        }

        let publishedAtUnixTimestamp = null;
        const vueDataElement = article.querySelector('.js-vue2[data-vue2]');
        if (vueDataElement) {
            const vueDataString = vueDataElement.getAttribute('data-vue2');
            try {
                const data = JSON.parse(vueDataString);
                // Pfad aus dem funktionierenden Skript übernommen
                publishedAtUnixTimestamp = data?.props?.thread?.publishedAt;
            } catch (e) {
                console.error('Error parsing data-vue2 JSON for article:', article.id, e);
            }
        } else {
            // console.debug('No vueDataElement found for article:', article.id);
        }

        const updates = await fetchThreadUpdates(threadId);
        const updateCount = updates.length;
        const sortedUpdates = [...updates].sort((a, b) => b.createdAt - a.createdAt);

        imageContainer.classList.remove(
            'update-0', 'update-1', 'update-2', 'update-3', 'old-deal'
        );
        imageContainer.removeAttribute('title'); // Tooltip standardmäßig entfernen

        if (publishedAtUnixTimestamp && isDealOlderThan3Months(publishedAtUnixTimestamp)) {
            imageContainer.classList.add('old-deal');
            const publishedDateFormatted = new Date(publishedAtUnixTimestamp * 1000).toLocaleDateString('de-DE');
            imageContainer.setAttribute('title', `Veröffentlicht: ${publishedDateFormatted} (älter als 3 Monate)`);
        } else if (updateCount > 0 && updateCount <= 3) {
            imageContainer.classList.add(`update-${updateCount}`);
            const tooltipText = sortedUpdates.map(update =>
                formatUpdateDate(update.createdAt)
            ).join('\n');
            imageContainer.setAttribute('title', `Updates:\n${tooltipText}`);
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        .threadListCard-image.update-1 { background-color: #e8f5e9 !important; /* Light green */ }
        .threadListCard-image.update-2 { background-color: #fff9c4 !important; /* Light yellow */ }
        .threadListCard-image.update-3 { background-color: #ffcdd2 !important; /* Light red */ }
        .threadListCard-image.old-deal { background-color: #b3e5fc !important; /* Light blue */ }
        .threadListCard-image[title] { cursor: help; }
    `;
    document.head.appendChild(style);

    async function processAllCards() {
        const cards = document.querySelectorAll('.threadListCard');
        for (const card of cards) {
            await processCard(card);
        }
    }

    processAllCards();

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) { // ELEMENT_NODE
                    if (node.matches && node.matches('.threadListCard')) {
                        processCard(node);
                    } else {
                        const cards = node.querySelectorAll ? node.querySelectorAll('.threadListCard') : [];
                        for (const card of cards) {
                            processCard(card);
                        }
                    }
                }
            }
        }
    });

    // Beobachte den Container, in dem die Deal-Karten geladen werden, oder document.body als Fallback.
    const targetNode = document.querySelector('.js-threadList') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true });

})();
