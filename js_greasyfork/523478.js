// ==UserScript==
// @name         hives.pw
// @description  autoclaim + autowithdraw
// @author       WXC
// @version      1.1
// @match        https://hives.pw/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at document-end
// @noframes
// @namespace https://greasyfork.org/users/713625
// @downloadURL https://update.greasyfork.org/scripts/523478/hivespw.user.js
// @updateURL https://update.greasyfork.org/scripts/523478/hivespw.meta.js
// ==/UserScript==


(function() {
    'use strict';


    const faucetpay_email = "@"; // <----- CHANGE FAUCETPAY EMAIL HERE
    const min_wd = 0; // min points to withdraw ... 0 = auto, OR custom number greater than minimal withdraw!
    const time_wd = 6; // try withdraw every X minutes
    const fast_mode = 1; // 0 = no, 1 = yes ... for fast pc/net



    $(document).ready(function() {


        const now = new Date();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        document.title = seconds;

        if( minutes % time_wd === 0 && seconds < 15 ) { // withdraw time, every X min and first 15 sec


            if( location.pathname == "/account" ) {


                var balance = parseFloat( $("#amount").val() );

                var min = parseFloat( $("#amount").attr("min") ); // auto min wd
                if( min_wd > min ) min = min_wd; // custom wd


                if( balance > min ) {

                    document.title = "AUTO WD";

                    $('[data-bs-target="#withdrawModal"]').click();
                    $("#withdrawal-address").val( faucetpay_email );


                    // some wd effectivity
                    var points_per_sat = 95; // 95 points ~ 1 Sat, keep remaining points in balance // currencies[0] = 94478
                    var payout = Math.floor( balance / points_per_sat) * points_per_sat;

                    var rn = 0;

                    function generateRandomNumber(min, max) {
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    }
                    rn = generateRandomNumber( -22, 2 ); // uncomment for variety

                    $("#amount").val( parseFloat( payout ) + parseFloat( rn ) );


                    setTimeout( function() {

                        $("#makeWithdrawal").click();

                    }, ( 2 * 1000 ) );

                }
                else {

                    document.title = "LOW BALANCE";

                    setTimeout( function() {
                        location.href = "/faucet";
                    }, ( 5 * 1000 ) );

                }


            }
            else {

                location.href = "/account";

            }



        }
        else {


            if( location.pathname == "/account" ) {

                location.href = "/faucet";

            }
            else {



                if( $(".notyf__message").is(":visible") && fast_mode == 1 ) { // fast mode

                    $('[data-bs-target="#claimModal"]').click();

                    var faucet_cf_check2 = setInterval( function() {

                        if( $("[name=cf-turnstile-response]").val().length > 32 ) {

                            clearInterval( faucet_cf_check2 );
                            $('button:contains("Claim reward")').click();

                            setTimeout( function() {
                                location.reload();
                            }, ( 5* 1000 ) );

                        }

                    }, ( 100 ) );

                }
                else { // normal mode


                    if( $('button:contains("Claim reward")').is(":visible") ) {

                        var faucet_cf_check = setInterval( function() {

                            if( $("[name=cf-turnstile-response]").val().length > 32 ) {

                                clearInterval( faucet_cf_check );
                                $('button:contains("Claim reward")').click();

                            }

                        }, ( 100 ) );

                    }
                    else {

                        // wait
                        setTimeout( function() {
                            $('[data-bs-target="#claimModal"]').click();
                        }, ( 0* 1000 ) );


                    }


                }

            }


        }



    });


    setTimeout( function() {
        location.reload();
    }, ( 10 * 1000 ) );


})();