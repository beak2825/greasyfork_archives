// ==UserScript==
// @name        Hide adblock screen on FTUApps
// @namespace   Abiricade
// @match       https://ftuapps1.farlad.com/*
// @grant       none
// @version     1.0
// @author      Abiricade
// @description Hide adblock message on FTUApps
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/533265/Hide%20adblock%20screen%20on%20FTUApps.user.js
// @updateURL https://update.greasyfork.org/scripts/533265/Hide%20adblock%20screen%20on%20FTUApps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isInsideWrapper(elem) {
        let parent = elem.parentElement;
        while (parent) {
            if (
                parent.id?.toLowerCase() === 'wrapper' ||
                Array.from(parent.classList).some(cls => cls.toLowerCase() === 'wrapper')
            ) {
                return true;
            }
            parent = parent.parentElement;
        }
        return false;
    }

    function hideAnnoyingDivs() {
        const allDivs = document.querySelectorAll('div');
        allDivs.forEach(div => {
            try {
                if (isInsideWrapper(div)) return; // Skip if inside wrapper

                const style = window.getComputedStyle(div);
                const zIndex = parseInt(style.zIndex);
                const position = style.position;

                if (
                    div.id &&
                    div.classList.contains(div.id) &&
                    position === 'fixed'
                ) {
                    console.log('🚫 Hiding annoying div:', div);
                    div.style.display = 'none';
                }
            } catch (e) {
                console.warn('❗ Error checking div:', div, e);
            }
        });
    }

    window.addEventListener('load', hideAnnoyingDivs);
    setTimeout(hideAnnoyingDivs, 2000);
})();
