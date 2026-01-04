// ==UserScript==
// @name         Google Translate - Switch Languages Hotkey
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes tab a hotkey to swap languages.
// @author       Meztihn
// @match        http*://translate.google.com/*
// @match        http*://translate.google.co.uk/*
// @match        http*://translate.google.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369174/Google%20Translate%20-%20Switch%20Languages%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/369174/Google%20Translate%20-%20Switch%20Languages%20Hotkey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tabKeyCode = 'Tab';
    const sourceTextArea = document.getElementById('source')
    const swapLanguagesButton = document.getElementById('gt-swap');

    sourceTextArea.addEventListener('keydown', onKeyDown, { capture: true });

    function onKeyDown(event) {
        if (event.code === tabKeyCode) {
            swapLanguages();
            event.preventDefault(); // prevents active element change and thus focus lose
        }
    }

    function swapLanguages() {
        click(swapLanguagesButton);

        // Standard click() doesn't work
        function click(button) {
            button.dispatchEvent(new MouseEvent('mouseover'));
            button.dispatchEvent(new MouseEvent('mousedown'));
            button.dispatchEvent(new MouseEvent('mouseup'));
        }
    }
})();