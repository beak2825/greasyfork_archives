// ==UserScript==
// @name        Apple iCloud: full day events border
// @description Apply the default border with the good color on full day events.
// @version     1.0.0
// @namespace   https://breat.fr
// @homepageURL https://usercssjs.breat.fr/a/apple-icloud
// @supportURL  https://discord.gg/Q8KSHzdBxs
// @match       https://www.icloud.com/calendar/
// @author      BreatFR
// @copyright   2024, BreatFR (https://breat.fr)
// @icon        https://breat.fr/static/images/userscripts-et-userstyles/a/apple-icloud/icon.jpg
// @license     AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/520897/Apple%20iCloud%3A%20full%20day%20events%20border.user.js
// @updateURL https://update.greasyfork.org/scripts/520897/Apple%20iCloud%3A%20full%20day%20events%20border.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyBorderStyle() {
        const iframes = document.querySelectorAll('iframe');

        iframes.forEach(iframe => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const buttons = iframeDoc.querySelectorAll('div:not(:has(.month-view-event-preview-start-time)) .css-6310j7 > button:not(:has(svg))');

                buttons.forEach(button => {
                    const computedStyle = getComputedStyle(button);

                // Check if a border is defined with a color
                    if (computedStyle.border && computedStyle.border !== '0px none rgba(0, 0, 0, 0)') {
                        const borderColor = computedStyle.borderColor || computedStyle.borderLeftColor;

                        // If a color is defined, apply the left border
                        if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
                            button.style.borderLeft = `3px solid ${borderColor}`;
                        }
                    }
                });
            } catch (error) {
                console.error('Erreur avec un iframe:', error);
            }
        });
    }

    const observer = new MutationObserver(applyBorderStyle);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    applyBorderStyle();
    setInterval(applyBorderStyle, 1000);
})();
