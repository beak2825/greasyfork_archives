// ==UserScript==
// @name            star-clicks ads clicker 
// @namespace       http://tampermonkey.net/
// @version         0.1
// @description     an ads watcher 
// @author          elmer76
// @license         MIT
// @match           https://www.star-clicks.com/portal/ads
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/442441/star-clicks%20ads%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/442441/star-clicks%20ads%20clicker.meta.js
// ==/UserScript==
/*
==================================================================================================================================================                                                                                                                                              |
|         donate please  btc : 36v6NbQCeDp1LHDtpJgoBMq7u3J5zWipDW                     TY and enjoy                                               |
|         Please use my referal link      http://www.star-clicks.com/?ref=52325587                                                               |
==================================================================================================================================================
*/


(function() {
    'use strict';

   //Clicks the Ads after 30 seconds
    setTimeout(function(){
        document.querySelector(".col-md-4.col-sm-6 .panel").click();
    },30000)

   
})();
