// ==UserScript==
// @name         Serval Takealot price tracker - Link Helper
// @namespace    your-namespace-here
// @version      1.7
// @description  Press Alt + S to open Serval Tracker for the current product on Takealot. Also adds a link with icon to the sidebar above the current price.
// @match        https://www.takealot.com/*
// @icon         https://www.takealot.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504057/Serval%20Takealot%20price%20tracker%20-%20Link%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/504057/Serval%20Takealot%20price%20tracker%20-%20Link%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SERVAL_ICON_URL = 'https://www.servaltracker.com/static/images/favicons/serval_favicon_48x48.png';

    function getServalTrackerUrl() {
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            const currentUrl = window.location.href;
            const urlParts = currentUrl.split('/');
            const lastPart = urlParts[urlParts.length - 1].split('?')[0];
            return `https://www.servaltracker.com/products/${lastPart}`;
        }
        const hrefParts = canonicalLink.href.split('/');
        const lastPart = hrefParts[hrefParts.length - 1];
        return `https://www.servaltracker.com/products/${lastPart}`;
    }

    function createServalTrackerLink() {
        const servalTrackerUrl = getServalTrackerUrl();
        const linkElement = document.createElement('a');
        linkElement.href = servalTrackerUrl;
        linkElement.target = '_blank';
        linkElement.style.display = 'flex';
        linkElement.style.alignItems = 'center';
        linkElement.style.marginBottom = '10px';
        linkElement.style.textDecoration = 'none';
        linkElement.style.color = 'inherit';

        const iconElement = document.createElement('img');
        iconElement.src = SERVAL_ICON_URL;
        iconElement.width = 24;
        iconElement.height = 24;
        iconElement.style.marginRight = '8px';

        const textElement = document.createElement('span');
        textElement.textContent = 'Track price';
        textElement.style.color = '#0b79bf';

        textElement.addEventListener('mouseover', function() {
            textElement.style.textDecoration = 'underline';
        });

        textElement.addEventListener('mouseout', function() {
            textElement.style.textDecoration = 'none';
        });

        linkElement.appendChild(iconElement);
        linkElement.appendChild(textElement);

        return linkElement;
    }

    function prependServalTrackerLink() {
        const sidebar = document.querySelector('aside[class*="pdp-module_side-bar_"]');
        if (sidebar) {
            let existingLink = sidebar.querySelector('a[href*="servaltracker.com"]');
            if (existingLink) {
                existingLink.href = getServalTrackerUrl();
            } else {
                const linkElement = createServalTrackerLink();
                sidebar.insertBefore(linkElement, sidebar.firstChild);
            }
        }
    }

    function observeCanonicalLink() {
        const observer = new MutationObserver(() => {
            if (document.querySelector('link[rel="canonical"][data-react-helmet="true"]')) {
                prependServalTrackerLink();
            }
        });
        observer.observe(document.head, { childList: true, subtree: true });
    }

    function observeSidebar() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const sidebar = document.querySelector('aside[class*="pdp-module_side-bar_"]');
                    if (sidebar) {
                        prependServalTrackerLink();
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function openServalTrackerTab() {
        const servalTrackerUrl = getServalTrackerUrl();
        window.open(servalTrackerUrl, '_blank');
    }

    document.addEventListener('keydown', (event) => {
        if (event.altKey && event.code === 'KeyS') {
            openServalTrackerTab();
        }
    });

    observeSidebar();
    observeCanonicalLink();
})();
