// ==UserScript==
// @name         JPDB add context menu in reviews
// @namespace    jpdb.io
// @version      0.1.2
// @description  Adds a new word's context menu from its top deck in JPDB reviews
// @author       daruko
// @match        https://jpdb.io/review*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471987/JPDB%20add%20context%20menu%20in%20reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/471987/JPDB%20add%20context%20menu%20in%20reviews.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const debug = false;

    let menuDetails = init();
    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, { childList: true, subtree: true });

    function handleMutation(mutations) {
        if (!menuDetails || !document.body.contains(menuDetails)) {
            menuDetails = init();
        }
    }

    function init() {
        const wordUri = document.querySelector('.review-reveal .answer-box a[href^="/vocabulary"]')?.href;
        const deckUri = document.querySelector('.review-reveal a[href^="/deck"]')?.href;
        if (!wordUri || !deckUri) {
            debug && console.debug('URI not found');
            return;
        }
        const [,, wordId, word] = new URL(wordUri).pathname.split('/', 4);
        if (!word) {
            debug && console.debug('Word URI not recognized');
            return;
        }
        return createDropdownButton(wordId, word, deckUri);
    }

    function createDropdownButton(wordId, word, deckUri) {
        const sideButton = document.querySelector('.review-button-group .side-button');
        if (!sideButton) {
            debug && console.debug('Side button not found');
            return;
        }
        const buttonWrapper = document.createElement("div");
        buttonWrapper.style = "display: flex; flex-direction: column;";
        sideButton.style = "flex-grow: 1;" + sideButton.style;
        sideButton.parentNode.insertBefore(buttonWrapper, sideButton);
        buttonWrapper.appendChild(sideButton);

        const dropdownButtonLabel = document.createElement("label");
        dropdownButtonLabel.className = "side-button";
        dropdownButtonLabel.style = "margin-top: 0;";
        const dropdownButtonDiv = document.createElement("div");
        dropdownButtonDiv.className = "dropdown right-aligned";
        dropdownButtonLabel.appendChild(dropdownButtonDiv);
        const dropdownButtonDetails = document.createElement("details");
        dropdownButtonDiv.appendChild(dropdownButtonDetails);
        const dropdownButtonSummary = document.createElement("summary");
        dropdownButtonSummary.style = "padding: 0; border: none;";
        dropdownButtonSummary.appendChild(document.createTextNode("⋮"));
        dropdownButtonDetails.appendChild(dropdownButtonSummary);
        buttonWrapper.appendChild(dropdownButtonLabel);

        const onToggle = () => {
            useDropdown(dropdownButtonDetails, wordId, word, deckUri)
                .then(() => dropdownButtonDetails.removeEventListener("toggle", onToggle));
        };
        dropdownButtonDetails.addEventListener("toggle", onToggle);

        return dropdownButtonDetails;
    }

    async function useDropdown(details, wordId, word, deckUri) {
        const filteredDeckUri = `${deckUri}&q=${word}`;
        const fallbackDeckUri = `${deckUri.replace(/id=[0-9]+/, 'id=global')}&q=${word}`;
        let dropdownContent = await loadDropdown(filteredDeckUri, wordId);
        if (!dropdownContent) {
            debug && console.debug('Dropdown not found in the primary deck page');
            dropdownContent = await loadDropdown(fallbackDeckUri, wordId);
            if (!dropdownContent) {
                debug && console.debug('Dropdown not found in the global deck page');
                return;
            }
        }
        details.appendChild(dropdownContent);
        const offset = Math.min(details.getBoundingClientRect().left - dropdownContent.offsetWidth,
            details.parentElement.offsetWidth);
        dropdownContent.style = `bottom: 0; right: ${offset}px;` + dropdownContent.style;
        return dropdownContent;
    }

    function loadDropdown(uri, wordId) {
        return fetch(uri)
            .then((response) => response.text())
            .then((text) => {
                const html = new DOMParser().parseFromString(text, "text/html");
                return html.querySelector(`.entry .vocabulary-spelling a[href^="/vocabulary/${wordId}"]`)
                    ?.closest('.entry')
                    ?.querySelector('.dropdown details .dropdown-content');
            })
            .catch((err) => {
                console.error('An error has occurred.', err);
            });
    }
})();
