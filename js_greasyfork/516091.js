// ==UserScript==
// @name         Paste Essays(editable) (Acellus)
// @namespace    https://github.com/YeesterPlus
// @version      1.0
// @description  Essays are kinda dead to me
// @author       YeesterPlus
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acellus.com
// @match        https://admin192a.acellus.com/student/*
// @grant        none
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/516091/Paste%20Essays%28editable%29%20%28Acellus%29.user.js
// @updateURL https://update.greasyfork.org/scripts/516091/Paste%20Essays%28editable%29%20%28Acellus%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Define the text to be typed
    var textToType = "Paste here";

     // Function to simulate typing as a user
    function typeTextAsUser(element, text) {
        var index = 0;
        var event = new KeyboardEvent('keydown', { key: '', code: '' });
        var inputEvent = new Event('input', { bubbles: true });

        var interval = setInterval(function() {
            // Simulate typing one character at a time
            element.textContent += text.charAt(index);
            element.dispatchEvent(inputEvent);
            element.dispatchEvent(event);
            index++;

            // Stop typing when text is fully typed
            if (index >= text.length) {
                clearInterval(interval);
            }
        }, 5); // Very fast typing speed
    }

    // Function to open the popup
    async function openPopup() {
        typeTextAsUser(document.activeElement, await navigator.clipboard.readText());
    }

    // Add event listener for when text inputs gain focus
    document.onkeydown = function interceptKeys(evt) {
    evt = evt||window.event // IE support
    var c = evt.keyCode
    var ctrlDown = evt.ctrlKey||evt.metaKey // Mac support

    // Check for Alt+Gr (http://en.wikipedia.org/wiki/AltGr_key)
    if (ctrlDown && evt.altKey) return true

    // Check for ctrl+c, v and x
    if (ctrlDown && c==86) openPopup() // v

    // Otherwise allow
    return true
} // Use capture phase to ensure event is caught before any other handlers

})();