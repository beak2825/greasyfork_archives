// ==UserScript==
// @name         Europa-Forums - Make Dark Theme Work
// @version      0.3
// @description  Remove annoying pop-up menu on the forum
// @author       Mentathiel
// @match        https://www.europaguild.eu/forum/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/388342/Europa-Forums%20-%20Make%20Dark%20Theme%20Work.user.js
// @updateURL https://update.greasyfork.org/scripts/388342/Europa-Forums%20-%20Make%20Dark%20Theme%20Work.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $( ".dropdown" ).css("display", "none"); //hides the forum dropdown menu
})();