// ==UserScript==
    // @name         FreeBitco.in AutoClaim (2024) papaloutsas.blogspot.com
    // @namespace    https://freebitco.in/?r=2878556
    // @version      0.1.2
    // @description  FreeBitco.in AutoClaim papaloutsas.blogspot.com
    // @author       papaloutsas.blogspot.com
    // @match        https://freebitco.in/?op=home
    // @match        https://freebitco.in/
    // @grant        none
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504708/FreeBitcoin%20AutoClaim%20%282024%29%20papaloutsasblogspotcom.user.js
// @updateURL https://update.greasyfork.org/scripts/504708/FreeBitcoin%20AutoClaim%20%282024%29%20papaloutsasblogspotcom.meta.js
    // ==/UserScript==
 
    $(document).ready(function(){
        setInterval(function(){
            //$('#free_play_form_button').trigger('click');
            if ($('#free_play_form_button').is(':visible')) {
                $('#free_play_form_button').trigger('click');
            }
        },10000);
    });