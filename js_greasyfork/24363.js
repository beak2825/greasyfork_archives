// ==UserScript==
// @name         Version2 fix
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fikser et par små detaljer ved V2's nye design
// @author       You
// @match        https://www.version2.dk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24363/Version2%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/24363/Version2%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery("#chartbeat-articles").hide();
    jQuery("#mini-panel-jobfinder_1").hide();
    jQuery(".panel-col-last section:first()").hide();
    jQuery(".fast-track-frontpage").css("margin-top", "0");
})();