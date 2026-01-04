// ==UserScript==
// @name           Glassdoor Paywall Remover [2023]
// @description    Removes paywall on Glassdoor
// @namespace      https://github.com/limtis0/
// @author         https://github.com/limtis0/
// @license        MIT
// @version        1.0
// @match          http*://*.glassdoor.com/*
// @downloadURL https://update.greasyfork.org/scripts/464760/Glassdoor%20Paywall%20Remover%20%5B2023%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/464760/Glassdoor%20Paywall%20Remover%20%5B2023%5D.meta.js
// ==/UserScript==

// Original script (does not work as of now):
// https://greasyfork.org/en/scripts/405624-glassdoor-paywall-remover

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


(function(){
    'use strict';

    // Remove paywall panel and overflow:hidden
    addGlobalStyle('[id*="Hardsell"] {display:none !important;}'); // Wildcard matching, semi-future-proof
    addGlobalStyle('body {overflow:auto !important;}');

    // Prevents event for being called further
    window.addEventListener("scroll", event => event.stopPropagation(), true);
    window.addEventListener("mousemove", event => event.stopPropagation(), true);
})();
