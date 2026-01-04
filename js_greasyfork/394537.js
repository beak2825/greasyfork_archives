// ==UserScript==
// @name         Anonymize Medium
// @namespace    https://medium.com/
// @version      0.1
// @description  Erase tracking ID of medium.com from localStorage. For cookie, use extensions like EditThisCookie.
// @author       lacek
// @match        https://medium.com/@*
// @match        https://*.medium.com/*
// @match        https://towardsdatascience.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/394537/Anonymize%20Medium.user.js
// @updateURL https://update.greasyfork.org/scripts/394537/Anonymize%20Medium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    localStorage.clear();
    var i = document.querySelector('iframe[src^="https://smartlock.google.com"]');
    if (i) i.remove();
})();