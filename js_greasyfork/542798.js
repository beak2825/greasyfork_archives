// ==UserScript==
// @name         Card Skimming Sell Toggle
// @version      1.2
// @description  Toggle visibility of the Sell Details button only on Card Skimming tab.
// @author       Krimian
// @match        https://www.torn.com/page.php?sid=crimes*
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/542798/Card%20Skimming%20Sell%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/542798/Card%20Skimming%20Sell%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'cardSkimSellToggleHidden';
    let hidingEnabled = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'true');

    // CSS to hide Sell commit button only when body has class hide-sell-button
    const style = document.createElement('style');
    style.textContent = `
        body.hide-sell-button .cardskimming-root .crime-option.sell-option > button.commit-button,
        body.hide-sell-button .cardskimming-root .crime-option.sell-option .commitButtonSection___wJfnI > button.commit-button {
            display: none !important;
            pointer-events: none !important;
        }
    `;
    document.head.appendChild(style);

    // Check if we are on Card Skimming tab via URL hash or DOM presence
    function isCardSkimmingPage() {
        return location.hash.includes('cardskimming') || !!document.querySelector('.cardskimming-root');
    }

    // Add or remove 'sell-option' class to correct crime-option container
    function markSellOption() {
        const container = document.querySelector('.cardskimming-root');
        if (!container) return;

        const crimeOptions = container.querySelectorAll('.crime-option');
        for (const option of crimeOptions) {
            const labelDiv = option.querySelector('.crimeOptionSection___hslpu');
            if (labelDiv && labelDiv.textContent.trim().toLowerCase().includes('sell card details')) {
                option.classList.add('sell-option');
            } else {
                option.classList.remove('sell-option');
            }
        }
    }

    // Apply or remove CSS class on <body> to hide/show Sell button
    function applyBodyClass() {
        if (hidingEnabled) {
            document.body.classList.add('hide-sell-button');
        } else {
            document.body.classList.remove('hide-sell-button');
        }
    }

    // Add the toggle icon next to the Card Skimming title
    function addToggleIcon() {
        if (!isCardSkimmingPage()) {
            // Remove toggle if exists and exit
            const existing = document.getElementById('kw--sell-toggle-icon');
            if (existing) existing.remove();
            return;
        }
        if (document.getElementById('kw--sell-toggle-icon')) return;

        const titleDiv = document.querySelector('.titleBar___Cci85 .title___uzsf7');
        if (!titleDiv) return;

        const icon = document.createElement('span');
        icon.id = 'kw--sell-toggle-icon';
        icon.textContent = hidingEnabled ? '🔒' : '🔓';
        icon.style.cursor = 'pointer';
        icon.style.fontSize = '14px';
        icon.style.marginLeft = '8px';
        icon.style.userSelect = 'none';

        icon.addEventListener('click', () => {
            hidingEnabled = !hidingEnabled;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(hidingEnabled));
            icon.textContent = hidingEnabled ? '🔒' : '🔓';
            applyBodyClass();
        });

        titleDiv.appendChild(icon);
    }

    // Initialization: mark sell option, apply class, add toggle icon
    function init() {
        if (!isCardSkimmingPage()) {
            // Clean up on other tabs/pages
            const existing = document.getElementById('kw--sell-toggle-icon');
            if (existing) existing.remove();
            document.body.classList.remove('hide-sell-button');
            return;
        }
        markSellOption();
        applyBodyClass();
        addToggleIcon();
    }

    // Observe DOM changes and URL hash changes to maintain state
    const observer = new MutationObserver(() => {
        init();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Listen for hash changes (user tab navigation) and rerun init
    window.addEventListener('hashchange', init);

    // Run once at start
    init();

})();
