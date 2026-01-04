// ==UserScript==
// @name         TEST Freebitco.in Freeroll Rollbot Script
// @namespace    https://greasyfork.org/en/scripts/370982-freebitco-in-freeroll-rollbot-script/code
// @version      0.1
// @description  Please use my Referal-Link https://freebitco.in/?r=15379995
// @author       Sally
// @match        https://freebitco.in/*
// @downloadURL https://update.greasyfork.org/scripts/372919/TEST%20Freebitcoin%20Freeroll%20Rollbot%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/372919/TEST%20Freebitcoin%20Freeroll%20Rollbot%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';


setTimeout(function () { 
      location.reload();
    }, 3600 * 1000);

//click playbutton
setInterval(function(){
            if ($('#free_play_form_button').is(':visible')) {
                $('#free_play_form_button').trigger('click');
            }
        },11000);
	//load page every 330 seconds
setTimeout(function () { 
      location.reload();
    }, 330 * 1000);
	
})();
	