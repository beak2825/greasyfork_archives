// ==UserScript==
// @name         WritingTeam - Noncompliant Writing On Top Navbar
// @namespace    http://tampermonkey.net/
// @version      2025-07-02
// @description  Adds a "Noncompliant Writing Hub" button to both desktop and mobile navbars
// @author       Player1041
// @match        https://retroachievements.org/*
// @icon         https://static.retroachievements.org/assets/images/favicon.webp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543402/WritingTeam%20-%20Noncompliant%20Writing%20On%20Top%20Navbar.user.js
// @updateURL https://update.greasyfork.org/scripts/543402/WritingTeam%20-%20Noncompliant%20Writing%20On%20Top%20Navbar.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Script loaded, waiting for navbars...");

    const NAV_SELECTORS = [
        "body > div > nav.z-20.flex.flex-col.w-full.justify-center.bg-embedded.lg\\:sticky.lg\\:top-0 > div > div > div.flex-1.mx-2.hidden.lg\\:flex > div:nth-child(4)", // Desktop navbar
        "nav.z-10.lg\\:hidden > div > div > div:nth-child(4)" // Mobile navbar
    ];

    const hubButtonHTML = `
        <a class="nav-link" target="_self" href="https://retroachievements.org/hub/24397" title="Noncomp Writing">
            <svg class="icon" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/>
            </svg>
            <span class="ml-1 hidden sm:inline-block">Noncompliant Writing Hub</span>
        </a>`;

    const waitForElements = (selectors, callback) => {
        const observer = new MutationObserver(() => {
            let foundAll = true;
            const elements = selectors.map(sel => {
                const el = document.querySelector(sel);
                if (!el) foundAll = false;
                return el;
            });
            if (foundAll) {
                observer.disconnect();
                callback(elements);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    waitForElements(NAV_SELECTORS, (targets) => {
        targets.forEach((targetDiv, i) => {
            if (!targetDiv) return;
            console.log(`Injecting hub button into navbar ${i + 1}`);
            const hubButton = document.createElement('div');
            hubButton.className = "nav-item";
            hubButton.innerHTML = hubButtonHTML;
            targetDiv.insertAdjacentElement('afterend', hubButton);
        });
    });

})();
