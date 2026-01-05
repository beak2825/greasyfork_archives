// ==UserScript==
// @name         NRC Remove Counter + Ads
// @namespace    nrc.nl
// @version      1.0
// @description  Read all the articles without paywall, and don't get reminded about paying
// @author       Rivalo
// @match        *://www.nrc.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21589/NRC%20Remove%20Counter%20%2B%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/21589/NRC%20Remove%20Counter%20%2B%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

     $("body > header").removeClass("header--non-subscriber");
     document.cookie = "counter=; created=Thu, 01 Jan 1970 00:00:00 UTC; expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/;";


})();