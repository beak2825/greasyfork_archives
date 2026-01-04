// ==UserScript==
// @name MAM Site Store Fix
// @namespace yyyzzz999
// @author yyyzzz999
// @description Updates Ratio, FL, & Bonus Points in Store header after purchase (6/10/22)
// @match  https://www.myanonamouse.net/store.php
// @icon   https://cdn.myanonamouse.net/imagebucket/164109/StoreFix.png
// @version 1.2
// @license MIT
// @run-at document-start
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/417852/MAM%20Site%20Store%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/417852/MAM%20Site%20Store%20Fix.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

// Problem: Site Store purchase updates the remaining bonus points in body of page, but not the header, or ratio
// even though the data has been sent to the JavaScript that processes the purchase.

// This saves a page reload to see your new ratio at the top of the page

let DEBUG =0; // Debugging mode on (1) or off (0) or 2 verbose, 3 Too verbose!

if (DEBUG) console.log("Store Fix 1.2 loaded"); // Just making sure we're watching the right console window

//https://stackoverflow.com/questions/629671/how-can-i-intercept-xmlhttprequests-from-a-greasemonkey-script
// Spy on MAM AJAX request/response to get hidden ratio and seedbonus updates not posted in page header
// This works in Basilisk Scratchpad, Tampermonkey w/Firefox, but not Greasmonkey 3.9 in Basilisk

let ResultObj; // I scoped this out of the function in case I want to reference it later in other contexts
(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
        if (DEBUG >2) console.log(this.readyState);
		if (DEBUG >2) console.log(this.responseText);
			if (this.readyState == 4 && this.status == 200) {
				ResultObj = JSON.parse(this.responseText);
				if (DEBUG) console.log("New Ratio: " + ResultObj.ratio);
				if (DEBUG) console.log("Seedbonus: " + ResultObj.seedbonus);
				if (DEBUG >1) console.log("Response: " + this.responseText);
				if( ResultObj.ratio) {document.getElementById("tmR").textContent=ResultObj.ratio.toFixed(6);}
				if( ResultObj.seedbonus) document.getElementById("tmBP").textContent="Bonus: " + Math.floor(ResultObj.seedbonus);
			// The above two lines of code are similar to code I'd like to see in the MAM site.js.
                if( ResultObj.FLleft) {
                    let FLstat = document.querySelector("#tmFW");
                    if (FLstat !== null) { //If Preferences, Style, Main Menu, Top Menu, Freeleech Wedges [checked]
                    FLstat.textContent="FL Wedges: " + Math.floor(ResultObj.FLleft); //v1.2
                    }
                }
			}
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);