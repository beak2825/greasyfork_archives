// ==UserScript==
// @name         0.2s m-hkticketing (0.2s delay)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  redirect URL
// @author       You
// @match        https://queue.hkticketing.com/hotshow.html
// @icon         
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468725/02s%20m-hkticketing%20%2802s%20delay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/468725/02s%20m-hkticketing%20%2802s%20delay%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 

    // Retry with 0.2 second delay
    setTimeout(function(){
        location.replace("https://m-entry-hotshow.hkticketing.com/");
    }, 200);
 
})();