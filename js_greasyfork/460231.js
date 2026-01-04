// ==UserScript==
// @name         faucetoshi.com
// @description  Walk through all PTC
// @version      1.1
// @author       WXC
// @match        https://faucetoshi.com/ptc*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.min.js
// @grant        unsafeWindow
// @run-at document-idle
// @noframes
// @namespace https://greasyfork.org/users/713625
// @downloadURL https://update.greasyfork.org/scripts/460231/faucetoshicom.user.js
// @updateURL https://update.greasyfork.org/scripts/460231/faucetoshicom.meta.js
// ==/UserScript==


(function() {
    'use strict';

    setInterval(function() { window.focus(); }, 500);
    document.hasFocus = function () {return true;};


    var $ = window.jQuery;
    $.noConflict();
    $(document).ready(function() {

        setTimeout( function() {

            // PTC solve
            if( location.href.indexOf("/ptc/view") > -1 ) {


                var check_ptc = setInterval( function() {

                    if( $("#verify").is(":visible") ) {

                        clearInterval( check_ptc );



                        if( $(".h-captcha").is(":visible") ) {

                            document.title = "CAPTCHA!";

                            // check response
                            var h_timer = setInterval( function() {

                                if( $("[id^=h-captcha-response]").val().length > 32 ) {

                                    clearInterval( h_timer );
                                    $("form:first").submit();

                                }

                            }, 3000 );

                        }


                    }

                }, 2000 );

            }
            // PTC list
            else if( location.href.indexOf("/ptc") > 0 ) {

                if( $("button.btn:contains('Go')").is(":visible") ) {
                    $('.btn-primary:first').click();
                }

            }
            else {}


        }, ( 3 * 1000 ) );

    });


    // global reload
    setTimeout( function() {
        location.href = location.href;
    }, ( 90 * 1000 ) );


})();