// ==UserScript==
// @name         short domains only!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  removes domains longer than a specified length
// @author       cv
// @match        *://freedns.afraid.org/*
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/517522/short%20domains%20only%21.user.js
// @updateURL https://update.greasyfork.org/scripts/517522/short%20domains%20only%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const char = 10; // max length
    const rows = document.querySelectorAll('tr.trl, tr.trd');

    rows.forEach(row => {
        const link = row.querySelector('td > a');
        if (link && link.textContent.length > char) {row.remove()}
    });
})();