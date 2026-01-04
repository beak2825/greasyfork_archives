// ==UserScript==
// @name         Hypixel forums: no clickable spoilers/colored text in messages
// @namespace    http://tampermonkey.net/
// @version      2024-03-01
// @description  Lol
// @author       unicornbetrayal
// @match        https://hypixel.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hypixel.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488488/Hypixel%20forums%3A%20no%20clickable%20spoilerscolored%20text%20in%20messages.user.js
// @updateURL https://update.greasyfork.org/scripts/488488/Hypixel%20forums%3A%20no%20clickable%20spoilerscolored%20text%20in%20messages.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeSpoilers(className) {
        var elements = document.querySelectorAll('.' + className);
        elements.forEach(function(element) {
            delete element.dataset.xfClick;
            element.classList.remove(className);
        });
    }
    function changeColorToBlack() {
        var elements = document.querySelectorAll('span[style*="color"]');
        elements.forEach(function(element) {
            if (!element.closest('aside.message-signature')) {
                if (element.dataset.originalColor) {
                    element.style.color = element.dataset.originalColor;
                    delete element.dataset.originalColor;
                } else {
                    element.dataset.originalColor = element.style.color;
                    element.style.color = 'rgb(0, 0, 0)';
                }
            }
        });
    }
    var shiftPressed = false;
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Shift') {
            shiftPressed = true;
        } else if (event.key === 'C' && shiftPressed) {
            changeColorToBlack();
        }
    });
    document.addEventListener('keyup', function(event) {
        if (event.key === 'Shift') {
            shiftPressed = false;
        }
    });
    removeSpoilers('bbCodeInlineSpoiler');
    changeColorToBlack();
})();