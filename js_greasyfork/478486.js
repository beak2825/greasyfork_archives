// ==UserScript==
// @name         StandardTickerUnkaputt
// @namespace    https://derstandard.at/
// @version      0.0.3
// @description  Tiggersüchtler Hotfix
// @author       dersansard
// @match        *://*.derstandard.at/*
// @match        *://*.derstandard.de/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478486/StandardTickerUnkaputt.user.js
// @updateURL https://update.greasyfork.org/scripts/478486/StandardTickerUnkaputt.meta.js
// ==/UserScript==

function showBox(elem) {
    var box;
    for (const box of elem) {
        box.setAttribute('style', 'display:block !important');
        box.style.display="block";
    }
}

function r() {
    if (!(document.getElementsByClassName('js-communityform-input-counter communityform-input-counter'))) return;
    showBox(document.getElementsByClassName('js-communityform-input-counter communityform-input-counter'));
    showBox(document.getElementsByClassName('communityform-input'));
    showBox(document.getElementsByClassName('communityform-input-optiongroup'));
    showBox(document.getElementsByClassName('communityform-footer functions'));
}

(function() {
//  setTimeout(r, 3000);
    setInterval(r, 1000);
 })();