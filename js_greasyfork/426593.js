// ==UserScript==
// @name         PW Rewarded Ad Automation
// @version      1.0
// @namespace    https://greasyfork.org/users/60012
// @description  Automatically run reward ads in PW lol
// @author       Yosodog
// @match        https://politicsandwar.com/rewarded-ads/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426593/PW%20Rewarded%20Ad%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/426593/PW%20Rewarded%20Ad%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function runAd() {
        if($("#btnAds").css('display') != 'none') {
             $("#btnAds").click()
         }
    }

     var intervalId = window.setInterval(function(){
         runAd();
     }, 1000);
})();