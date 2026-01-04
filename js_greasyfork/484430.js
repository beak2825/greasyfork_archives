// ==UserScript==
// @name         Steam Linkfilter Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bypass Steam's link filter redirection
// @author       Artriy
// @match        https://steamcommunity.com/linkfilter/*
// @grant        none
// @license CC BY 4.0
// @downloadURL https://update.greasyfork.org/scripts/484430/Steam%20Linkfilter%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/484430/Steam%20Linkfilter%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var urlParams = new URLSearchParams(window.location.search);
    var externalUrl = urlParams.get('u');
    if (externalUrl) {
        window.location.href = externalUrl;
    }
})();
