// ==UserScript==
// @name         The Times Paywall Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Paywall from The Times
// @author       Espaker Kaminski
// @match        *://*.thetimes.co.uk/article/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456209/The%20Times%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/456209/The%20Times%20Paywall%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('paywall-portal-article-footer').remove()
    document.getElementById('paywall-portal-page-footer').remove()
    document.getElementsByClassName('group-3')[0].remove()
    document.getElementsByClassName('tc-view__TcView-nuazoi-0 responsive-sc-15gvuj2-0 gyLkkj')[0].remove()
})();