// ==UserScript==
// @name         mydealz Deal Update Indicator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Färbt den Dealbilderhintergrund anhand der erfolgten Updates ein
// @author       MD928835
// @license      MIT 
// @match        https://www.mydealz.de/profile/*/deals*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/531259/mydealz%20Deal%20Update%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/531259/mydealz%20Deal%20Update%20Indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // GraphQL query to fetch thread updates
    const UPDATE_QUERY = `query getThread($filter: IDFilter!) {
        thread(threadId: $filter) {
            threadUpdates {
                createdAt
            }
        }
    }`;

    // Function to fetch updates for a thread
    async function fetchThreadUpdates(threadId) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://www.mydealz.de/graphql',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    query: UPDATE_QUERY,
                    variables: { filter: { eq: threadId } }
                }),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        resolve(result.data?.thread?.threadUpdates || []);
                    } catch (e) {
                        console.error('Error parsing response', e);
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

    // Format date for display
    function formatUpdateDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('de-DE') + ' ' +
               date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
    }

    // Process each thread card
    async function processCard(card) {
        const article = card.closest('article');
        if (!article) return;

        const threadIdMatch = article.id.match(/thread_(\d+)/);
        if (!threadIdMatch) return;

        const threadId = threadIdMatch[1];
        const imageContainer = card.querySelector('.threadListCard-image');
        if (!imageContainer) return;

        // Fetch updates for this thread
        const updates = await fetchThreadUpdates(threadId);
        const updateCount = updates.length;

        // Sort updates by date (newest first)
        const sortedUpdates = [...updates].sort((a, b) => b.createdAt - a.createdAt);

        // Remove existing classes
        imageContainer.classList.remove(
            'update-0', 'update-1', 'update-2', 'update-3'
        );

        // Add appropriate class based on update count
        if (updateCount > 0 && updateCount <= 3) {
            imageContainer.classList.add(`update-${updateCount}`);

            // Add tooltip with update dates
            if (updateCount > 0) {
                const tooltipText = sortedUpdates.map(update =>
                    formatUpdateDate(update.createdAt)
                ).join('\n');

                imageContainer.setAttribute('title', `Updates:\n${tooltipText}`);
            }
        }
    }

    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .threadListCard-image.update-1 {
            background-color: #e8f5e9 !important; /* Light green */
        }

        .threadListCard-image.update-2 {
            background-color: #fff9c4 !important; /* Light yellow */
        }

        .threadListCard-image.update-3 {
            background-color: #ffcdd2 !important; /* Light red */
        }

        .threadListCard-image[title] {
            cursor: help;
        }
    `;
    document.head.appendChild(style);

    // Process all cards on page load
    async function processAllCards() {
        const cards = document.querySelectorAll('.threadListCard');
        for (const card of cards) {
            await processCard(card);
        }
    }

    // Run initially
    processAllCards();

    // Observe DOM changes for dynamic content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    const cards = node.querySelectorAll ?
                        node.querySelectorAll('.threadListCard') : [];
                    cards.forEach(processCard);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();