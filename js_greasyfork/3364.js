// ==UserScript==
// @name       tracks.tra.in refresh
// @namespace  http://ostermiller.org/
// @version    1.0
// @description  Refresh Tracks when you click on it after a period of inactivity
// @match      http://tracks.tra.in/*
// @copyright  2014, Stephen Ostermiller
// @downloadURL https://update.greasyfork.org/scripts/3364/trackstrain%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/3364/trackstrain%20refresh.meta.js
// ==/UserScript==
var lastrefresh = new Date().getTime();
window.addEventListener("focus", function(event) { 
    // console.log("tracks has focus");
    var age = new Date().getTime() - lastrefresh;
    // console.log("Age: " + age);
    if (age > 1000 * 60 * 60 * 4) {
    	// more than four hours old
        // console.log("Refreshing Tracks");
        location.reload();
    }
}, false);
