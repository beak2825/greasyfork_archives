// ==UserScript==
// @name         cleanUserAgentsNetAds
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  clean UserAgents.Net Ads
// @author       mooring@codernotes.club
// @match        user-agents.net/*
// @icon         https://www.google.com/s2/favicons?domain=user-agents.net
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/427780/cleanUserAgentsNetAds.user.js
// @updateURL https://update.greasyfork.org/scripts/427780/cleanUserAgentsNetAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css ='.mys-wrapper, article ins.adsbygoogle.adsbygoogle.adsbygoogle.adsbygoogle{display:none!important;}'
    var style = document.createElement('style');
    style.innerText = css;
    document.body.previousElementSibling.appendChild(style)
})();