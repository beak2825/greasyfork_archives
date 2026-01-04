// ==UserScript==
// @name         DMM - All Results & Polish Filter
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  Adds a "Show All Results" button and a Polish filter button to Debrid Media Manager.
// @author       Your Assistant & tomfle
// @match        *://*.debridmediamanager.com/movie/*
// @match        *://*.debridmediamanager.com/show/*/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546703/DMM%20-%20All%20Results%20%20Polish%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/546703/DMM%20-%20All%20Results%20%20Polish%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SETTINGS AND GLOBAL VARIABLES ---
    const SHOW_ALL_BUTTON_ID = 'show-all-results-btn';
    const POLISH_FILTER_BUTTON_ID = 'polish-filter-btn';
    const CHECK_INTERVAL = 500; // Time in ms, how often the script checks for a new button

    // This regex is for finding Polish language releases. The keywords are names of Polish release groups or common terms.
    const POLISH_REGEX = String.raw`(\b(-ft|-ok|3d11|a4o|adl|afo|agusiq|al3x|ale13|alusia|anonim|as76|azjatycki|azq|b89|best-torrents|bida|bigbbs|bird|bodzio|bp007|brx|cambio|chopin|chrisvps|cinemaet|colo|cool-torents|cru|d11|dabrjarek|deix|denda|dream|dsite|dubbpl|dzidek|eend|electro-torrent|elladajarek|emis|enter1973|esperanza|eteam|evil-bad|evil-torrents|ex-torrenty|feld|filetracker|fiona9|fpl|gamer158|ghn|ghw|gr4pe|gun|h3q|hen|hmdb|ht|intgrity|izyk|j25|j60|joanna668|k041|k12|k37|k8|k83|kbuso|kde|kiko|kilkr|kit|klio|kolekcja|kpfr|krt|ksq|lektor|lektorpl|lex|limit|llo|ltn|lts|lysol1|m56|m80|maksim80|marcin0313|marjos83|maxim|maxx|miniserial|mins|mixio|mors|mr|n0b0dy|n0l4|napiproject|napisy|napisypl|neo|nicollubin|nine|nitroteam|nn|nonano|noq|odc|odcinek|odison|ozw|p2p|paczka|pdlg|pirateszone|pixi|pl|pl_1080p_web|pldub|plsub|plsubbed|pol|polish|polski|polskie-torrenty|polskipl|presa|psig|psotnik|ptrg|r22|r68|ralf|raven|rekonstrukcja|robsil|rx|s56|sav|sezon|sfpi|shadows-torrents|sharpe|sk13|snoop|spajk85|spedboy|starlord|starlordx|superseed|sy5ka|syntezator|syrix|taboon1|tds|tfsh|toalien|top2p|topfilmyfilmweb|torrentmaniak|torrenty|vantablack|wasik|wersja|wilu|wilu75|wizards|wosiu|xte|xtorrenty|xupload|zbyszek|zet|zyl|rip+by+raptcat|ekipa+tnt)\b)|(ą|ć|ę|ł|ń|ś|ź|ż)`;
    const POLISH_FILTER_BUTTON_TEXT = '🇵🇱';

    // --- FUNCTIONS FOR "SHOW ALL RESULTS" BUTTON ---

    function findShowMoreButton() {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button =>
            button.textContent?.trim() === 'Show More Results' &&
            button.offsetParent !== null
        ) || null;
    }

    function waitForNextButton() {
        return new Promise((resolve) => {
            const maxAttempts = 20; // Max 10 seconds
            let attempts = 0;
            const interval = setInterval(() => {
                const button = findShowMoreButton();
                if (button) {
                    clearInterval(interval);
                    resolve(button);
                } else if (++attempts >= maxAttempts) {
                    clearInterval(interval);
                    resolve(null);
                }
            }, CHECK_INTERVAL);
        });
    }

    async function fetchAllResults(showAllButton) {
        let pageCount = 1;
        showAllButton.textContent = `Loading page ${pageCount}...`;
        showAllButton.disabled = true;

        let showMoreButton = findShowMoreButton();
        while (showMoreButton) {
            showMoreButton.click();
            showMoreButton.style.display = 'none';
            showMoreButton = await waitForNextButton();
            if (showMoreButton) {
                pageCount++;
                showAllButton.textContent = `Loading page ${pageCount}...`;
            }
        }

        showAllButton.textContent = 'All results loaded';
        showAllButton.style.borderColor = '#22c55e';
        showAllButton.style.backgroundColor = 'rgba(34, 197, 94, 0.3)';
        showAllButton.style.color = '#dcfce7';
        showAllButton.style.fontWeight = 'bold'; // Set font to bold
        showAllButton.disabled = true;
    }

    function createShowAllButton() {
        if (!findShowMoreButton() || document.getElementById(SHOW_ALL_BUTTON_ID)) {
            return;
        }

        const buttons = Array.from(document.querySelectorAll('button'));
        const showRelatedButton = buttons.find(b => b.textContent?.includes('Show Related'));
        if (!showRelatedButton || !showRelatedButton.parentNode) {
            return;
        }
        const targetContainer = showRelatedButton.parentNode;

        const showAllButton = document.createElement('button');
        showAllButton.textContent = 'Show All Results';
        showAllButton.id = SHOW_ALL_BUTTON_ID;
        showAllButton.className = showRelatedButton.className;
        showAllButton.style.marginLeft = '0.5rem';
        showAllButton.style.fontWeight = 'bold'; // Set font to bold

        showAllButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fetchAllResults(showAllButton);
        });

        targetContainer.appendChild(showAllButton);
    }

    // --- FUNCTIONS FOR POLISH FILTER BUTTON ---

    function createPolishFilterButton() {
        const filterInput = document.querySelector('input#query');
        const buttonContainer = document.querySelector('.flex.items-center.gap-2.overflow-x-auto');

        if (filterInput && buttonContainer && !buttonContainer.querySelector(`#${POLISH_FILTER_BUTTON_ID}`)) {
            const newButton = document.createElement('button');
            newButton.id = POLISH_FILTER_BUTTON_ID;
            newButton.textContent = POLISH_FILTER_BUTTON_TEXT;
            newButton.className = 'cursor-pointer whitespace-nowrap rounded border border-cyan-500 bg-transparent px-2 py-1 text-xs text-blue-100 transition-colors hover:bg-cyan-900/50';
            newButton.style.order = '-1'; // Sets the button as the first one

            newButton.addEventListener('click', function() {
                // This method is needed to correctly update the value in React applications
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    'value'
                ).set;
                nativeInputValueSetter.call(filterInput, POLISH_REGEX);

				// Simulate events so React notices the change
				const inputEvent = new Event('input', { bubbles: true, cancelable: true });
				const changeEvent = new Event('change', { bubbles: true, cancelable: true }); // <-- DODANE

				filterInput.focus(); // <-- DODANE
				filterInput.dispatchEvent(inputEvent);
				filterInput.dispatchEvent(changeEvent); // <-- DODANE
				filterInput.blur(); // <-- DODANE
            });

            buttonContainer.prepend(newButton);
        }
    }

    // --- MAIN LOGIC AND OBSERVER ---

    function initializeButtons() {
        createShowAllButton();
        createPolishFilterButton();
    }

    const observer = new MutationObserver((mutationsList, obs) => {
        // The initializeButtons function has built-in safeguards,
        // so it can be safely called multiple times.
        initializeButtons();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Run the function once at the beginning, just in case
    setTimeout(initializeButtons, 1500);
})();