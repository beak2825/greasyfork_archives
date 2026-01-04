// ==UserScript==
// @name         cryptodrip.io
// @description  auto click, auto wd
// @author       WXC
// @version      1.8
// @match        https://cryptodrip.io/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at document-idle
// @noframes
// @namespace https://greasyfork.org/users/713625
// @downloadURL https://update.greasyfork.org/scripts/538980/cryptodripio.user.js
// @updateURL https://update.greasyfork.org/scripts/538980/cryptodripio.meta.js
// ==/UserScript==


// REG: https://cryptodrip.io/index.php?ref=16633

// set your FP email and amount of sats for auto wd

// 1) we upgrade faucet clicks to max
// 2) keep claiming sats, then wait to next round
// we are not interest for faucet rewards upgrade 
// pause auto wd for 30m on /?error

// BEWARE OF REVSHARES! CRYPTODRIP WILL SCAM YOU - ONLY FREE MODE!
// see https://uk.trustpilot.com/review/cryptodrip.io

// Sry for trash in code, site is often changing :@


(function() {
    'use strict';


    var fp_email = "your_faucetpay_email@example.com"; // <-- CHANGE
    var auto_wd_sats = "5"; // <-- CHANGE amount of sats to auto withdraw, 0 = disabled




    $(document).ready(function() {

        localStorage.setItem( "WXC_auto_wd_sats", auto_wd_sats );


        if( location.pathname == "/" || location.pathname == "/index.php" ) { // auto-login

            $("#faucet-email").val( fp_email );
            $("form:first").submit();

        }

        else if( location.search.includes("?error") ) { // https://cryptodrip.io/dashboard.php?error=Withdrawal+failed%3A+The+faucet+does+not+have+sufficient+funds+for+this+transaction.

            localStorage.removeItem("WXC_time_for_wd");
            localStorage.setItem("WXC_last_wd_try", new Date().toISOString());
            document.title = "PAUSING WD FOR 1H";
            location.href = "/dashboard.php";

        }

        else if( location.search == "?instant_withdraw=success" ) { // withdraw ok

            localStorage.removeItem("WXC_time_for_wd");
            localStorage.removeItem("WXC_last_wd_try");

            setTimeout( function() {
                location.href = "/mine.php";
            }, ( 3* 1000 ) );

        }

        else if( location.pathname == "/dashboard.php" ) {


            var balance0 = parseInt( $("h3:contains('Balance:')").text().match(/\d+/) );
            document.title = "BALANCE: "+ balance0;


            if( localStorage.getItem("WXC_auto_wd_sats") <= balance0 && localStorage.getItem("WXC_auto_wd_sats") > 0 && localStorage.getItem("WXC_time_for_wd") == "1" ) { // withdraw

                $("#amount").val( localStorage.getItem("WXC_auto_wd_sats") );
                $(".btn-instant-withdraw:first").click();

            }
            else {
                location.href = "/mine.php";
            }




        }

        else if( location.pathname == "/mine.php" ) {

            $(".banner-row, ins").hide(); // trash

            setTimeout( function() {
                $(".info-row").slideUp();
            }, ( 3* 1000 ) );


            let sec = 0;

            let clicks_level = $("#clicks-level").text();
            let balanceText = $('#balance').text();
            let match_b = balanceText.match(/([\d.]+)/);
            let balance = match_b ? parseFloat(match_b[1]) : 0;

            let levelTmp = clicks_level.split(" / ");
            let currentLevel = levelTmp[0];
            let levelMax = levelTmp[1];
            console.log( currentLevel + "/"+ levelMax );



            if( balance >= 1 && currentLevel != levelMax ) { // upgrade

                $("#clicks-levels").next("button").click();

            }
            else { // claim


                let lastTry = localStorage.getItem("WXC_last_wd_try");

                if( lastTry ) {
                    let diffMs = Date.now() - new Date(lastTry).getTime();
                    let diffMin = diffMs / (1000 * 60);

                    if( diffMin < 30 ) { // pause auto wd for 30m
                        localStorage.setItem("WXC_auto_wd_sats", 0);
                    }

                }


                if( balance >= localStorage.getItem("WXC_auto_wd_sats") && localStorage.getItem("WXC_auto_wd_sats") > 0 ) { // prepare for wd

                    localStorage.setItem( "WXC_time_for_wd", "1" );
                    location.href = "/dashboard.php";

                }

                else {

                    let clicksText = $('#clicks_today').text().split(" ");
                    let tmp = clicksText[1].split("/");

                    let current = tmp[0];
                    let max = tmp[1];

                    console.log( current +"/"+ max );
                    localStorage.setItem("WXC_last_prog", current +"/"+ max );
                    localStorage.setItem("WXC_last_balance", $("#balance").text().replace("Balance: ", "").replace("satoshi", "sat") );

                    if (current != max) {


                        var claim_check = setInterval( function() {

                            document.title = $("#mineButton").text();

                            if( $("#mineButton").text() == "Claim" ) { // claim ready

                                clearInterval( claim_check );


                                var cf_check = setInterval( function() {

                                    console.log("cf_check_res");

                                    if( $("[name=cf-turnstile-response]").val().length > 32 ) { // ok

                                        clearInterval( cf_check );
                                        $("#mineButton").click();
                                        document.title = "CLAIM";

                                    }

                                }, 1000 );


                                setTimeout( function() {
                                    location.reload();
                                }, ( 15* 1000 ) );



                            }
                            else {

                                sec = parseInt($("#mineButton").text().match(/\d+/));
                                if( sec == 10 ) { // check CF on 10s

                                    if( $("[name=cf-turnstile-response]").val().length > 32 ) { // ok
                                        // we have CF solved
                                    }
                                    else {
                                        // CF not solved
                                        location.reload();
                                    }

                                }

                            }


                        }, 1000 );


                    }
                    else {

                        $(".balance-row").css("background-color","#b10000");
                        $(".banner-grid").remove(); // trash

                    }

                }

            }

        }


        else if( location.pathname == "/claim.php" ) {

            // claim was removed from cryptodrip
            location.href = "/mine.php";

            /*
            $(".banner-row, ins").hide(); // trash

            var check2 = setInterval( function() {

                document.title = $("#timerDisplay").text();

                $("h2").text("");
                $("h2:first").text( localStorage.getItem("WXC_last_prog") +" - " + localStorage.getItem("WXC_last_balance") +"\n"+ "OWNER IS SCAMMER" );


                if( !$("#claimButton").prop("disabled") ) {

                    clearInterval( check2 );
                    localStorage.removeItem("WXC_last_prog");
                    localStorage.removeItem("WXC_last_balance");
                    $("#claimButton").click();


                }

            }, ( 1* 1000 ) );
            */

        }

        else if( location.pathname == "/ptc.php" ) {

            // ptc was removed from cryptodrip
            location.href = "/mine.php";

            /*
            if( !$("p:contains('available')").is(":visible") ) {

                setTimeout( function() {

                    $("#top-bar, #captchaForm").css("display","block");

                    // check response
                    var cf_check2 = setInterval( function() {

                        console.log("cf_check2_res");

                        if( $("[name=cf-turnstile-response]").val().length > 32 ) { // ok

                            clearInterval( cf_check2 );

                            let id = $('button:contains("View Ad")').first().attr('onclick')?.match(/\d+/)?.[0];

                            if( id > 0 ) {

                                $("#ad_id_input").val( id );
                                $('button:contains("Complete Captcha")').click();

                            }

                        }

                    }, 1000 );


                }, ( 2* 1000 ) );

            }
            else {

                location.href = "/mine.php";

            }
            */

        }

        else {
            // ...
        }


    });


    setTimeout( function() {
        location.reload();
    }, ( 45* 1000 ) );


})();