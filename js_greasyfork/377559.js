// ==UserScript==
// @name         Sorry, Facebook
// @namespace    https://www.facebook.com/
// @version      1.008
// @description  Hide Ads in Posts after they are loaded (yeah, not very cool)
// @author       Anton
// @match        *://www.facebook.com/*
// @downloadURL https://update.greasyfork.org/scripts/377559/Sorry%2C%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/377559/Sorry%2C%20Facebook.meta.js
// ==/UserScript==

(function() {
	'use strict';
	
	var hideAd = function() {
	    var nn = document.querySelectorAll('s');
	    for(var i in nn) {
	        if (nn.hasOwnProperty(i)) {
	            var pp = nn[i].closest('div[aria-posinset]');
                if (pp.style) {
                    if (pp.style.display !== 'none') {
                        pp.style.display = 'none'; 
                        if (console) console.log('Ad is closed');
                    }
                } else {
                    pp.style = "display:none";
                    if (console) console.log('Ad is closed');
                }
	        }
	    }
	};

    if (unsafeWindow) {
        if (!unsafeWindow.fbbotstarted) {
            unsafeWindow.fbbotstarted = true;
            setInterval(hideAd, 100);
            if (console) console.log('FB Ads hide.');
        }
    }
    
    hideAd();

})();