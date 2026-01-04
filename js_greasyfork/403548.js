// ==UserScript==
// @name         GFL calculator checkbox saver
// @namespace    https://github.com/Amasoken/scripts
// @version      0.11
// @description  Load Logistics calculator checkboxes on page reload.
// @author       Amasoken
// @match        https://gfeasdf.github.io/gf/main.html
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/403548/GFL%20calculator%20checkbox%20saver.user.js
// @updateURL https://update.greasyfork.org/scripts/403548/GFL%20calculator%20checkbox%20saver.meta.js
// ==/UserScript==

/*
A tool for a tool for a game.
Girls Frontline Logistics calculator: https://gfeasdf.github.io/gf/main.html

After you check some checkboxes and calculate logistics, if you reload the page, you'll need to check everything again.
With this script the checkbox values will be remembered on the page reload, so you don't have to check them again.
*/

(function () {
    'use strict';

    const LOCAL_STORAGE_KEY = 'Logistic_Loader_Boxes';

    const initializeValues = () => {
        try {
            if (loadValues()) {
                console.log('Sucessfully loaded checkbox values.');
            } else {
                saveValues();
            }
        } catch {
            console.log('Page not loaded yet, trying again.');
            setTimeout(initializeValues, 500);
        }
    };

    const saveValues = () => {
        const checkboxes = document.querySelectorAll('input[type=checkbox]');
        const checks = Array.prototype.map.call(checkboxes, (x) => x.checked);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(checks));
        console.log('Sucessfully updated checkbox values.');
    };

    const loadValues = () => {
        const checkboxValues = [];
        const checkboxes = document.querySelectorAll('input[type=checkbox]');

        for (const checkbox of checkboxes) {
            checkbox.addEventListener('change', () => saveValues());
        }

        try {
            checkboxValues.push(...JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)));
        } catch (error) {
            console.error(error);
            console.log("Couldn't load checkbox values.");
            return false;
        }

        for (let i = 0; i < checkboxValues.length; i++) {
            checkboxes[i].checked = checkboxValues[i];
        }

        return true;
    };

    window.addEventListener('load', initializeValues);
})();
