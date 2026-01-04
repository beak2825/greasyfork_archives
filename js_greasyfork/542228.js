// ==UserScript==
// @name         TL.net Stream Direct Open via Middle-Click
// @description  Open stream directly by middle-clicking any stream on tl.net (Teamliquid)
// @author       NWP
// @namespace    https://greasyfork.org/users/877912
// @version      0.2
// @license      MIT
// @compatible   Chrome
// @compatible   Firefox
// @match        https://tl.net/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        window.open
// @downloadURL https://update.greasyfork.org/scripts/542228/TLnet%20Stream%20Direct%20Open%20via%20Middle-Click.user.js
// @updateURL https://update.greasyfork.org/scripts/542228/TLnet%20Stream%20Direct%20Open%20via%20Middle-Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isDebugMode = false;
    const CLICK_COOLDOWN_MS = 200;

    function debugLog(...args) { if (isDebugMode) console.log('[SMC]', ...args); }
    function debugWarn(...args) { if (isDebugMode) console.warn('[SMC]', ...args); }
    function debugError(...args) { if (isDebugMode) console.error('[SMC]', ...args); }

    const activeFetchUrls = new Set();               
    const clickTimestamps = new Map();
    let lastStreamsHtmlSnapshot = null;

    function handleAuxClick(event) {
        if (event.button !== 1 || event.type !== 'auxclick') return;
        debugLog('Middle-click detected');
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        // Capture and dedupe page snapshot
        const streamsContainer = document.getElementById('streams_content');
        const currentHtml = streamsContainer ? streamsContainer.innerHTML.trim() : '';
        const timestampIso = new Date().toISOString();
        if (currentHtml !== lastStreamsHtmlSnapshot) {
            lastStreamsHtmlSnapshot = currentHtml;
            debugLog(`Snapshot updated at ${timestampIso} (length=${currentHtml.length})`);
        } else {
            debugLog(`Snapshot unchanged at ${timestampIso}`);
        }

        // Identify the clicked stream link element
        const linkElement = event.target.closest('a.rightmenu');
        if (!linkElement) {
            debugWarn('Clicked element is not a stream link');
            return;
        }
        const linkUrl = linkElement.href;
        debugLog('Clicked link URL:', linkUrl);

        // If link is external (not a TL stream page), open directly
        if (!linkUrl.includes('/video/streams/')) {
            debugLog('Opening external link directly:', linkUrl);
            const newTab = window.open(linkUrl, '_blank');
            if (newTab) newTab.opener = null;
            return;
        }

        // Avoid duplicate fetches and enforce cooldown
        if (activeFetchUrls.has(linkUrl)) return;
        const nowMs = Date.now();
        if (nowMs - (clickTimestamps.get(linkUrl) || 0) < CLICK_COOLDOWN_MS) return;
        clickTimestamps.set(linkUrl, nowMs);
        activeFetchUrls.add(linkUrl);

        // Fetch TL page to extract final stream URL
        debugLog('Fetching TL page for:', linkUrl);
        GM_xmlhttpRequest({
            method: 'GET',
            url: linkUrl,
            onload(response) {
                activeFetchUrls.delete(linkUrl);
                if (response.status !== 200) {
                    debugWarn('Failed to fetch TL page:', response.status);
                    return;
                }
                try {
                    const parser = new DOMParser();
                    const responseDocument = parser.parseFromString(response.responseText, 'text/html');
                    const viewOnLink = Array.from(responseDocument.querySelectorAll('a'))
                        .find(a => a.textContent.trim().startsWith('View on'));
                    if (viewOnLink) {
                        const finalStreamUrl = viewOnLink.href;
                        debugLog('Opening final URL:', finalStreamUrl);
                        const newTab = window.open(finalStreamUrl, '_blank');
                        if (newTab) newTab.opener = null;
                    } else {
                        debugWarn('No "View on" link found in TL response page');
                    }
                } catch (parseError) {
                    debugError('Error parsing TL response page:', parseError);
                }
            },
            onerror() {
                activeFetchUrls.delete(linkUrl);
                debugWarn('Network error during fetch of TL page');
            }
        });
    }

    // Ensure each stream-link element only gets one listener
    const processedLinks = new WeakSet();
    function attachListeners() {
        const streamLinkElements = document.querySelectorAll('#streams_content a.rightmenu, #non-featured a.rightmenu');
        const newlyAdded = [];
        streamLinkElements.forEach(element => {
            if (!processedLinks.has(element)) {
                processedLinks.add(element);
                element.addEventListener('auxclick', handleAuxClick, true);
                newlyAdded.push(element);
            }
        });
        if (newlyAdded.length > 0) {
            debugLog(`Listener added for ${newlyAdded.length} link(s)`);
        }
    }

    // Observe dynamic changes and attach listeners
    const domObserver = new MutationObserver(attachListeners);
    document.addEventListener('DOMContentLoaded', () => {
        attachListeners();
        const container = document.getElementById('streams_content');
        if (container) domObserver.observe(document.body, { childList: true, subtree: true });
    });
    window.addEventListener('load', attachListeners);
})();