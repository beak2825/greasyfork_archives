// ==UserScript==
// @name         X/Twitter Display Settings Sidebar Button
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds back the button for display settings in the sidebar, changing simple colours shouldn't need cost money, Elon.
// @author       Lupo01 (Y0ICHI)
// @license      MIT
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531238/XTwitter%20Display%20Settings%20Sidebar%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/531238/XTwitter%20Display%20Settings%20Sidebar%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SELECTORS = {
        SIDEBAR: 'nav[aria-label="Primary"][role="navigation"]',
        MORE_BUTTON: 'button[data-testid="AppTabBar_More_Menu"]',
        LINK_TEMPLATE: 'a[href*="/i/bookmarks"], a[href*="/Lupo01_/communities"]'
    };

    function init() {
        const observer = new MutationObserver(() => {
            const sidebar = document.querySelector(SELECTORS.SIDEBAR);
            const moreButton = document.querySelector(SELECTORS.MORE_BUTTON);
            const templateLink = document.querySelector(SELECTORS.LINK_TEMPLATE);

            if (sidebar && moreButton && templateLink && !document.getElementById('display-settings-button')) {
                observer.disconnect();
                addDisplaySettingsButton(sidebar, moreButton, templateLink);
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});
        setTimeout(() => observer.disconnect(), 10000);
    }

    function addDisplaySettingsButton(sidebar, moreButton, templateLink) {
        const displayButton = templateLink.cloneNode(true);
        displayButton.id = 'display-settings-button';
        displayButton.href = '/settings/display';
        displayButton.removeAttribute('data-testid');
        displayButton.removeAttribute('aria-selected');

        // Modifica il testo
        const textSpan = displayButton.querySelector('[dir="ltr"] span');
        if (textSpan) {
            textSpan.textContent = 'Display Settings';
        }

        // Modifica l'icona
        const iconContainer = displayButton.querySelector('svg').parentElement;
        iconContainer.innerHTML = `
            <svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e">
                <g>
                    <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path>
                </g>
            </svg>
        `;

        // Inserisci prima del pulsante "More"
        moreButton.parentElement.insertBefore(displayButton, moreButton);

        // Aggiungi stili per l'hover
        displayButton.style.transition = 'background-color 0.2s';
        displayButton.addEventListener('mouseover', () => {
            displayButton.style.backgroundColor = 'rgba(231, 233, 234, 0.1)';
        });
        displayButton.addEventListener('mouseout', () => {
            displayButton.style.backgroundColor = 'transparent';
        });
    }

    // Avvia lo script
    init();

    // Gestione SPA
    let currentPath = location.pathname;
    setInterval(() => {
        if (location.pathname !== currentPath) {
            currentPath = location.pathname;
            setTimeout(init, 500);
        }
    }, 100);
})();