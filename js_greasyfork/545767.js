// ==UserScript==
// @name                SteamDB quick jump to Steam
// @name:zh-CN          SteamDB 快速跳转至 Steam
// @namespace           http://tampermonkey.net/
// @version             1.1
// @description         Press 1 to jump to Steam
// @description:zh-CN   在SteamDB链接上按1键快速跳转到Steam商店
// @author              BW
// @match               https://steamdb.info/*
// @grant               GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545767/SteamDB%20quick%20jump%20to%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/545767/SteamDB%20quick%20jump%20to%20Steam.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let currentHoveredLink = null;
    document.addEventListener('mouseover', function(event) {
        const target = event.target;
        if (target.classList.contains('ais-Highlight-nonHighlighted') ||
            target.classList.contains('ais-Highlight')) {
            currentHoveredLink = null;
            let currentElement = target.parentElement;
            while (currentElement && currentElement !== document.body) {
                if (currentElement.tagName === 'A' &&
                    currentElement.href &&
                    currentElement.href.includes('/app/')) {
                    const match = currentElement.href.match(/\/app\/(\d+)(?:\/.*)?/);
                    if (match) {
                        currentHoveredLink = {
                            element: currentElement,
                            appId: match[1]
                        };
                        return;
                    }
                }
                const linkInElement = currentElement.querySelector('a[href*="/app/"]');
                if (linkInElement) {
                    const match = linkInElement.href.match(/\/app\/(\d+)(?:\/.*)?/);
                    if (match) {
                        currentHoveredLink = {
                            element: linkInElement,
                            appId: match[1]
                        };
                        return;
                    }
                }
                currentElement = currentElement.parentElement;
            }
        }
        if (target.tagName === 'TD') {
            currentHoveredLink = null;
            const linkInTd = target.querySelector('a[href*="/app/"]');
            if (linkInTd) {
                const match = linkInTd.href.match(/\/app\/(\d+)(?:\/.*)?/);
                if (match) {
                    currentHoveredLink = {
                        element: linkInTd,
                        appId: match[1]
                    };
                    return;
                }
            }
        }
        const linkElement = target.closest('a[href*="/app/"]');
        if (linkElement && linkElement.href) {
            currentHoveredLink = null;
            const match = linkElement.href.match(/\/app\/(\d+)(?:\/.*)?/);
            if (match) {
                currentHoveredLink = {
                    element: linkElement,
                    appId: match[1]
                };
            }
        }
    });
    document.addEventListener('mouseout', function(event) {
        const target = event.target;
        const linkElement = target.closest('a[href*="/app/"]');
        if (currentHoveredLink && linkElement === currentHoveredLink.element) {
            const relatedTarget = event.relatedTarget;
            if (!relatedTarget || !currentHoveredLink.element.contains(relatedTarget)) {
                currentHoveredLink = null;
            }
        }
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === '1') {
            if (currentHoveredLink && currentHoveredLink.appId) {
                const steamStoreUrl = `https://store.steampowered.com/app/${currentHoveredLink.appId}/`;
                GM_openInTab(steamStoreUrl, {
                    active: false,
                    insert: true,
                    setParent: true
                });
            }
        }
    });
})();