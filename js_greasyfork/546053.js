// ==UserScript==
// @name         Pixiv Artwork Date Display
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Displays the artwork's date below the artwork. Compatible with infinite scroll plugins.
// @author       gemini
// @match        https://www.pixiv.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546053/Pixiv%20Artwork%20Date%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/546053/Pixiv%20Artwork%20Date%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROCESSED_ATTR = 'data-date-script-processed-v6';

    /**
     *  Adds the date to a single artwork element.
     * @param {HTMLElement} artworkLinkElement
     */
    function addDateToArtwork(artworkLinkElement) {
        const container = artworkLinkElement.closest('li');
        if (!container || container.hasAttribute(PROCESSED_ATTR)) {
            return;
        }
        container.setAttribute(PROCESSED_ATTR, 'true');

        const imgElement = artworkLinkElement.querySelector('img');
        if (!imgElement || !imgElement.src) {
            return;
        }

        const match = /\/img\/(\d{4})\/(\d{2})\/(\d{2})\//.exec(imgElement.src);
        if (match) {
            const dateText = `${match[1]}.${match[2]}.${match[3]}`;
            const imageContainerDiv = artworkLinkElement.closest('div.relative');
            const titleContainer = imageContainerDiv ? imageContainerDiv.nextElementSibling.parentElement :  container.querySelector('div:last-child');
            console.log(titleContainer)
            if (titleContainer && !titleContainer.querySelector('.artwork-upload-date')) {
                const dateElement = document.createElement('div');
                dateElement.className = 'artwork-upload-date';
                dateElement.textContent = dateText;
                Object.assign(dateElement.style, {
                    fontSize: '12px', color: '#888888', marginTop: '2px',
                    fontWeight: 'normal', lineHeight: '1.2'
                });
                titleContainer.appendChild(dateElement);
            }
        }
    }

    /**
     * Scans the specified root node to find all artworks that need to be processed.
     * @param {Document|ShadowRoot} rootNode
     */
    function scanForArtworks(rootNode) {
        if (!rootNode) return;
        const artworkLinks = rootNode.querySelectorAll(`a[href*="/artworks/"]:has(img)`);
        artworkLinks.forEach(addDateToArtwork);
    }

    function monitorInsideShadowRoot(hostElement) {
        const shadowRoot = hostElement.shadowRoot;
        if (!shadowRoot) {
            return;
        }

        scanForArtworks(shadowRoot);

        const internalObserver = new MutationObserver(() => scanForArtworks(shadowRoot));
        internalObserver.observe(shadowRoot, {
            childList: true,
            subtree: true
        });
    }


    // main
    const hostFinder = new MutationObserver((mutations, observer) => {
        const hostElement = document.querySelector('pixiv-infinite-scroll');
        if (hostElement && hostElement.shadowRoot) {
            monitorInsideShadowRoot(hostElement);
            observer.disconnect();
        }
    });

    hostFinder.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(() => scanForArtworks(document), 500);
    const mainObserver = new MutationObserver(() => scanForArtworks(document));
    mainObserver.observe(document.documentElement, { childList: true, subtree: true });

})();