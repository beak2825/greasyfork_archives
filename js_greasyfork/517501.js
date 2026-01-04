// ==UserScript==
// @name         Auto Drawing Detail For 1Factory
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Update the drawing detail automatically
// @author       Austin
// @license      MIT
// @match        https://www.1factory.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/517501/Auto%20Drawing%20Detail%20For%201Factory.user.js
// @updateURL https://update.greasyfork.org/scripts/517501/Auto%20Drawing%20Detail%20For%201Factory.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.getElementById('js-drawing-detail');

    if (button) {
        var isVisible = GM_getValue("isDrawingDetailVisible", false);
        if (isVisible) {
            button.click();
        }

        document.querySelector('.flex-item.shade').style.setProperty('display', 'none');
        document.querySelector('.animated.flex.shade-container').style.setProperty('display', 'none');

        // Mutuation for visibility
        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    isVisible = !mutation.target.classList.contains('hidden');
                    GM_setValue("isDrawingDetailVisible", isVisible);
                }
            });
        }).observe(document.querySelector('section.animated.pane-container--drawing-detail'), {
            attributes: true,
            attributeFilter: ['class']
        });

        // Mutation for selected cell change
        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (isVisible) {
                    // Check if the 'current' class is added or removed
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const classList = mutation.target.classList;
                        // Run code only if the 'current' class is added
                        if (classList.contains('current')) {
                            button.click();
                        }
                    }
                }
            });
        }).observe(document.querySelector("table"), {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }
})();
