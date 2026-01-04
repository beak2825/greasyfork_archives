// ==UserScript==
// @name         Gelbooru Favorites Checker
// @namespace    https://gelbooru.com/
// @version      1.4
// @description  Highlights favorited images in the search results by checking without opening the images themselves. 
// @author       Du
// @match        https://gelbooru.com/index.php?page=post&s=list*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539297/Gelbooru%20Favorites%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/539297/Gelbooru%20Favorites%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PARALLEL_BATCH_SIZE = 6;
    const BATCH_DELAY = 80; // ms zwischen Batches, damit Server nicht zu stark belastet wird

    console.log('[GFC] Gelbooru Favorite Checker gestartet.');

    // Warte, bis die Thumbnails da sind
    function waitForThumbnails(callback, retries = 20) {
        const images = document.querySelectorAll('a[href*="index.php?page=post&s=view&id="] > img');
        if (images.length > 0) {
            callback(images);
        } else if (retries > 0) {
            setTimeout(() => waitForThumbnails(callback, retries - 1), 500);
        } else {
            console.warn('[GFC] Keine Thumbnails gefunden – sogar nach Wartezeit.');
        }
    }

    // Einzelbildseite abrufen und prüfen, ob "Unfavorite" sichtbar ist
    function checkIfFavorited(imageId) {
        return fetch(`https://gelbooru.com/index.php?page=post&s=view&id=${imageId}`, {
            credentials: 'include'
        })
        .then(res => res.text())
        .then(html => {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const unfav = Array.from(doc.querySelectorAll('a')).find(a => a.textContent.trim() === 'Unfavorite');
            return !!unfav;
        })
        .catch(err => {
            console.error(`[GFC] Fehler bei Bild ${imageId}:`, err);
            return false;
        });
    }

    // Visualisierung am Thumbnail-Link
    function markAsFavorite(link) {
        const overlay = document.createElement('div');
        overlay.textContent = '❤';
        overlay.style.position = 'absolute';
        overlay.style.top = '3px';
        overlay.style.right = '3px';
        overlay.style.background = 'rgba(255, 105, 180, 0.8)';
        overlay.style.color = 'white';
        overlay.style.padding = '2px 6px';
        overlay.style.borderRadius = '6px';
        overlay.style.fontSize = '14px';
        overlay.style.zIndex = '999';
        overlay.style.pointerEvents = 'none';
        link.style.position = 'relative';
        link.appendChild(overlay);
    }

    // Prozesse in Batches von 4 gleichzeitig
    async function processInBatches(imageLinkPairs) {
        for (let i = 0; i < imageLinkPairs.length; i += PARALLEL_BATCH_SIZE) {
            const batch = imageLinkPairs.slice(i, i + PARALLEL_BATCH_SIZE);

            const promises = batch.map(async ({ id, link }) => {
                const isFav = await checkIfFavorited(id);
                if (isFav) {
                    console.log(`[GFC] Bild ${id} ist Favorit.`);
                    markAsFavorite(link);
                } else {
                    console.log(`[GFC] Bild ${id} ist nicht favorisiert.`);
                }
            });

            await Promise.all(promises);
            if (i + PARALLEL_BATCH_SIZE < imageLinkPairs.length) {
                await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
            }
        }
    }

    // Startvorgang
    waitForThumbnails((images) => {
        const links = Array.from(images).map(img => img.closest('a'));
        const imageLinkPairs = links
            .map(link => {
                const match = link.href.match(/id=(\d+)/);
                return match ? { id: match[1], link } : null;
            })
            .filter(Boolean);

        console.log(`[GFC] ${imageLinkPairs.length} Bilder gefunden. Prüfe Favoritenstatus in 4er-Gruppen...`);

        processInBatches(imageLinkPairs);
    });

})();
