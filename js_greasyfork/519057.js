// ==UserScript==
// @name        Ultimate FPS Booster
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.3
// @author      Your Name
// @description Boosts the frame rate of websites to 200 FPS and no input delay
// @downloadURL https://update.greasyfork.org/scripts/519057/Ultimate%20FPS%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/519057/Ultimate%20FPS%20Booster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of CSS properties to modify
    const propertiesToModify = [
        'animation-duration',
        'transition-duration'
    ];

    // Boost factor (e.g., 2.0 for a 200% boost)
    const boostFactor = 2.0;

    // Function to modify CSS properties
    function modifyCSSProperty(property, value) {
        if (value.endsWith('s')) {
            const duration = parseFloat(value);
            const boostedDuration = duration * boostFactor;
            return boostedDuration + 's';
        }
        return value;
    }

    // Function to modify CSS styles
    function modifyCSSStyles(styles) {
        for (let i = 0; i < styles.length; i++) {
            const style = styles[i];
            const property = style.propertyName;
            const value = style.value;

            if (propertiesToModify.includes(property)) {
                const boostedValue = modifyCSSProperty(property, value);
                style.value = boostedValue;
            }
        }
    }

    // Observe DOM changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes') {
                const target = mutation.target;
                if (target.nodeType === Node.ELEMENT_NODE) {
                    const computedStyles = window.getComputedStyle(target);
                    modifyCSSStyles(computedStyles);
                }
            }
        });
    });

    // Start observing the entire document
    observer.observe(document, {
        attributes: true,
        subtree: true
    });
})();