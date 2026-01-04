// ==UserScript==
// @name         Retirer le blur sur jeuxcracks.fr / jeuxcracks
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Retire le flou de toutes les pages de jeuxcrack
// @author       ImVeryFat
// @match        *://jeuxcracks.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499086/Retirer%20le%20blur%20sur%20jeuxcracksfr%20%20jeuxcracks.user.js
// @updateURL https://update.greasyfork.org/scripts/499086/Retirer%20le%20blur%20sur%20jeuxcracksfr%20%20jeuxcracks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBlur() {
        const allElements = document.querySelectorAll('*');

        allElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.filter.includes('blur')) {
                element.style.filter = 'none';
            }
        });
    }

    removeBlur();
    const observer = new MutationObserver(removeBlur);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
})();