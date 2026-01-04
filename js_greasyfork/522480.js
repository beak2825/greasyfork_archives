// ==UserScript==
// @name         freebitco.in 
// @description  autoclaimer
// @author       WXC
// @match        https://freebitco.in/*
// @exclude      https://freebitco.in/static/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at document-idle
// @noframes
// @version 0.0.1.20250101095536
// @namespace https://greasyfork.org/users/713625
// @downloadURL https://update.greasyfork.org/scripts/522480/freebitcoin.user.js
// @updateURL https://update.greasyfork.org/scripts/522480/freebitcoin.meta.js
// ==/UserScript==



this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';


    var $ = window.jQuery;
    $(document).ready(function() {


        function notify() {
            const notification = new Notification("Need to solve CAPTCHA!", {
                image: "https://www.coded.cz/_public/captcha_notify.png"
            });
        }


        if( location.pathname != "/signup/" ) {

            $("html, body").animate({
                scrollTop: $(document).height()
            }, 1000);


            if( $(".h-captcha").is(":visible") ) {

                //document.title = "CAPTCHA!";

                // check response
                var hc_check = setInterval( function() {

                    if( $("[id^=h-captcha-response]").val().length > 32 ) {

                        clearInterval( hc_check );
                        $("#free_play_form_button").click(); // claim


                        setTimeout( function() {
                            location.reload();
                        }, ( 5* 1000 ) );                      

                    }

                }, 2 * 1000 );

                notify();

            }

            else if( $("#freeplay_form_cf_turnstile").is(":visible") ) {

                var cf_check = setInterval( function() {

                    if( $("[name=cf-turnstile-response]").val().length > 32 ) { // mame vysledek

                        clearInterval( cf_check );
                        $("#free_play_form_button").click(); // claim

                        setTimeout( function() {
                            location.reload();
                        }, ( 5* 1000 ) );


                    }

                }, ( 2 * 1000 ) );


                setInterval( function() {
                    notify();
                }, ( 15 * 1000 ) );


            }

            else {

                // wait for reload

            }

        }
        else {

            // wait for reload

        }


    });



    // global reload 
    setTimeout( function() {
        location.href = location.href;
    }, ( 70 * 1000 ) );

})();