// ==UserScript==
// @name         Auto Dorks for Google
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically prepends dorks to Google search queries.
// @author       OpticOddities
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479896/Auto%20Dorks%20for%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/479896/Auto%20Dorks%20for%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getSearchBox = () => document.querySelector('textarea[name="q"], input[name="q"]');
    const isGoogle = () => location.hostname.includes("google.");

    function updateGoogleQuery() {
        if (isGoogle()) {
            const searchBox = getSearchBox();
            if (!searchBox) return;

            let query = searchBox.value.replace(/before:\d{4}-\d{2}-\d{2}|after:\d{4}-\d{2}-\d{2}/g, '').trim();
            ['beforeDate', 'afterDate'].forEach(key => {
                if (GM_getValue(key + "Enabled", false)) {
                    const date = GM_getValue(key, '');
                    if (date) query = `${key.split('Date')[0]}:${date} ${query}`;
                }
            });

            searchBox.value = query;
        }
    }

    function createDateField(labelText, key) {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `<input type="checkbox" id="${key}Enabled" ${GM_getValue(key + "Enabled", false) ? 'checked' : ''}><label for="${key}Enabled">${labelText}</label><input type="date" id="${key}" ${!GM_getValue(key + "Enabled", false) ? 'disabled' : ''} value="${GM_getValue(key, '')}">`;

        wrapper.querySelector('input[type="checkbox"]').onchange = () => {
            const isEnabled = wrapper.querySelector('input[type="checkbox"]').checked;
            GM_setValue(key + "Enabled", isEnabled);
            wrapper.querySelector('input[type="date"]').disabled = !isEnabled;
            updateGoogleQuery();
        };

        wrapper.querySelector('input[type="date"]').onchange = () => {
            GM_setValue(key, wrapper.querySelector('input[type="date"]').value);
            updateGoogleQuery();
        };

        return wrapper;
    }

    const wrenchIcon = document.createElement("div");
    wrenchIcon.innerHTML = "&#128295;";
    wrenchIcon.style.cssText = "position: fixed; top: 10px; right: 10px; cursor: pointer; z-index: 1000;";
    wrenchIcon.style.display = isGoogle() ? "block" : "none"; // Hides wrench icon when not on Google

    const foldoutPanel = document.createElement("div");
    foldoutPanel.style.cssText = "display: none; position: fixed; top: 40px; right: 10px; background: white; border: 1px solid black; padding: 10px; z-index: 1000;";
    wrenchIcon.onclick = () => foldoutPanel.style.display = foldoutPanel.style.display === "none" ? "block" : "none";
    document.body.append(wrenchIcon, foldoutPanel);

    foldoutPanel.append(createDateField("Before: ", "beforeDate"), createDateField("After: ", "afterDate"));
    setInterval(() => {
        wrenchIcon.style.display = isGoogle() ? "block" : "none"; // Update wrench icon visibility based on site
    }, 1000);
    window.addEventListener('load', () => isGoogle() && getSearchBox() && updateGoogleQuery());
})();
