// ==UserScript==
// @name         IDLIX Adblock Remover
// @namespace    https://www.youtube.com/channel/UC26YHf9ASpeu68az2xRKn1w
// @version      1.0
// @description  Removing any adblock detection from IDLIX website (up: Feb 27, 2025)
// @author       Kinnena
// @match        *://*.idlix.asia/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528273/IDLIX%20Adblock%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/528273/IDLIX%20Adblock%20Remover.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function removeElements() {
        const prefix = getDynamicPrefix();

        // Task 1: Remove <div class="{prefix}-blackout active">
        // removeElementsByClass(`${prefix}-blackout`);

        // Task 2: Remove <div class="{prefix}-wrapper"> with its content
        // removeElementsByClass(`${prefix}-wrapper`);

        // Task 3: Remove the specified class from the body element
        removeClassFromBody(`${prefix}-style-compact`);
        removeClassFromBody(`${prefix}-blur`);
    }

    function removeElementsByClass(className) {
        const elements = document.getElementsByClassName(className);
        for (let i = 0; i < elements.length; i++) {
            elements[i].remove();
        }
    }

    function removeClassFromBody(className) {
        const bodyElement = document.body;
        if (bodyElement) {
            bodyElement.classList.remove(className);
        }
    }

    function getDynamicPrefix() {
        const divsWithPrefix = document.querySelectorAll('[class*=blackout]');
        if (divsWithPrefix.length > 0) {
            const classNames = divsWithPrefix[0].className.split(' ');
            for (let i = 0; i < classNames.length; i++) {
                if (classNames[i].includes('blackout')) {
                    return classNames[i].replace('-blackout', '');
                }
            }
        }
        return null; // Default to null if prefix is not found
    }

    // Run the script after the page has completely loaded
    window.addEventListener('load', function() {
        removeElements();
    });

})();
