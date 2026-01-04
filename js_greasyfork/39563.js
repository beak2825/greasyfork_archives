    // ==UserScript==
    // @name         freebitco.in autoclaim
    // @namespace    https://freebitco.in/?r=9780720
    // @version      0.1.1
    // @description  autoclaim freebitco.in https://freebitco.in/?r=9780720
    // @author       Dekpiano
    // @match        https://freebitco.in/?op=home
    // @match        https://freebitco.in/
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39563/freebitcoin%20autoclaim.user.js
// @updateURL https://update.greasyfork.org/scripts/39563/freebitcoin%20autoclaim.meta.js
    // ==/UserScript==

    $(document).ready(function(){
        setInterval(function(){
            //$('#free_play_form_button').trigger('click');
            if ($('#free_play_form_button').is(':visible')) {
                $('#free_play_form_button').trigger('click');
            }
        },10000);
    });