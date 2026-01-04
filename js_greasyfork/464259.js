// To run, install GreaseMonkey or TamperMonkey extension in your browser
// Copy this code into new user script, and enable

// ==UserScript==
// @name         Disable Youtube next video autoplay
// @version      1.4
// @description  This script prevents Youtube from autoplaying the next video by switching the autoplay toggle to "off"
// @author       Jeff Bellucci
// @match        *://www.youtube.com/*
// @run-at       document-start
// @license      MIT
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/464259/Disable%20Youtube%20next%20video%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/464259/Disable%20Youtube%20next%20video%20autoplay.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function uncheck(toggle) {
        if (toggle.hasAttribute("aria-checked")) {
          	if (toggle.getAttribute("aria-checked")=="true"){
              console.log('YTAPtoggle click');
              toggle.click();
        		}
      			else{
         			console.log('YTAPtoggle set to '+toggle.getAttribute("aria-checked"));
            }
        }
        setTimeout(disableAfterLoad, 2000);
    }
    function disableAfterLoad() {
      	var autoplayToggle = document.querySelector('.ytp-autonav-toggle-button');
        if (autoplayToggle) {
            uncheck(autoplayToggle);
        } else {
            setTimeout(disableAfterLoad, 1000);
        }
    }
		console.log('YTAPtoggle started');
    disableAfterLoad();
})();