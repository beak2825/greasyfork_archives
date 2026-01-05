// ==UserScript==
// @name         Hide Gmail Ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://mail.google.com/mail/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/29953/Hide%20Gmail%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/29953/Hide%20Gmail%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.top != window.self){  //don't run on frames or iframes
        return;
    }
    if(window.location.href.indexOf('//mail.google.com/mail/')>2){
        // RIGHT AND BOTTOM
        GM_addStyle(".oM { display:none !important; }");
        GM_addStyle(".Zs { display:none !important; }");
        // TOP OF INBOX
        GM_addStyle(".aKB { display:none !important; }");
    }
})();

