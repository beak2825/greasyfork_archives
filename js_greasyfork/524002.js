// ==UserScript==
// @name         Remove Google search translate (traslate.goog)
// @namespace    http://google.com/
// @version      2025-09-23
// @description  Removes the auto-translation and redirects to the real page
// @license      MIT
// @author       VampiroMedicado
// @match        https://*.translate.goog/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/524002/Remove%20Google%20search%20translate%20%28traslategoog%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524002/Remove%20Google%20search%20translate%20%28traslategoog%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const protocol = window.location.protocol;
    const host = window.location.host;
    const pathname = window.location.pathname;
    const match = window.location.hostname.match('(.*)\.translate\.goog');
    if (match[1]) {
        const newHost = match[1].replaceAll(/(?<!-)-(?!-)/g, '.').replaceAll('--', '-');
        window.location.replace(`${protocol}//${newHost}${window.location.pathname}`);
    }
})();