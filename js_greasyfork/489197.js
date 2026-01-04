// ==UserScript==
// @name         Connect cityline (1.5s delay)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  redirect URL
// @author       You
// @match        https://msg.cityline.com*
// @icon         
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489197/Connect%20cityline%20%2815s%20delay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489197/Connect%20cityline%20%2815s%20delay%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Retry with 1.5 second delay
    setTimeout(function(){
        location.replace("https://event.cityline.com/utsvInternet/CITIIVEPB/login?lang=TW");
    }, 1500);
 
})();