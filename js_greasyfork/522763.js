// ==UserScript==
// @name         CrunchyMAL Cross Search
// @namespace    CrunchyMAL-CS
// @version      2.3
// @description  Add MyAnimeList button to Crunchyroll pages and vice-versa.
// @author       Mattari
// @match        *://*.crunchyroll.com/*
// @match        *://*.myanimelist.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522763/CrunchyMAL%20Cross%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/522763/CrunchyMAL%20Cross%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // General function to create buttons
    function createButton(text, url, bgColor, textColor) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.fontWeight = 'bold';
        button.style.marginLeft = '10px';
        button.style.padding = '5px 10px';
        button.style.borderRadius = '5px';
        button.style.border = 'none';
        button.style.outline = 'none';
        button.style.color = textColor;
        button.style.backgroundColor = bgColor;
        button.style.whiteSpace = 'nowrap';
        button.onclick = () => {
            window.open(url, '_blank');
        };
        return button;
    }

    // Function to process Crunchyroll page
    function processCrunchyrollPage() {
        try {
            const targetElement = document.querySelector('div.erc-ratings');
            if (targetElement && !targetElement.nextElementSibling?.textContent.includes('MyAnimeList')) { // Check if the button is already added
                console.log("CrunchyMAL [Info]: Found target location for button.");

                const crURL = window.location.href;
                const titleText = crURL.substring(crURL.lastIndexOf('/') + 1).replace(/-/g, ' ');
                const button = createButton('Find\u00A0on\u00A0MyAnimeList', `https://myanimelist.net/search/all?q=${encodeURIComponent(titleText)}`, '#2e4f9e', 'white');
                targetElement.insertAdjacentElement('afterend', button);

                // Unload script and clean up
                unloadScript();
            }
        } catch (error) {
            console.error('CrunchyMAL [Error]: ', error);
        }
    }

    // Function to process MyAnimeList page
    function processMyAnimeListPage() {
        try {
            const titleDiv = document.querySelector('div.h1-title');
            if (titleDiv && !titleDiv.nextElementSibling?.textContent.includes('CrunchyRoll')) { // Check if the button is already added
                console.log("CrunchyMAL [Info]: Found target location for button.");
                const titleText = document.querySelector('div.h1-title p.title-english').textContent.trim();
                const button = createButton('Find\u00A0on\u00A0CrunchyRoll', `https://www.crunchyroll.com/search?from=&q=${encodeURIComponent(titleText)}`, '#ff7b2e', 'white');
                titleDiv.insertAdjacentElement('afterend', button);

                // Unload script and clean up
                unloadScript(null);
            }
        } catch (error) {
            console.error('CrunchyMAL [Error]: ', error);
        }
    }

    // Function to observe DOM changes for Crunchyroll
    function observeCrunchyrollDOMChanges() {
        let timeoutId;
        const observer = new MutationObserver(() => {
            clearTimeout(timeoutId);
            processCrunchyrollPage();
            timeoutId = setTimeout(() => {
                processCrunchyrollPage();
                observer.disconnect();
                console.log("CrunchyMAL [Info]: CrunchyMAL page observer safely removed, hopfully without the button disappearing.");
            }, 5000); // Adjust the timeout as needed
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function to unload the script and clean up
    function unloadScript() {
        window.removeEventListener('load', onLoadHandler);
        if (window.MutationObserver) delete window.MutationObserver;
        if (window.document) delete window.document;
        console.log("CrunchyMAL [Info]: Script unloaded and memory cleaned up.");
    }

    // Load handler function
    function onLoadHandler() {
        try {
            const hostname = window.location.hostname;
            const pathname = window.location.pathname;
            if (hostname.includes('crunchyroll.com')) {
                observeCrunchyrollDOMChanges();
            } else if (hostname.includes('myanimelist.net') && pathname.startsWith('/anime/')) {
                processMyAnimeListPage();
            }
        } catch (error) {
            console.error('CrunchyMAL [Error]: ', error);
        }
    }

    // Ensure the script runs after the page has fully loaded
    window.addEventListener('load', onLoadHandler);

})();
