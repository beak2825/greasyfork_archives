// ==UserScript==
// @name         Pixiv Auto Expand Multiple Images
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Auto Expand Pixiv multiple images without clicking. Works for both illustrations and manga.
// @author       CHATGPT + GEMINI - jarsang010
// @license      None
// @match        https://www.pixiv.net/en/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544433/Pixiv%20Auto%20Expand%20Multiple%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/544433/Pixiv%20Auto%20Expand%20Multiple%20Images.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let hasClickedExpandButtonThisPage = false; // Tracks if we've clicked the expand button for the current artwork
    let isMangaViewerCurrentlyActive = false; // Tracks if the manga viewer modal is open
    let currentArtworkId = null;

    // Function to click the "Show all" or "Start reading" button
    function tryClickExpandButton() {
        // Only proceed if the current URL is an artwork page
        if (!window.location.pathname.startsWith('/en/artworks/')) {
            console.log("[PixivScript] Not on an artwork page. Skipping click attempts.");
            return false;
        }

        if (hasClickedExpandButtonThisPage || isMangaViewerCurrentlyActive) {
            console.log("[PixivScript] Already clicked expand button for this page or manga viewer active - skipping click attempt.");
            return false;
        }

        console.log("[PixivScript] Checking for expand buttons...");
        const buttons = Array.from(document.querySelectorAll("button, a"));

        for (const btn of buttons) {
            const text = btn.textContent.trim();
            if (text === "Show all" || text === "Reading works" || text === "Start reading") {
                console.log(`[PixivScript] Clicking "${text}"`);
                btn.click();
                hasClickedExpandButtonThisPage = true; // Mark that we've clicked it for this page
                return true;
            }
        }
        return false;
    }

    // Observer to detect when the manga viewer is opened or closed
    const viewerObserver = new MutationObserver(function (mutations) {
        const viewerModal = document.querySelector(".sc-fgvYmX.hCqDkB, ._viewer, ._modal.ui-modal");

        if (viewerModal && !isMangaViewerCurrentlyActive) {
            console.log("[PixivScript] Manga viewer modal detected as opened.");
            isMangaViewerCurrentlyActive = true;
            hasClickedExpandButtonThisPage = true;
        } else if (!viewerModal && isMangaViewerCurrentlyActive) {
            console.log("[PixivScript] Manga viewer modal detected as closed.");
            isMangaViewerCurrentlyActive = false;
        }
    });

    // Start observing the body for changes that indicate viewer state
    setTimeout(() => {
        viewerObserver.observe(document.body, { childList: true, subtree: true });
        console.log("[PixivScript] Viewer observer started.");
    }, 500);

    // Function to handle initial clicks and clicks on URL change
    function activateAutoClick() {
        let attempts = 0;
        const maxAttempts = 20; // Try for up to 10 seconds (20 * 500ms)
        const clickInterval = setInterval(() => {
            if (hasClickedExpandButtonThisPage || isMangaViewerCurrentlyActive || attempts >= maxAttempts) {
                clearInterval(clickInterval);
                if (attempts >= maxAttempts && !hasClickedExpandButtonThisPage && !isMangaViewerCurrentlyActive) {
                    console.log("[PixivScript] Max click attempts reached, no expand button found or viewer active.");
                }
                return;
            }
            attempts++;
            console.log(`[PixivScript] Click attempt ${attempts}...`);
            tryClickExpandButton();
        }, 500);
    }

    // Reset state and activate auto-click when URL changes (user navigates to a new artwork)
    function handleUrlChange() {
        const newArtworkIdMatch = window.location.pathname.match(/\/artworks\/(\d+)/);
        const newArtworkId = newArtworkIdMatch ? newArtworkIdMatch[1] : null;

        if (newArtworkId && newArtworkId !== currentArtworkId) {
            console.log(`[PixivScript] Navigated to new artwork (ID: ${newArtworkId}). Resetting state.`);
            currentArtworkId = newArtworkId;
            hasClickedExpandButtonThisPage = false;
            isMangaViewerCurrentlyActive = false;
            setTimeout(activateAutoClick, 800);
        } else if (!newArtworkId) {
            currentArtworkId = null;
            hasClickedExpandButtonThisPage = false;
            isMangaViewerCurrentlyActive = false;
            console.log("[PixivScript] Navigated away from artwork page. State reset.");
        } else {
            console.log("[PixivScript] URL change detected, but it's the same artwork ID. No full reset.");
        }
    }

    // Hook browser history API to detect URL changes within Pixiv's SPA
    function hookHistory(fn) {
        return function () {
            const ret = fn.apply(this, arguments);
            window.dispatchEvent(new Event("customurlchange"));
            return ret;
        };
    }
    history.pushState = hookHistory(history.pushState);
    history.replaceState = hookHistory(history.replaceState);
    window.addEventListener("popstate", () => window.dispatchEvent(new Event("customurlchange")));
    window.addEventListener("customurlchange", handleUrlChange);

    // Initial run when the script loads
    console.log("[PixivScript] Initializing...");
    handleUrlChange();
    activateAutoClick();

})();
