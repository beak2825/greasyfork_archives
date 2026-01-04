// ==UserScript==
// @name         Torn Crimes 2.0 - Disposal
// @version      1.0
// @namespace    https://github.com/Korbrm
// @description  Color codes disposal type based on difficulty
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @author       Korbrm [2931507]
// @license      MIT License
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481640/Torn%20Crimes%2020%20-%20Disposal.user.js
// @updateURL https://update.greasyfork.org/scripts/481640/Torn%20Crimes%2020%20-%20Disposal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const crimeTypeMappings = [
        {
            crimeType: 'Biological Waste',
            safe: ['Sink'],
            moderate: [],
            unsafe: ['Bury'],
            risky: ['Burn'],
            dangerous: ['Abandon'],
        }, {
            crimeType: 'Body Part',
            safe: [],
            moderate: [],
            unsafe: [],
            risky: [],
            dangerous: [],
        }, {
            crimeType: 'Building Debris',
            safe: ['Sink'],
            moderate: [''],
            unsafe: ['Abandon'],
            risky: ['Bury'],
            dangerous: [],
        }, {
            crimeType: 'Dead Body',
            safe: [],
            moderate: [],
            unsafe: [],
            risky: [],
            dangerous: [],
        }, {
            crimeType: 'Documents',
            safe: ['Burn'],
            moderate: [],
            unsafe: ['Bury'],
            risky: ['Abandon'],
            dangerous: ['Sink','Dissolve'],
        }, {
            crimeType: 'Firearm',
            safe: [],
            moderate: ['Sink'],
            unsafe: ['Bury'],
            risky: [],
            dangerous: ['Dissolve'],
        }, {
            crimeType: 'General Waste',
            safe: ['Bury'],
            moderate: ['Burn'],
            unsafe: ['Abandon'],
            risky: ['Sink'],
            dangerous: ['Dissolve'],
        }, {
            crimeType: 'Industrial Waste',
            safe: ['Sink'],
            moderate: [],
            unsafe: ['Bury'],
            risky: [],
            dangerous: ['Abandon'],
        }, {
            crimeType: 'Murder Weapon',
            safe: ['Sink'],
            moderate: [],
            unsafe: [],
            risky: [],
            dangerous: ['Dissolve'],
        }, {
            crimeType: 'Old Furniture',
            safe: ['Burn'],
            moderate: [''],
            unsafe: ['Abandon', 'Sink'],
            risky: ['Bury'],
            dangerous: ['Dissolve'],
        }, {
            crimeType: 'Broken Appliance',
            safe: ['Sink'],
            moderate: [],
            unsafe: ['Abandon'],
            risky: ['Bury'],
            dangerous: ['Dissolve'],
        }, {
            crimeType: 'Vehicle',
            safe: ['Sink'],
            moderate: ['Burn'],
            unsafe: ['Abandon'],
            risky: [],
            dangerous: [],
        },
    ];

    function changeButtonBorderColor(button, borderColor, borderThickness = '2px') {
        if (button) {
            button.style.border = `${borderThickness} solid ${borderColor}`;
        }
    }

    function applyBorderColorBasedOnCrimeType() {
        const crimeOptionElements = document.querySelectorAll('.crime-option');

        crimeOptionElements.forEach((crimeOptionElement) => {
            const crimeTypeElement = crimeOptionElement.querySelector('.crimeOptionSection___hslpu');
            const crimeTypeText = crimeTypeElement ? crimeTypeElement.textContent.trim() : '';

            const mapping = crimeTypeMappings.find((map) => map.crimeType === crimeTypeText);
            if (mapping) {
                const buttons = crimeOptionElement.querySelectorAll('button[aria-label]');
                buttons.forEach((button) => {
                    const buttonAriaLabel = button.getAttribute('aria-label');
                    if (mapping.safe.includes(buttonAriaLabel)) {
                        changeButtonBorderColor(button, '#37b24d', '4px');
                    } else if (mapping.moderate.includes(buttonAriaLabel)) {
                        changeButtonBorderColor(button, '#74b816');
                    } else if (mapping.unsafe.includes(buttonAriaLabel)) {
                        changeButtonBorderColor(button, '#f59f00');
                    } else if (mapping.risky.includes(buttonAriaLabel)) {
                        changeButtonBorderColor(button, '#f76707');
                    } else if (mapping.dangerous.includes(buttonAriaLabel)) {
                        changeButtonBorderColor(button, '#f03e3e');
                    }
                });
            }
        });
    }

    const observer = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                applyBorderColorBasedOnCrimeType();
            }
        }
    });

    observer.observe(document.body, { subtree: true, childList: true });
})();