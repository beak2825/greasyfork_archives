// ==UserScript==
// @name         AdKillerForAnimeFLV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fuck you animeflv
// @author       Jorge Quintero
// @match        https://animeflv.net/ver/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370698/AdKillerForAnimeFLV.user.js
// @updateURL https://update.greasyfork.org/scripts/370698/AdKillerForAnimeFLV.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('.RTbl .fa-download').forEach(function(ae){
        var url_with_ad = decodeURIComponent(ae.href);
		var urls = url_with_ad.split("s=");
		ae.href = urls[1];
    });
    // Your code here...
})();