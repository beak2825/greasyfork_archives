// ==UserScript==
// @name         NZBGrabit Auto Cat Select
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      0.9
// @description  Adds buttons to automate selection of tabs on the NZBGrabit page, with persistent custom buttons.
// @author       JRem
// @match        https://www.nzbgrabit.org/managenzb.php?do=new*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517081/NZBGrabit%20Auto%20Cat%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/517081/NZBGrabit%20Auto%20Cat%20Select.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'custom_buttons';
    let selectionStep = 0;
    let selectedSelectors = {};

    window.addEventListener('load', function() {
        if (window.location.href.startsWith('https://www.nzbgrabit.org/managenzb.php?do=new')) {
            const pagetitle = document.querySelector('#pagetitle');

            if (pagetitle) {
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.flexDirection = 'row';
                container.style.gap = '5px';

                pagetitle.parentNode.insertBefore(container, pagetitle.nextSibling);

                const buttons = [
                    { text: 'Software', tab: '#software-tab', radio: '#ctrl_software_windows' },
                    { text: 'Game', tab: '#games-tab', radio: '#ctrl_games_pc' },
                    { text: 'Game Update', tab: '#games-tab', radio: '#ctrl_games_fixesampupdates' },
                    { text: 'Audiobook', tab: '#books-tab', radio: '#ctrl_books_audiobooks' }
                ];

                buttons.forEach(({ text, tab, radio }) => addButton(container, text, tab, radio));
                
                // Load and add custom buttons after predefined ones
                let customButtons = loadCustomButtons();
                if (!Array.isArray(customButtons)) {
                    customButtons = [];
                }
                customButtons.forEach(({ text, tab, radio }) => addButton(container, text, tab, radio, true));

                // Special button to add new buttons
                const customButton = document.createElement('button');
                customButton.textContent = 'Add Custom Button';
                customButton.style.margin = '5px';
                customButton.addEventListener('click', addCustomButton);
                container.appendChild(customButton);
            }
        }
    });

    function addButton(container, text, tabSelector, radioSelector, isCustom = false) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.margin = '5px';
        button.addEventListener('click', function() {
            const tab = document.querySelector(tabSelector);
            const radio = document.querySelector(radioSelector);
            if (tab && radio) {
                tab.click();
                radio.click();
            }
        });
        container.appendChild(button);
    }

    function addCustomButton() {
        alert("Click on the tab first, then the radio button. The script will capture the IDs automatically.");
        selectionStep = 1;
        document.addEventListener('click', captureSelectors, true);
    }

    function captureSelectors(event) {
        event.preventDefault();

        if (event.target.id === 'vbulletin_html' || !event.target.closest('a, button, input, img, div, span')) {
            return;
        }

        let selector = getNearestIdSelector(event.target);
        if (!selector) {
            alert("Could not find a valid ID for the clicked element. Try again.");
            return;
        }
        
        if (selectionStep === 1) {
            selectedSelectors.tab = selector;
            selectionStep = 2;
            alert("Now click the radio button.");
        } else if (selectionStep === 2) {
            selectedSelectors.radio = getNextInputId(event.target);
            if (!selectedSelectors.radio) {
                alert("Could not find a valid radio button. Try again.");
                return;
            }
            let name = prompt("Enter a name for the button:");
            if (name) {
                const container = document.querySelector('#pagetitle').nextSibling;
                addButton(container, name, selectedSelectors.tab, selectedSelectors.radio, true);
                saveCustomButton(name, selectedSelectors.tab, selectedSelectors.radio);
            }
            selectionStep = 0;
            selectedSelectors = {};
            document.removeEventListener('click', captureSelectors, true);
        }
    }

    function getNearestIdSelector(element) {
        while (element && !element.id) {
            element = element.parentElement;
        }
        return element && element.id ? `#${element.id}` : null;
    }

    function getNextInputId(element) {
        let nextInput = element.nextElementSibling;
        while (nextInput && nextInput.tagName !== 'INPUT') {
            nextInput = nextInput.nextElementSibling;
        }
        return nextInput && nextInput.id ? `#${nextInput.id}` : null;
    }

    function saveCustomButton(name, tabSelector, radioSelector) {
        let customButtons = loadCustomButtons();
        if (!Array.isArray(customButtons)) {
            customButtons = [];
        }
        customButtons.push({ text: name, tab: tabSelector, radio: radioSelector });
        GM_setValue(STORAGE_KEY, JSON.stringify(customButtons));
    }

    function loadCustomButtons() {
        let storedData = GM_getValue(STORAGE_KEY, '[]');
        try {
            return JSON.parse(storedData) || [];
        } catch (e) {
            return [];
        }
    }
})();
