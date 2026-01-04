// ==UserScript==
// @name         Venk's Clean PubMed
// @namespace    http://greasyfork.org/
// @version      0.2
// @description  Clean up 2020 update of PubMed
// @author       Venkatesh L. Murthy
// @match        *://pubmed.ncbi.nlm.nih.gov/*
// @grant        Creative Commons CC-BY-SA 2.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/404055/Venk%27s%20Clean%20PubMed.user.js
// @updateURL https://update.greasyfork.org/scripts/404055/Venk%27s%20Clean%20PubMed.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

(function() {
    'use strict';

    addGlobalStyle('div.timeline-filter {display: none !important;}');
    addGlobalStyle('div.ncbi-alerts {display: none !important;}');
    addGlobalStyle('div.inner-wrap {padding-top: 0.8rem !important;padding-bottom: 0.2rem !important;}');
    addGlobalStyle('.result-actions-bar {display: none !important;}');
    addGlobalStyle('.citation-part {display:none !important;}');
    addGlobalStyle('.choice-group {margin-bottom: 0px !important; margin-top: 0px !important; font-size: 80% !important;}');
    addGlobalStyle('.title {margin-bottom: 0px !important; margin-top: 0px !important;}');
    addGlobalStyle('.labs-docsum-journal-citation {color: black !important;}');
    addGlobalStyle('.multiple-results-actions {padding: 0px !important;}');

    var url = window.location.href;
    var sortPattern = /&sort=/;
    if (!sortPattern.test(url)) {
        window.location.href=url + "&sort=date";
    }
})();