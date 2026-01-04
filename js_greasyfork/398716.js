// ==UserScript==
// @name         Instagram Mobile WebView
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enables the mobile view (with DMs and the possibility to upload) on desktop
// @author       Poup2804
// @include      https://www.instagram.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/398716/Instagram%20Mobile%20WebView.user.js
// @updateURL https://update.greasyfork.org/scripts/398716/Instagram%20Mobile%20WebView.meta.js
// ==/UserScript==

(function() {
    'use strict';

    navigator.__defineGetter__('userAgent', function(){
        return 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Mobile Safari/537.36';
    });
})();