    // ==UserScript==
    // @name         freebitco.in autoclaim
    // @namespace    https://freebitco.in/?r=47792358
    // @version      0.1.1
    // @description  autoclaim freebitco.in https://freebitco.in/?r=47792358
    // @author       Bitco.in Feen Queen
    // @match        https://freebitco.in/?op=home
    // @match        https://freebitco.in/
    // @grant        none
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501621/freebitcoin%20autoclaim.user.js
// @updateURL https://update.greasyfork.org/scripts/501621/freebitcoin%20autoclaim.meta.js
    // ==/UserScript==
 
    $(document).ready(function(){
        setInterval(function(){
            //$('#free_play_form_button').trigger('click');
            if ($('#free_play_form_button').is(':visible')) {
                $('#free_play_form_button').trigger('click');
            }
        },10000);
    });