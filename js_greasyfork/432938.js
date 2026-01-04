// ==UserScript==
// @name            Google Search Sidebar figuccio
// @namespace       https://greasyfork.org/users/237458
// @version         0.5
// @description     Google search tools to sidebar.
// @author          figuccio
// @match           https://*.google.com/*
// @match           https://*.google.it/*
// @match           https://*.google.fr/*
// @match           https://*.google.es/*
// @run-at          document-start
// @grant           GM_addStyle
// @icon            https://www.google.com/favicon.ico
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/432938/Google%20Search%20Sidebar%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/432938/Google%20Search%20Sidebar%20figuccio.meta.js
// ==/UserScript==
//GM_addStyle("#hdtbMenus{display:block !important;position:absolute !important;top:8px !important;right:auto!important;}");//marzo 2024
GM_addStyle("#result-stats{display:none!important;}");/* Circa 261.000.000 risultati (0,61 secondi) nascosto */
(function() {
    'use strict';

 const interval = setInterval(() =>
    {
        var toolsButton = document.getElementById('hdtb-tls');
        if (toolsButton.getAttribute("aria-expanded") === "true") {

            clearInterval(interval);
        }
        else{toolsButton.click();
        }
    }, 250);
})();

