// ==UserScript==
// @name        Youtube download button
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch
// @include     https://*.youtube.com/*
// @grant       GM_addStyle
// @run-at      document-start
// @version     3.0
// @author      Nojyto
// @license     MIT
// @description Adds a download button
// @downloadURL https://update.greasyfork.org/scripts/446208/Youtube%20download%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/446208/Youtube%20download%20button.meta.js
// ==/UserScript==

(function() {
    const TEXT_BUTTON = "Download";
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    const ICON_SVG_PATH_DATA = "M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z";

    const DOWNLOAD_API = "https://www.y2mate.com/download-youtube/";
    const BUTTON_ID = "ytDownloadButton";
    const TARGET_CONTAINER_SELECTOR = "div#owner";

    let lastUrl = null;
    let currentVideoId = null;
    let buttonObserver = null;

    GM_addStyle(`
        #${BUTTON_ID} {
            background-color: var(--yt-spec-additive-background);
            color: var(--yt-spec-text-primary);
            margin: 0px 4px;
            border-radius: 18px;
            width: 120px;
            height: 36px;
            line-height: 37px;
            text-align: center;
            font-style: normal;
            font-size: 14px;
            font-family: Roboto, Noto, sans-serif;
            font-weight: 500;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s;
            white-space: nowrap;
            min-width: fit-content;
            padding: 0 10px;
        }
        #${BUTTON_ID}:hover {
            background-color: var(--yt-spec-mono-tonal-hover);
            color: var(--yt-spec-text-primary);
        }
        #${BUTTON_ID} .yt-download-icon-container {
            height: 84%;
            margin-left: -8px;
            fill: currentcolor;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #${BUTTON_ID} > span {
            margin-left: 4px;
        }
        #owner {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }
    `);

    function waitForElement(selector) {
        // console.log(`[Youtube Download] Waiting for element: ${selector}`);
        return new Promise((resolve) => {
            const element = document.querySelector(selector);
            if (element) {
                // console.log(`[Youtube Download] Element found immediately:`, element);
                return resolve(element);
            }
            const observer = new MutationObserver((mutationsList, obs) => {
                const foundElement = document.querySelector(selector);
                if (foundElement) {
                    obs.disconnect();
                    // console.log(`[Youtube Download] Element found via MutationObserver:`, foundElement);
                    resolve(foundElement);
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        });
    }

    function getVideoId(url) {
        try {
            const urlObj = new URL(url);
            const urlParams = new URLSearchParams(urlObj.search);
            return urlParams.get('v');
        } catch (e) {
            console.error("[Youtube Download] Error parsing URL to get video ID:", e);
            return null;
        }
    }

    async function addOrUpdateDownloadButton() {
        // console.log("[Youtube Download] addOrUpdateDownloadButton called.");
        const currentUrl = window.location.href;

        if (!currentUrl.includes("watch?v=")) {
            // console.log("[Youtube Download] Not a YouTube watch page. Skipping.");
            return;
        }

        const targetContainer = await waitForElement(TARGET_CONTAINER_SELECTOR);
        if (!targetContainer) {
            console.warn("[Youtube Download] Target container element not found after waiting. Cannot add download button.");
            return;
        }
        // console.log(`[Youtube Download] Found target container:`, targetContainer);

        let downloadLink = document.getElementById(BUTTON_ID);
        let videoIdForCurrentUrl = getVideoId(currentUrl);

        if (!videoIdForCurrentUrl) {
            console.warn("[Youtube Download] Could not get video ID for current URL:", currentUrl);
            return;
        }

        if (!downloadLink || downloadLink.parentNode !== targetContainer) {
            // console.log("[Youtube Download] Button missing or detached. Creating/re-creating download button.");
            if (downloadLink && downloadLink.parentNode) {
                downloadLink.parentNode.removeChild(downloadLink);
                // console.log("[Youtube Download] Removed detached old button instance.");
            }

            downloadLink = document.createElement('a');
            downloadLink.id = BUTTON_ID;
            downloadLink.target = "_blank";
            downloadLink.rel = "noopener noreferrer";

            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'yt-download-icon-container';
            const svgElement = document.createElementNS(SVG_NAMESPACE, "svg");
            svgElement.setAttribute("height", "24");
            svgElement.setAttribute("viewBox", "0 0 24 24");
            svgElement.setAttribute("width", "24");
            svgElement.setAttribute("focusable", "false");
            svgElement.style.pointerEvents = "none";
            svgElement.style.display = "inherit";
            svgElement.style.width = "100%";
            svgElement.style.height = "100%";
            const pathElement = document.createElementNS(SVG_NAMESPACE, "path");
            pathElement.setAttribute("d", ICON_SVG_PATH_DATA);
            svgElement.appendChild(pathElement);
            iconWrapper.appendChild(svgElement);
            downloadLink.appendChild(iconWrapper);

            const textSpan = document.createElement('span');
            textSpan.textContent = TEXT_BUTTON;
            downloadLink.appendChild(textSpan);

            targetContainer.appendChild(downloadLink);
            // console.log("[Youtube Download] Download button created and inserted into container.");

            setupButtonObserver(targetContainer);
        } else {
            // console.log("[Youtube Download] Button exists and is in place.");
            if (!buttonObserver || buttonObserver.observedElement !== targetContainer) {
                setupButtonObserver(targetContainer);
            }
        }

        if (currentUrl !== lastUrl || !lastUrl || !downloadLink.href.includes(videoIdForCurrentUrl)) {
             lastUrl = currentUrl;
             currentVideoId = videoIdForCurrentUrl;
             downloadLink.href = DOWNLOAD_API + currentVideoId;
            //  console.log(`[Youtube Download] Button href updated to: ${downloadLink.href}`);
        } else {
            //  console.log("[Youtube Download] URL unchanged, button already updated. No action needed for href.");
        }
    }

    function setupButtonObserver(parentEl) {
        if (buttonObserver) {
            buttonObserver.disconnect();
            // console.log("[Youtube Download] Existing button observer disconnected.");
        }

        buttonObserver = new MutationObserver((mutationsList) => {
            let downloadLink = document.getElementById(BUTTON_ID);
            if (!downloadLink) {
                // console.log("[Youtube Download] Download button detected as removed. Attempting to re-add.");
                if (buttonObserver) {
                    buttonObserver.disconnect();
                    buttonObserver = null;
                }
                setTimeout(() => addOrUpdateDownloadButton(), 500);
            }
        });

        buttonObserver.observedElement = parentEl;
        buttonObserver.observe(parentEl, { childList: true, subtree: false });
        // console.log("[Youtube Download] Button observer set up on:", parentEl);
    }

    if (document.readyState === 'loading') {
        // console.log("[Youtube Download] DOM still loading, adding DOMContentLoaded listener.");
        document.addEventListener('DOMContentLoaded', addOrUpdateDownloadButton);
    } else {
        // console.log("[Youtube Download] DOM already loaded, running addOrUpdateDownloadButton immediately.");
        addOrUpdateDownloadButton();
    }
    window.addEventListener("yt-navigate-finish", addOrUpdateDownloadButton, true);
    // console.log("[Youtube Download] Script initialized. Listening for navigation events.");
})();