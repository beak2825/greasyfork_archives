// ==UserScript==
// @name         All vids playlist
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Create "Play all" videos playlist, accessible from channel page
// @author
// @match        https://www.youtube.com/*
// @license      MIT
// @grant        none
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTMgMTBIMTRWMTJIM1YxME0zIDZIMTRWOEgzVjZNMyAxNEgxMFYxNkgzVjE0TTE2IDEzVjIxTDIyIDE3TDE2IDEzWiIgLz48L3N2Zz4=
// @downloadURL https://update.greasyfork.org/scripts/496909/All%20vids%20playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/496909/All%20vids%20playlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL pattern: any channel's /videos page
    const pattern = /^https:\/\/www\.youtube\.com\/.*\/videos$/;
    let buttonExists = false;

    // Observers
    const config = { attributes: true, childList: true, characterData: true, subtree: true };
    const observerMain = new MutationObserver(onMutationsMain);
    const observerWait = new MutationObserver(onMutationsWait);

    // Start observing for URL changes, etc.
    observerMain.observe(document, config);

    /**
     * This gets called on *any* DOM mutation. We only do something
     * if the URL matches a channel's /videos page.
     */
    function onMutationsMain() {
        const url = window.location.href;
        if (pattern.test(url) && !buttonExists) {
            // We are on /videos but haven't placed our button yet
            observerMain.disconnect();       // Temporarily stop
            observerWait.observe(document, config); // Wait for chips to load
        } else if (!pattern.test(url)) {
            // If we leave /videos, remove the button
            removeMyButton();
        }
    }

    /**
     * Called by observerWait once new mutations appear; we look
     * for the built‐in chips (#chips) to exist. Then add our custom chip.
     */
    function onMutationsWait() {
        const chipsContainer = document.querySelector('#chips');
        const realChip = chipsContainer && chipsContainer.querySelector(
            'yt-chip-cloud-chip-renderer[chip-style="STYLE_DEFAULT"]'
        );
        const myButton = document.getElementById('mybutton');

        // If the standard chips are there and we don't already have our chip
        if (realChip && !myButton) {
            observerWait.disconnect();
            addCustomChip();
            // Resume the main observer so we keep track of page navigation
            observerMain.observe(document, config);
        }
    }

    /**
     * Builds the "Play all" chip and appends it into #chips.
     */

    /*
    function addCustomChip() {
        const chipsContainer = document.querySelector('#chips');
        if (!chipsContainer) return;

        // Create our custom chip
        const playAllChip = createPlayAllChip();

        // Add click event to redirect to the "all videos" playlist
        playAllChip.addEventListener('click', onPlayAllClicked);

        // Append to the container
        chipsContainer.appendChild(playAllChip);
        buttonExists = true;
    }
    */


    /**
     * If we leave the /videos page, remove our chip.
     */
    function removeMyButton() {
        const btns = document.querySelectorAll('#mybutton');
        btns.forEach(btn => btn.remove());
        buttonExists = false;
    }

    /**
     * On "Play all" click, redirect to a playlist with all channel videos.
     */
    function onPlayAllClicked() {
        const linkElement = document.querySelector('link[rel="canonical"]');
        if (!linkElement) return;

        // e.g. https://www.youtube.com/channel/UCxxxxxx/videos => lastPart = UCxxxxxx
        const hrefValue = linkElement.getAttribute('href');
        const lastPart = hrefValue.split('/').pop();
        // Ensure the second character is 'U' => e.g. "Cxxxxxx" -> "UCxxxxx"
        const newLastPart = replaceAt(1, 'U', lastPart);

        // Build the playlist URL
        const newUrl = 'https://www.youtube.com/playlist?list=' + newLastPart;
        window.location.href = newUrl;
    }

    /**
     * Helper that directly builds a minimal <yt-chip-cloud-chip-renderer>
     * with the text "Play all" in red & bold, matching the structure YouTube uses.
     */
    function createPlayAllChip() {
        // 1) Outer <yt-chip-cloud-chip-renderer>
        const chip = document.createElement('yt-chip-cloud-chip-renderer');
        chip.className = 'style-scope ytd-feed-filter-chip-bar-renderer';
        chip.setAttribute('modern', '');
        chip.setAttribute('aria-selected', 'false');
        chip.setAttribute('role', 'tab');
        chip.setAttribute('tabindex', '0');
        chip.setAttribute('chip-style', 'STYLE_DEFAULT');
        chip.setAttribute('chip-shape-data', '{"text":"Play all","state":2,"type":0}');

        chip.id = 'mybutton';
        chip.setAttribute('title', 'Play every video in this channel');

        // Optional styling
        chip.style.color = 'red';
        chip.style.fontWeight = 'bolder';

        // 2) <div id="chip-shape-container"><chip-shape></chip-shape></div>
        const shapeContainer = document.createElement('div');
        shapeContainer.id = 'chip-shape-container';
        shapeContainer.className = 'style-scope yt-chip-cloud-chip-renderer';

        const chipShape = document.createElement('chip-shape');
        chipShape.className = 'style-scope yt-chip-cloud-chip-renderer';
        shapeContainer.appendChild(chipShape);
        chip.appendChild(shapeContainer);

        // 3) <div id="chip-container"><yt-formatted-string id="text">...</yt-formatted-string></div>
        const chipContainer = document.createElement('div');
        chipContainer.id = 'chip-container';
        chipContainer.className = 'style-scope yt-chip-cloud-chip-renderer';
        chip.appendChild(chipContainer);

        // We'll insert the text in a moment (in a separate function).
        return chip;
    }

/**
 * After we append the chip to the page, YouTube may have auto‐injected
 * <yt-icon> or messed with the text. So we forcibly:
 *   - Remove any <yt-icon> if we don't want it
 *   - Remove is-empty from <yt-formatted-string>
 *   - Re‐set the text content to "Play all"
 */
    function finalizeChipContent(chip) {
        // Remove the leading icon if YouTube injected it
        const icon = chip.querySelector('yt-icon.leading-icon');
        if (icon) {
            icon.remove();
        }

        // Check if we have #chip-container
        const chipContainer = chip.querySelector('#chip-container');
        if (!chipContainer) return;

        // If there's already a <yt-formatted-string> element, great; use it
        let formattedString = chip.querySelector('yt-formatted-string#text');
        if (!formattedString) {
            // Otherwise, create one
            formattedString = document.createElement('yt-formatted-string');
            formattedString.id = 'text';
            formattedString.className = 'style-scope yt-chip-cloud-chip-renderer';
            formattedString.setAttribute('ellipsis-truncate', '');
            formattedString.setAttribute('ellipsis-truncate-styling', '');
            formattedString.setAttribute('title', 'Play all');
            chipContainer.appendChild(formattedString);
        }

        // YouTube might set is-empty="..."
        formattedString.removeAttribute('is-empty');

        // Insert a <yt-attributed-string> child with our text
        // (remove any existing children first, just in case)
        formattedString.innerHTML = 'Play All';
        formattedString.style.color = 'red';
        formattedString.style.fontWeight = 'bolder';
        const attrString = document.createElement('yt-attributed-string');
        attrString.className = 'style-scope yt-formatted-string';
        attrString.textContent = 'Play all'; // The visible label
        formattedString.appendChild(attrString);
    }

    /**
 * Called by your code once #chips is present, to insert the new chip.
 */
    function addCustomChip() {
        const chipsContainer = document.querySelector('#chips');
        if (!chipsContainer) return;

        const playAllChip = createPlayAllChip();

        // Append first
        chipsContainer.appendChild(playAllChip);

        // Then forcibly fix the content:
        finalizeChipContent(playAllChip);

        // Now attach the click event:
        playAllChip.addEventListener('click', onPlayAllClicked);

        buttonExists = true;
    }

    /**
     * Helper to replace text in a string at index.
     */
    function replaceAt(index, replacement, string) {
        return string.substr(0, index) + replacement + string.substr(index + replacement.length);
    }

})();
