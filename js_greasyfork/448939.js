// ==UserScript==
// @name         SSP_Fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fajne to SSP, takie czytelne teraz
// @author       @nowaratn
// @match        https://trans-logistics-eu.amazon.com/ssp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448939/SSP_Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/448939/SSP_Fix.meta.js
// ==/UserScript==

(function() {
   addGlobalStyle('.ColContId { display:inline-grid; }');
})();

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}