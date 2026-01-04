// ==UserScript==
// @name          Moodle SecureDisable
// @version      0.6
// @description  disable secure events
// @author       Vitaliy Tolstyakov
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/590687
// @downloadURL https://update.greasyfork.org/scripts/405303/Moodle%20SecureDisable.user.js
// @updateURL https://update.greasyfork.org/scripts/405303/Moodle%20SecureDisable.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(!document.body.classList.contains("quiz-secure-window")) return;

    Array.from(document.body.classList)
        .filter(className => className.includes('secure'))
        .forEach(className => document.body.classList.remove(className));

    const eventsToUnBlock = [
        'mousedown',
        'dragstart',
        'contextmenu',
        'copy',
        'keydown',
        'beforeprint',
        'afterprint',
        'keypress',
        'keyup'
    ];

    const stopEventPropagation = (event) => {
        event.stopPropagation();
    };

    eventsToUnBlock.forEach(event => {
        window.addEventListener(event, stopEventPropagation, true);
    });
})();