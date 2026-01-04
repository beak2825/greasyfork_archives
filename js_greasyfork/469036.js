// ==UserScript==
// @name         Connect hkticketing (1.5s delay)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  redirect URL
// @author       You
// @match        https://queue.hkticketing.com/hotshow.html
// @icon         
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469036/Connect%20hkticketing%20%2815s%20delay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/469036/Connect%20hkticketing%20%2815s%20delay%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Retry with 1.5 second delay
    setTimeout(function(){
        location.replace("https://entry-hotshow.hkticketing.com/");
    }, 1500);
 
})();