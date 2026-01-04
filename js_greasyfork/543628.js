// ==UserScript==
// @name         Google AI - Default to AI Mode & 2.5 Pro
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  Defaults Google searches to AI Mode, remembers your choice to exit for a specific query, and selects 2.5 Pro.
// @author       JP - Discord: @Organism
// @match        https://www.google.com/search*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543628/Google%20AI%20-%20Default%20to%20AI%20Mode%20%2025%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/543628/Google%20AI%20-%20Default%20to%20AI%20Mode%20%2025%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Part 1: Smart Redirect Logic (Query-Based Override) ---
    const url = new URL(window.location.href);
    const currentQuery = url.searchParams.get('q');
    const forcedWebQuery = sessionStorage.getItem('forcedWebQuery');

    // Check if the user has previously opted-out of AI mode for this specific query.
    // If they have, don't do anything. This allows navigation to Images, Videos, etc.
    if (currentQuery && currentQuery === forcedWebQuery) {
        // User wants to stay in Web Search for this query. Do nothing.
    } else {
        // Otherwise, apply the default-to-AI logic.
        // A redirect will only happen on a standard web search that isn't already AI mode.
        const isAiSearch = url.searchParams.get('udm') === '50';
        const isSpecificSearchType = url.searchParams.has('tbm'); // e.g., tbm=isch for Images

        if (currentQuery && !isAiSearch && !isSpecificSearchType) {
            // This is a new search, so clear the old override and redirect to AI mode.
            sessionStorage.removeItem('forcedWebQuery');
            url.searchParams.set('udm', '50');
            window.location.href = url.toString();
            return; // Stop script execution after redirect
        }
    }


    // --- Part 2: AI Mode Page Setup ---
    // This part only runs if the script continues to an AI page (`udm=50`).
    function setupAiPage() {
        function setupModelSelector() {
            const TOGGLE_BUTTON_XPATH = "//div[contains(@class, 'tk4Ybd') and .//span[starts-with(text(),'AI Mode')]]";
            const PRO_MODEL_ITEM_XPATH = "//g-menu-item[.//span[text()='2.5 Pro']]";

            function findElement(xpath) {
                return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const proMenuItem = findElement(PRO_MODEL_ITEM_XPATH);
                if (proMenuItem) {
                    if (proMenuItem.getAttribute('aria-checked') === 'true') {
                        obs.disconnect();
                        return;
                    } else {
                        proMenuItem.click();
                    }
                } else {
                    const toggleButton = findElement(TOGGLE_BUTTON_XPATH);
                    if (toggleButton) {
                        toggleButton.click();
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        function createFloatingButton() {
            if (document.getElementById('web-search-flt-btn')) return;

            GM_addStyle(`
                #web-search-flt-container {
                    position: fixed; bottom: 20px; right: 20px; z-index: 9999; user-select: none;
                }
                #web-search-flt-btn {
                    background-color: rgba(30, 30, 30, 0.85); color: white; border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px; padding: 10px 16px; font-family: "Google Sans", Roboto, Arial, sans-serif;
                    font-size: 14px; font-weight: 500; cursor: grab; backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    transition: background-color 0.2s;
                }
                #web-search-flt-btn:hover { background-color: rgba(50, 50, 50, 0.9); }
                #web-search-flt-btn:active { cursor: grabbing; background-color: rgba(0, 0, 0, 0.9); }
            `);

            const container = document.createElement('div');
            container.id = 'web-search-flt-container';
            const button = document.createElement('button');
            button.id = 'web-search-flt-btn';
            button.textContent = 'Web Search';
            container.appendChild(button);
            document.body.appendChild(container);

            let isDragging = false, startX, startY;
            const clickThreshold = 5;

            const onPointerDown = (e) => {
                startX = e.clientX || e.touches[0].clientX;
                startY = e.clientY || e.touches[0].clientY;
                isDragging = false;
                const rect = container.getBoundingClientRect();
                const offsetX = startX - rect.left;
                const offsetY = startY - rect.top;
                button.style.cursor = 'grabbing';

                const onPointerMove = (moveEvent) => {
                    const moveX = moveEvent.clientX || moveEvent.touches[0].clientX;
                    const moveY = moveEvent.clientY || moveEvent.touches[0].clientY;
                    if (Math.abs(moveX - startX) > clickThreshold || Math.abs(moveY - startY) > clickThreshold) {
                        isDragging = true;
                    }
                    if (isDragging) {
                        moveEvent.preventDefault();
                        container.style.left = `${moveX - offsetX}px`;
                        container.style.top = `${moveY - offsetY}px`;
                        container.style.right = 'auto';
                        container.style.bottom = 'auto';
                    }
                };

                const onPointerUp = () => {
                    document.removeEventListener('mousemove', onPointerMove);
                    document.removeEventListener('mouseup', onPointerUp);
                    document.removeEventListener('touchmove', onPointerMove);
                    document.removeEventListener('touchend', onPointerUp);
                    button.style.cursor = 'grab';
                };

                document.addEventListener('mousemove', onPointerMove);
                document.addEventListener('mouseup', onPointerUp);
                document.addEventListener('touchmove', onPointerMove, { passive: false });
                document.addEventListener('touchend', onPointerUp);
            };

            button.addEventListener('click', (e) => {
                if (isDragging) {
                    e.preventDefault(); e.stopPropagation(); return;
                }
                // When button is clicked, set the override for the CURRENT query.
                const queryToForce = new URL(window.location.href).searchParams.get('q');
                if (queryToForce) {
                    sessionStorage.setItem('forcedWebQuery', queryToForce);
                }
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.delete('udm');
                window.location.href = currentUrl.toString();
            });

            button.addEventListener('mousedown', onPointerDown);
            button.addEventListener('touchstart', onPointerDown, { passive: false });
        }

        setupModelSelector();
        createFloatingButton();
    }

    // --- Part 3: Execution ---
    if (url.searchParams.get('udm') === '50') {
        document.addEventListener('DOMContentLoaded', setupAiPage);
    }
})();