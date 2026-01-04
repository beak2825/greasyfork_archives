// ==UserScript==
// @name         Enable playing with dartconnect-app 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enable playing with dartconnect-app without premium-acc
// @author       benebelter
// @match        https://app.dartconnect.com/*
// @icon
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499607/Enable%20playing%20with%20dartconnect-app.user.js
// @updateURL https://update.greasyfork.org/scripts/499607/Enable%20playing%20with%20dartconnect-app.meta.js
// ==/UserScript==

(function() {
    'use strict';
if( $( "#drm-quick-play" ).length != 0 ) {
    setInterval(function() {

        $( "#drm-quick-play" ).removeClass( "button-disabled" );

    }, 1000);
}
})();