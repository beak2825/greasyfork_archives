// ==UserScript==
// @name         Steam IGG Games Search Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to Steam game pages to search the game on igg-games.com
// @match        https://store.steampowered.com/app/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540972/Steam%20IGG%20Games%20Search%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/540972/Steam%20IGG%20Games%20Search%20Button.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const BUTTON_ID = 'igg-games-search-btn';
    const SEARCH_BASE_URL = 'https://igg-games.com/?s=';
    const IGG_FAVICON_URL = 'https://igg-games.com/favicon.ico';

    function getGameTitle() {
        const selectors = [
            '.apphub_AppName',
            '.game_title_area .pageheader',
            'h2.pageheader',
            '#appHubAppName',
            '.game_title_area h2',
            '[itemprop="name"]'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }

        const pageTitle = document.title;
        if (pageTitle) {
            const match = pageTitle.match(/^(.+?)(?:\son\ssteam)?$/i);
            if (match && match[1]) {
                return match[1].trim();
            }
        }

        const urlMatch = window.location.pathname.match(/\/app\/\d+\/([^\/]+)/);
        if (urlMatch && urlMatch[1]) {
            return urlMatch[1].replace(/_/g, ' ');
        }

        return null;
    }

    async function getFaviconUrl() {
        try {
            // Try to fetch the favicon directly
            const response = await fetch(IGG_FAVICON_URL, { method: 'HEAD' });
            if (response.ok) {
                return IGG_FAVICON_URL;
            }
        } catch (error) {
            console.log('Direct favicon fetch failed, trying alternative methods');
        }

        try {
            // Try to parse favicon from the main page
            const response = await fetch('https://igg-games.com/');
            const html = await response.text();

            // Look for favicon link tags
            const faviconMatches = html.match(/<link[^>]*rel=['"](shortcut )?icon['"][^>]*href=['"]([^'"]+)['"]/i);
            if (faviconMatches && faviconMatches[2]) {
                let faviconUrl = faviconMatches[2];
                // Convert relative URLs to absolute
                if (faviconUrl.startsWith('/')) {
                    faviconUrl = 'https://igg-games.com' + faviconUrl;
                } else if (!faviconUrl.startsWith('http')) {
                    faviconUrl = 'https://igg-games.com/' + faviconUrl;
                }
                return faviconUrl;
            }
        } catch (error) {
            console.log('Failed to parse favicon from main page');
        }

        // Fallback to default favicon.ico
        return IGG_FAVICON_URL;
    }

    function createIGGButton(gameTitle, faviconUrl) {
        const searchUrl = `${SEARCH_BASE_URL}${encodeURIComponent(gameTitle)}`;

        const button = document.createElement('a');
        button.id = BUTTON_ID;
        button.className = 'btnv6_blue_hoverfade btn_medium btn_steamdb';
        button.href = searchUrl;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';

        const span = document.createElement('span');
        span.setAttribute('data-tooltip-text', 'View on IGG Games');
        span.setAttribute('aria-describedby', 'tooltip-35');

        const iconSpan = document.createElement('span');
        iconSpan.className = 'ico16';
        iconSpan.style.cssText = `
            background: url('${faviconUrl}') no-repeat center;
            background-size: 16px 16px;
            width: 16px;
            height: 16px;
            display: inline-block;
        `;

        span.appendChild(iconSpan);
        button.appendChild(span);

        return button;
    }

    async function addIGGGamesButton() {
        if (document.getElementById(BUTTON_ID)) return false;

        const gameTitle = getGameTitle();
        if (!gameTitle) return false;

        const faviconUrl = await getFaviconUrl();
        const button = createIGGButton(gameTitle, faviconUrl);

        const otherSiteInfo = document.querySelector('.apphub_OtherSiteInfo');
        if (otherSiteInfo) {
            try {
                otherSiteInfo.appendChild(button.cloneNode(true));
                return true;
            } catch (e) {
                console.error('Failed to add to OtherSiteInfo:', e);
            }
        }

        const gameActions = document.querySelector('.game_area_purchase_game_wrapper, .game_purchase_action');
        if (gameActions) {
            try {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = 'margin: 10px 0; clear: both;';
                buttonContainer.appendChild(button.cloneNode(true));

                gameActions.parentNode.insertBefore(buttonContainer, gameActions.nextSibling);
                return true;
            } catch (e) {
                console.error('Failed to add near purchase area:', e);
            }
        }

        const gameDetails = document.querySelector('.game_details_section, .rightcol');
        if (gameDetails) {
            try {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = 'margin: 10px 0; padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.1);';
                buttonContainer.appendChild(button.cloneNode(true));

                gameDetails.insertBefore(buttonContainer, gameDetails.firstChild);
                return true;
            } catch (e) {
                console.error('Failed to add to game details:', e);
            }
        }

        const mainContent = document.querySelector('.page_content_ctn, .game_page_content');
        if (mainContent) {
            try {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 1000;
                    background: rgba(0,0,0,0.8);
                    padding: 10px;
                    border-radius: 5px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                `;
                buttonContainer.appendChild(button.cloneNode(true));

                document.body.appendChild(buttonContainer);
                return true;
            } catch (e) {
                console.error('Failed to add floating button:', e);
            }
        }

        return false;
    }

    async function attemptToAddButton(retries = 5, delay = 500) {
        if (retries <= 0) return;

        const success = await addIGGGamesButton();
        if (!success) {
            setTimeout(() => attemptToAddButton(retries - 1, delay * 1.2), delay);
        }
    }

    function setupObserver() {
        if (document.getElementById(BUTTON_ID)) return;

        const observer = new MutationObserver(async (mutations) => {
            if (document.getElementById(BUTTON_ID)) {
                observer.disconnect();
                return;
            }

            let shouldTryAddButton = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node;
                            const className = element.className || '';

                            if (typeof className === 'string' && (
                                className.includes('apphub_OtherSiteInfo') ||
                                className.includes('external_link') ||
                                className.includes('block_content_inner') ||
                                element.querySelector('a[href*="steamcommunity.com"]')
                            )) {
                                shouldTryAddButton = true;
                                break;
                            }
                        }
                    }
                    if (shouldTryAddButton) break;
                }
            }

            if (shouldTryAddButton) {
                setTimeout(() => addIGGGamesButton(), 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => observer.disconnect(), 15000);
    }

    async function init() {
        const success = await addIGGGamesButton();
        if (!success) {
            attemptToAddButton();
            setupObserver();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    window.addEventListener('load', () => {
        setTimeout(async () => {
            if (!document.getElementById(BUTTON_ID)) {
                await addIGGGamesButton();
            }
        }, 500);
    });

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (url.includes('/app/')) {
                setTimeout(async () => {
                    if (!document.getElementById(BUTTON_ID)) {
                        await init();
                    }
                }, 1000);
            }
        }
    }).observe(document, { subtree: true, childList: true });

})();