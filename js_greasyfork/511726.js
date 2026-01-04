// ==UserScript==
// @name         Redirect heroeswm.ru to lordswm.com (excluding forum pages)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Redirects heroeswm.ru to lordswm.com, skipping forum messages
// @author       Prozyk
// @match        *://*.heroeswm.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511726/Redirect%20heroeswmru%20to%20lordswmcom%20%28excluding%20forum%20pages%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511726/Redirect%20heroeswmru%20to%20lordswmcom%20%28excluding%20forum%20pages%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current URL contains heroeswm.ru but exclude forum_messages
    if (window.location.href.includes('heroeswm.ru') && !window.location.href.includes('/forum_messages')) {
        // Replace heroeswm.ru with lordswm.com and redirect
        const newUrl = window.location.href.replace('heroeswm.ru', 'lordswm.com');
        window.location.replace(newUrl);
    }
})();
