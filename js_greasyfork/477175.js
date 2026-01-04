// ==UserScript==
// @name         Exercism Dark Mode
// @version      1.0.0
// @description  Enables dark theme in exercism.org
// @author       7heMech
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=exercism.org
// @match        https://exercism.org/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1193487
// @downloadURL https://update.greasyfork.org/scripts/477175/Exercism%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/477175/Exercism%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const body = document.body;

    toggleDarkTheme();

    function callback(mutationList, observer) {
        mutationList.forEach(function(mutation) {
            if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') return;
            toggleDarkTheme();
        })
    }

    const observer = new MutationObserver(callback);
    observer.observe(body, { attributes: true });

    function toggleDarkTheme() {
        if (!body.classList.contains('theme-light')) return;
        body.classList.remove('theme-light');
        body.classList.add('theme-dark');
    }
})();