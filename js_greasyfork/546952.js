// ==UserScript==
// @name         Force War Attack Links Clickable
// @namespace    http://tampermonkey.net/
// @version      Alpha1.1
// @description  Replace greyed-out Attack spans with actual clickable in Torn City.
// @author       YouMe
// @match        https://www.torn.com/factions.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546952/Force%20War%20Attack%20Links%20Clickable.user.js
// @updateURL https://update.greasyfork.org/scripts/546952/Force%20War%20Attack%20Links%20Clickable.meta.js
// ==/UserScript==
(function () {
    'use strict';

    let debug = false;
    let mutationTimeout = null;
    let scriptEnabled = true;

    function log(...args) {
        if (debug) console.log('[TornScript]', ...args);
    }

    function replaceDisabledAttackButtons() {
        const attackElements = Array.from(document.querySelectorAll('span.t-gray-9, a.custom-attack-button'));

        for (const el of attackElements) {
            const parentEnemy = el.closest('.enemy');
            if (!parentEnemy) continue;

            const profileLink = parentEnemy.querySelector('a[href^="/profiles.php?XID="]');
            if (!profileLink) continue;

            const match = profileLink.href.match(/XID=(\d+)/);
            if (!match) continue;

            const userId = match[1];

            if (scriptEnabled) {
                // If it's already a custom link, leave it alone
                if (el.tagName === 'A' && el.classList.contains('custom-attack-button')) continue;

                // If it's a span that says Attack, replace with a link
                if (el.tagName === 'SPAN' && el.textContent.trim() === 'Attack') {
                    const attackUrl = `https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`;
                    const attackLink = document.createElement('a');
                    attackLink.href = attackUrl;
                    attackLink.textContent = 'Attack';
                    attackLink.className = 'custom-attack-button';
                    attackLink.dataset.injected = 'true';
                    el.replaceWith(attackLink);
                }
            } else {
                // If it's a custom-injected link, revert it to a span
                if (el.tagName === 'A' && el.classList.contains('custom-attack-button')) {
                    const span = document.createElement('span');
                    span.textContent = 'Attack';
                    span.className = 't-gray-9';
                    span.dataset.injected = 'true'; // marks it as previously injected
                    attackLink.target = '_blank';
                    el.replaceWith(span);
                }
            }
        }
    }

    const observer = new MutationObserver(() => {
        if (mutationTimeout) clearTimeout(mutationTimeout);
        mutationTimeout = setTimeout(replaceDisabledAttackButtons, 300);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(replaceDisabledAttackButtons, 1000);

    function createToggleButton() {
        const button = document.createElement('button');
        button.textContent = 'Attack Script: ON';
        button.style.position = 'fixed';
        button.style.bottom = '5%';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '6px 10px';
        button.style.backgroundColor = '#008CBA';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.boxShadow = '0px 0px 5px rgba(0,0,0,0.3)';

        button.addEventListener('click', () => {
            scriptEnabled = !scriptEnabled;
            button.textContent = `Attack Script: ${scriptEnabled ? 'ON' : 'OFF'}`;
            button.style.backgroundColor = scriptEnabled ? '#008CBA' : '#777';
            replaceDisabledAttackButtons();
        });

        document.body.appendChild(button);
    }

    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            a.custom-attack-button {
                color: white !important;
                background-color: blue !important;
                padding: 2px 3px;
                border-radius: 4px;
                font-weight: normal;
                text-decoration: none;
                cursor: pointer;
                margin-left: 10px;
            }
        `;
        document.head.appendChild(style);
    }

    createToggleButton();
    addCustomStyles();
})();