// ==UserScript==
// @name         Auto Survey Selector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically select survey options randomly (no typing)
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534096/Auto%20Survey%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/534096/Auto%20Survey%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Randomly select radio buttons
    const radioGroups = {};
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        if (!radioGroups[radio.name]) {
            radioGroups[radio.name] = [];
        }
        radioGroups[radio.name].push(radio);
    });

    Object.values(radioGroups).forEach(group => {
        const randomRadio = group[Math.floor(Math.random() * group.length)];
        if (randomRadio) {
            randomRadio.checked = true;
            randomRadio.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    // Randomly select checkboxes (optional: select ~50% of them)
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (Math.random() < 0.5) { // 50% chance to check
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    // Randomly select options from dropdowns
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        const options = select.options;
        if (options.length > 1) {
            select.selectedIndex = Math.floor(Math.random() * options.length);
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    // Optional: Automatically click "Next" or "Continue" buttons after selections
    setTimeout(() => {
        const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
        buttons.forEach(button => {
            if (/next|continue|submit|proceed/i.test(button.innerText) || /next|continue|submit|proceed/i.test(button.value)) {
                button.click();
            }
        });
    }, 2000); // wait 2 seconds
})();
