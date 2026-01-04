// ==UserScript==
// @name         R3 Wiki Double Url Fix v0.1
// @namespace    http://florafeldner.eu
// @version      2025-07-15
// @license      MIT
// @description  fixes the goddamn url mishaps in r3 wiki
// @author       Flora
// @match        https://realraum.at/wiki/*
// @include      https://realraum.at/wiki/*
// @icon         https://realraum.at/wiki/lib/tpl/bootstrap3/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542579/R3%20Wiki%20Double%20Url%20Fix%20v01.user.js
// @updateURL https://update.greasyfork.org/scripts/542579/R3%20Wiki%20Double%20Url%20Fix%20v01.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const lnks = document.querySelectorAll('a');
    lnks.forEach( (el) => {
        const href = el.href.replace('/wiki/doku.php/wiki/doku.php', '/wiki/doku.php');
        el.setAttribute('href', href);
    });

})();
