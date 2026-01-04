// ==UserScript==
// @name         Auto scroll to anchor on dynamic pages
// @name:en      Auto scroll to anchor on dynamic pages
// @name:ru      Автоматическая прокрутка к якорю на динамических страницах
// @namespace    http://tampermonkey.net/
// @version      2025-05-23_21-4 // Обновлена версия
// @description  Tries to scroll to an anchor on pages with dynamic content loading by repeatedly scrolling down. Handles hash changes and scrolls to top instantly if anchor not found at page end.
// @description:en  Tries to scroll to an anchor on pages with dynamic content loading by repeatedly scrolling down. Handles hash changes and scrolls to top instantly if anchor not found at page end.
// @description:ru  Пытается прокрутить до якоря на страницах с динамической загрузкой контента, многократно прокручивая вниз. Обрабатывает изменения хеша и моментально прокручивает вверх, если якорь не найден в конце страницы.
// @author       Igor Lebedev + (DeepSeek and Gemini Pro)
// @license        GPL-3.0-or-later
// @match        *://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDggNDgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+0JTQuNC9xpnbQuNC30LXRgNCw0Y8g0L/RgNC+0YDRgtC60Log0LrINC30L7RgNGN0YDPjwvdGl0bGU+PHN0eWxlPi5wYWdlIHsgZmlsbDogI2YwZjBmMDsgc3Ryb2tlOiAjMzMzOyBzdHJva2Utd2lkdGg6MjsgfSAuYW5jaG9yLXN5bWJvbCB7IGZpbGw6ICMzMzM7IGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyBmb250LXNpemU6IDE4cHg7IGZvbnQtd2VpZ2h0OiBib2xkOyB0ZXh0LWFuY2hvcjogbWlkZGxlOyB9IC5hcnJvdyB7IGZpbGw6IG5vbmU7IHN0cm9rZTogIzMzMzsgc3Ryb2tlLXdpZHRoOjM7IHN0cm9rZS1saW5lY2FwOnJvdW5kOyBzdHJva2UtbGluZWpvaW46cm91bmQ7IH08L3N0eWxlPjxyZWN0IGNsYXNzPSJwYWdlIiB4PSIyLjYyODgzNCIgeT0iMi41NDIzNDkxIiB3aWR0aD0iNDIuNzc3MDg4IiBoZWlnaHQ9IjQyLjc3NzA4OCIgcng9IjIuMzU1MzE1MyIgLz48dGV4dCBjbGFzcz0iYW5jaG9yLXN5bWJvbCIgeD0iMjQuMDAwMDAyIiB5PSIzOS4zMzMzMjgiIHN0eWxlPSJmaWxsOiM0ZjRmZGQ7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMwMjAwNWE7c3Ryb2tlLW9wYWNpdHk6MSI+IzwvdGV4dD48cG9seWxpbmUgY2xhc3M9ImFycm93IiBwb2ludHM9IjMyLDE1IDMyLDM1IiB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwwLjY3MzA0MzQ4LC03Ljk5OTk5OTksLTEuMzk5NDIwMykiIHN0eWxlPSJzdHJva2U6I2YwYWUxMztzdHJva2Utb3BhY2l0eToxIiAvPjxwb2x5bGluZSBjbGFzcz0iYXJyb3ciIHBvaW50cz0iMjYsMjggMzIsMzUgMzgsMjgiIHN0eWxlPSJzdHJva2U6I2YwYWUxMztzdHJva2Utb3BhY2l0eToxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNy45OTk5OTk5LC0xMy4xMDcwNikiIC8+PGxpbmUgeDE9IjEzLjEwNjY2NyIgeTE9IjguNTQ2NjY2MSIgeDI9IjM1LjEwNjY2MyIgeTI9IjguNTQ2NjY2MSIgc3Ryb2tlPSIjY2NjY2NjIiBzdHJva2Utd2lkdGg9IjIiIHN0eWxlPSJzdHJva2U6I2YwYWUxMztzdHJva2Utb3BhY2l0eToxIiAvPjwvc3ZnPg==
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535983/Auto%20scroll%20to%20anchor%20on%20dynamic%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/535983/Auto%20scroll%20to%20anchor%20on%20dynamic%20pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Определение среды выполнения ---
    let executionEnvironment = 'userscript';
    let logPrefix = "[AutoScrollToAnchor]";

    try {
        if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.id) {
            executionEnvironment = 'extension_firefox';
            logPrefix = "[AutoScrollExt FF]";
        } else if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
            if (chrome.runtime.getURL && chrome.runtime.getURL("").startsWith("moz-extension://")) {
                executionEnvironment = 'extension_firefox';
                logPrefix = "[AutoScrollExt FF]";
            } else {
                executionEnvironment = 'extension_chrome_or_edge';
                logPrefix = "[AutoScrollExt Cr]";
            }
        }
    } catch (e) { /* остаемся userscript */ }
    // ------------------------------------

    // --- Попытка сохранить исходный якорь ---
    let initialAnchorOnLoad = window.location.hash.substring(1);
    // --------------------------------------------

    // Настройки
    const MAX_ATTEMPTS = 30;
    const SCROLL_INTERVAL_MS = 750;
    const SCROLL_AMOUNT_PX = window.innerHeight * 0.8;
    const FAST_CHECK_DELAY_MS = 250;
    const INITIAL_DELAY_MS = 500;
    const END_OF_PAGE_STUCK_THRESHOLD = 2;
    const BOTTOM_DETECTION_TOLERANCE = 10;

    let currentIntervalId = null;
    let currentSearchAnchorName = '';

    function log(message) {
        console.log(`${logPrefix} ${message}`);
    }

    if (initialAnchorOnLoad) {
        log(`Initial anchor detected at document-start: #${initialAnchorOnLoad}`);
    }
    if (executionEnvironment !== 'userscript') {
        log(`Running as ${executionEnvironment}. Extension ID (if applicable): ${ (typeof browser !== 'undefined' && browser.runtime && browser.runtime.id) || (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) || 'N/A'}`);
    } else {
        log(`Running as ${executionEnvironment}.`);
    }

    function stopCurrentSearch(reason = "generic stop") {
        if (currentIntervalId) {
            clearInterval(currentIntervalId);
            currentIntervalId = null;
            log(`Search for #${currentSearchAnchorName} stopped. Reason: ${reason}`);
        }
    }

    function findAndScrollToElement(anchorNameToFind, currentExpectedUrlAnchor) {
        if (!anchorNameToFind) return false;

        const actualCurrentUrlAnchor = window.location.hash.substring(1);
        if (actualCurrentUrlAnchor && actualCurrentUrlAnchor !== anchorNameToFind && actualCurrentUrlAnchor !== currentExpectedUrlAnchor) {
            log(`User navigated to a new anchor #${actualCurrentUrlAnchor} while searching for #${anchorNameToFind}. Stopping this search.`);
            stopCurrentSearch(`navigated to new anchor #${actualCurrentUrlAnchor}`);
            return false;
        }

        const elementById = document.getElementById(anchorNameToFind);
        const elementByName = !elementById ? document.querySelector(`[name="${anchorNameToFind}"]`) : null;
        const targetElement = elementById || elementByName;

        if (targetElement) {
            log(`Anchor #${anchorNameToFind} found.`);
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Плавный скролл К ЯКОРЮ

            const originalBg = targetElement.style.backgroundColor;
            targetElement.style.backgroundColor = 'yellow';
            setTimeout(() => {
                targetElement.style.backgroundColor = originalBg;
            }, 2000);

            return true;
        }
        return false;
    }

    function startSearchingForAnchor(anchorNameToSearch, currentUrlAnchorAtStart) {
        stopCurrentSearch(`starting new search for #${anchorNameToSearch || 'empty'}`);

        if (!anchorNameToSearch) {
            log("No anchor specified for search, nothing to do.");
            currentSearchAnchorName = '';
            return;
        }

        currentSearchAnchorName = anchorNameToSearch;
        log(`Starting search for anchor: #${currentSearchAnchorName} (URL hash was #${currentUrlAnchorAtStart || 'empty'} at initiation)`);

        let attempts = 0;
        let stuckAtBottomCount = 0;
        let lastScrollHeightBeforeAttempt = document.body.scrollHeight;

        if (findAndScrollToElement(currentSearchAnchorName, currentUrlAnchorAtStart)) {
            stopCurrentSearch(`found #${currentSearchAnchorName} immediately`);
            return;
        }

        currentIntervalId = setInterval(() => {
            const currentHashInInterval = window.location.hash.substring(1);
            if (currentHashInInterval && currentHashInInterval !== currentSearchAnchorName && currentHashInInterval !== currentUrlAnchorAtStart) {
                 log(`URL hash changed to #${currentHashInInterval} during search for #${currentSearchAnchorName}. Stopping old search.`);
                 stopCurrentSearch("URL hash changed during interval, new search should be triggered by hashchange handler");
                 return;
            }

            if (findAndScrollToElement(currentSearchAnchorName, currentUrlAnchorAtStart)) {
                stopCurrentSearch(`found #${currentSearchAnchorName} after scrolling (check at interval start)`);
                return;
            }

            attempts++;
            if (attempts > MAX_ATTEMPTS) {
                console.warn(`${logPrefix} Anchor #${currentSearchAnchorName} not found after ${MAX_ATTEMPTS} attempts.`);
                stopCurrentSearch(`max attempts reached for #${currentSearchAnchorName}`);
                return;
            }

            lastScrollHeightBeforeAttempt = document.body.scrollHeight;
            log(`Attempt ${attempts}/${MAX_ATTEMPTS} for #${currentSearchAnchorName}: Scrolling down...`);
            window.scrollBy(0, SCROLL_AMOUNT_PX);

            setTimeout(() => {
                if (!currentIntervalId) return;

                if (findAndScrollToElement(currentSearchAnchorName, currentUrlAnchorAtStart)) {
                    stopCurrentSearch(`found #${currentSearchAnchorName} after scroll and fast check`);
                    return;
                }

                const currentScrollHeightAfterScroll = document.body.scrollHeight;
                const isAtBottom = (window.innerHeight + window.scrollY) >= (currentScrollHeightAfterScroll - BOTTOM_DETECTION_TOLERANCE);

                if (isAtBottom) {
                    if (currentScrollHeightAfterScroll <= lastScrollHeightBeforeAttempt) {
                        stuckAtBottomCount++;
                        log(`At bottom and page height didn't increase. Stuck count: ${stuckAtBottomCount} (Height: ${currentScrollHeightAfterScroll} vs ${lastScrollHeightBeforeAttempt})`);
                    } else {
                        stuckAtBottomCount = 0;
                        log(`Page height increased after scroll. Stuck count reset. (New height: ${currentScrollHeightAfterScroll})`);
                    }
                } else {
                    stuckAtBottomCount = 0;
                }

                if (stuckAtBottomCount >= END_OF_PAGE_STUCK_THRESHOLD) {
                    console.warn(`${logPrefix} Anchor #${currentSearchAnchorName} not found. Reached end of page and no more content loaded after ${END_OF_PAGE_STUCK_THRESHOLD} checks at bottom.`);
                    stopCurrentSearch(`reached end of page for #${currentSearchAnchorName}`);
                    log(`Scrolling to top of the page instantly.`);
                    window.scrollTo({ top: 0, behavior: 'auto' }); // <--- ИЗМЕНЕНИЕ ЗДЕСЬ
                    return;
                }

            }, FAST_CHECK_DELAY_MS);

        }, SCROLL_INTERVAL_MS);
    }

    function initialLoadOrHashChangeHandler() {
        let anchorToActUpon = window.location.hash.substring(1);
        let currentUrlAnchorForContext = anchorToActUpon;
        let usedInitialAnchor = false;

        if (!anchorToActUpon && initialAnchorOnLoad) {
            log(`URL hash is empty, but an initial anchor #${initialAnchorOnLoad} was detected. Attempting to use it.`);
            anchorToActUpon = initialAnchorOnLoad;
            usedInitialAnchor = true;
        }

        if (anchorToActUpon === currentSearchAnchorName && currentIntervalId !== null) {
            return;
        }

        if (usedInitialAnchor) {
            initialAnchorOnLoad = null;
        }

        if (!anchorToActUpon && currentSearchAnchorName) {
            stopCurrentSearch(`Anchor removed or no longer relevant (was #${currentSearchAnchorName})`);
            currentSearchAnchorName = '';
            return;
        }

        startSearchingForAnchor(anchorToActUpon, currentUrlAnchorForContext);
    }

    function onPageReady() {
        log(`onPageReady. Initial anchor was: #${initialAnchorOnLoad || 'none'}. Current hash: #${window.location.hash.substring(1) || 'none'}`);
        setTimeout(initialLoadOrHashChangeHandler, INITIAL_DELAY_MS);
        window.addEventListener('hashchange', initialLoadOrHashChangeHandler, false);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onPageReady, { once: true });
    } else {
        onPageReady();
    }

})();
