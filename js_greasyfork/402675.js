// ==UserScript==
// @name         Pickup testen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  prefill data before 9am and submit at 9am
// @author       You
// @match        https://www.pickup-testen.de
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/402675/Pickup%20testen.user.js
// @updateURL https://update.greasyfork.org/scripts/402675/Pickup%20testen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
    	$('#out_of_redemptions_today').hide();
    	$('.redemption-columns').show();
    	$('.submit-button').attr('disabled', false);
    }, 100);
})();