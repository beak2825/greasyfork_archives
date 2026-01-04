// ==UserScript==
// @name         AlternativeTo.net: Focus Search Hotkey
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Focus the search input on Ctrl+/ key press
// @author       mevanlc
// @match        https://alternativeto.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502814/AlternativeTonet%3A%20Focus%20Search%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/502814/AlternativeTonet%3A%20Focus%20Search%20Hotkey.meta.js
// ==/UserScript==

(function() {
    'use strict';

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === '/') {
        console.log("Focus Search on Ctrl+/ Activated!");
        e.preventDefault();
        const searchInputs = [...document.querySelectorAll('input[name="q"]')];
        if (searchInputs.length == 0) { console.warn("searchInput not found"); return; }
        const searchInput = searchInputs.pop();
        searchInput.focus();
        simulateKeyPress(searchInput);
        triggerInputChange(searchInput);
        resetFocus(searchInput);

        // Simulate a mouse click to trigger any related event listeners
        let clickEvent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
        });
        searchInput.dispatchEvent(clickEvent);
    }
});

function simulateKeyPress(element) {
    ['keydown', 'keyup'].forEach(eventType => {
        const event = new KeyboardEvent(eventType, {
            key: 'Unidentified',
            code: 'Unidentified',
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    });
}

function triggerInputChange(element) {
    element.value = '';
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

function resetFocus(element) {
    element.blur();
    setTimeout(() => element.focus(), 10);
}


  document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.altKey && event.shiftKey && event.key === 'E') {
        console.log("document.activeElement", document.activeElement);
    }
}, true);
})();

