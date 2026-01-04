// ==UserScript==
// @name         MAL to AniList Linker
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds AniList link to MAL entries
// @author       melon
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/manga/*
// @grant        GM_xmlhttpRequest
// @connect      graphql.anilist.co
// @downloadURL https://update.greasyfork.org/scripts/541027/MAL%20to%20AniList%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/541027/MAL%20to%20AniList%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const match = window.location.pathname.match(/\/(anime|manga)\/(\d+)/);
    if (!match) return;

    const type = match[1] === 'anime' ? 'ANIME' : 'MANGA';
    const malId = parseInt(match[2], 10);

    const query = `query ($malId: Int, $type: MediaType) { Media(idMal: $malId, type: $type) { siteUrl } }`;
    const variables = { malId, type };

    GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://graphql.anilist.co',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        data: JSON.stringify({ query, variables }),
        onload: response => {
            try {
                const json = JSON.parse(response.responseText);
                const url = json?.data?.Media?.siteUrl;
                if (!url) return;

                const observer = new MutationObserver(() => {
                    const container = document.querySelector('#profileRows.pt0');
                    if (container && !container.querySelector('.anilist-button')) {
                        const favButton = container.querySelector('a');
                        if (!favButton) return;

                        // Clone and clean button content
                        const newButton = favButton.cloneNode(true);
                        newButton.href = url;
                        newButton.target = '_blank';
                        newButton.classList.add('anilist-button');

                        // Remove all child nodes (including text nodes)
                        while (newButton.firstChild) {
                            newButton.removeChild(newButton.firstChild);
                        }

                        // Add new span with correct label
                        const newSpan = document.createElement('span');
                        newSpan.textContent = 'View on AniList';
                        newButton.appendChild(newSpan);

                        favButton.parentNode.insertBefore(newButton, favButton.nextSibling);
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });

            } catch (err) {
                console.error('AniList script error:', err);
            }
        }
    });
})();
