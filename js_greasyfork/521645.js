// ==UserScript==
// @name         litebits.io auto-claim
// @description  autoclaimer
// @author       WXC
// @version      1.0
// @match        https://litebits.io/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at document-idle
// @noframes
// @namespace https://greasyfork.org/users/713625
// @downloadURL https://update.greasyfork.org/scripts/521645/litebitsio%20auto-claim.user.js
// @updateURL https://update.greasyfork.org/scripts/521645/litebitsio%20auto-claim.meta.js
// ==/UserScript==


(function() {
    'use strict';


    var check = setInterval( function() {


        if( location.pathname == "/" ) {

            // login link na email
            alert("LOGIN via email");

        }

        else if( location.pathname == "/claim" ) {

            var check2 = setInterval( function() {

                if( $(".font-mono").length == 1 ) {
                    // countdown 10s
                }
                else {

                    clearInterval( check );
                    clearInterval( check2 );

                    if( $("button:contains('Continue')").is(":visible") ) {

                        $("button:contains('Continue')").click();
                        var check3 = setInterval( function() {
                            if( $("h2:visible").text() == "Claim Successful!" ) {
                                clearInterval( check3 );
                                location.reload();
                            }
                        }, ( 2*1000 ) );

                    }
                }

            }, ( 2*1000 ) );



        }
        else if( location.pathname == "/dashboard" ) {

            if( $(".font-mono").length == 1 ) {
                // countdown 10m
            }
            else {

                if( $("button:contains('Start Claim')").is(":visible") ) {
                    $("button:contains('Start Claim')").click();
                }

            }

        }

    }, ( 2*1000 ) );




    setTimeout( function() { // global reload
        location.reload();
    }, ( 70 * 1000 ) ); //ms


})();

