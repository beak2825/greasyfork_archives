// ==UserScript==
// @name         koiniom.com
// @description  auto_login
// @author       WXC
// @version      1.0
// @match        https://koiniom.com/*
// @grant        none
// @run-at document-idle
// @noframes
// @namespace https://greasyfork.org/users/713625
// @downloadURL https://update.greasyfork.org/scripts/524068/koiniomcom.user.js
// @updateURL https://update.greasyfork.org/scripts/524068/koiniomcom.meta.js
// ==/UserScript==


// maybe you need turnstile cloudflare solver :  https://chromewebstore.google.com/detail/cloudfreed-cloudflare-sol/hjbjibnjdammlhgfidinkhghelcmenjd


(function() {


    // SET WALLET YOU WANT TO USE FOR LOGIN
    const wallets = {
      ln: "", // Lightning ( ex. exik@walletofsatoshi.com )
      bitcoin: "", // FaucetPay ( ex. 1Gq3kajxR97agxCrJKWWKHFdFMp16sNbiN )
      dash: "", // Dash
      doge: "", // Dogecoin
      eth: "", // Ethereum
      bch: "", // Bitcoin Cash
      sol: "" // Solana
    };




    // ads -> earn -> sleep

    var now = Date.now();
    var jq = document.createElement('script');
    jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js";

    function sleep( sec = 60, max = 0 ) {

        setTimeout( function() {
            location.reload();
        }, ( sec * 1000 ) );

    }


    var c_check = setInterval( function() {

        if( $("button:contains('Verify Captcha')").is(":visible") ) { // captcha


            if ($('#selectCaptcha').val() !== 'turnstile') {
                $('#selectCaptcha').val('turnstile').trigger('change');
            }

            clearInterval( c_check );
            var cf_check = setInterval( function() {

                console.log("cf_check_res");

                if( $("[name=cf-turnstile-response]").val().length > 32 ) {

                    clearInterval( cf_check );
                    $("button:contains('Verify Captcha')").click();
                    //alert( "CF" );

                }

            }, 2000 );


            setTimeout( function() {
                document.title = "CF_AUTO";
            }, ( 5* 1000 ) );


            setTimeout( function() {
                location.reload();
            }, ( 20* 1000 ) );

        }

    }, 3000 );



    if( location.pathname == "/" ) {

      for (const [crypto, wallet] of Object.entries(wallets)) {
        if (wallet !== undefined && wallet) {
          $("#cryptocurrency").val(crypto);
          $("#bitcoin_address").val(wallet);
          break;
        }
      }


        setTimeout( function() {
            $("#loginbtn").click();
        }, ( 1* 1000 ) );


    }



    if( location.pathname == "/ads" ) {

        setInterval(function() { window.focus(); }, 100);
        document.hasFocus = function () {return true;};


        document.getElementsByTagName('head')[0].appendChild(jq);
        //jQuery.noConflict();


        setTimeout( function() {

            $(document).ready(function() {


                if( $("h1:contains('available ads')").is(":visible") ) {

                    location.href = "/faucet";

                }
                else { // start

                    var ads_check = setInterval( function() {

                        console.log("ads_check_res");

                        if( $("#next").is(":visible") ) {

                            clearInterval( ads_check );
                            $("#next").click();

                        }



                        if( $(".toast-message:contains('Click the Play')").is(":visible") ) {
                            clearInterval( ads_check );
                            video_playing = true;
                        }


                    }, 3000 );

                    var ok_check = setInterval( function() {

                        console.log("ok_check_res");

                        if( $("#load .alert-success").is(":visible") ) {

                            if( $("#load .alert-success:contains('You view maximum ads')").is(":visible") ) {

                                location.href = "/earn";

                            }
                            else {

                                localStorage.removeItem("ads_ts");

                                clearInterval( ok_check );
                                $("#next").click();
                                //alert( "OK?");

                                setTimeout( function() {
                                    location.reload();
                                }, ( 1* 1000 ) );

                            }

                        }

                    }, 2000 );



                }

            });


        }, ( 2* 1000 ) );

    }



    if( location.pathname == "/earn" ) {

        function startCountdown( countdown ) {

            const interval = setInterval(() => {
                document.title = countdown +"s";

                if (countdown <= 0) {
                    clearInterval(interval);
                    document.title = "??";
                }

                countdown--;
            }, 1000);

        }



        $(document).ready(function() {

            setTimeout( function() {

                if( $("h4:contains('There is no more ads!')").is(":visible") ) {

                    var faucet_ts = localStorage.getItem('faucet_ts');

                    if (!faucet_ts || now - faucet_ts > ( 17 * 60 * 1000 ) ) { // 17min
                        location.href = "/faucet";
                        //sleep();
                    }
                    else {
                        sleep();
                    }

                }
                else {

                    $("script[type='text/javascript']").each(function() {
                        var scriptContent = $(this).html();

                        var adTimeMatch = scriptContent.match(/var adTime\s*=\s*parseInt\('(\d+)'\);/);
                        var adIdMatch = scriptContent.match(/var adId\s*=\s*'([^']+)';/);

                        if (adTimeMatch && adIdMatch) {
                            var adTime = parseInt(adTimeMatch[1]);
                            var adId = adIdMatch[1];

                            console.log( adTime );
                            console.log( adId );

                            $("body").css("background-color","#ffc107"); // working

                            $.ajax({
                                url: 'https://koiniom.com/earn/verify',
                                type: 'POST',
                                data: { ad_id: adId },
                                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                                headers: {
                                    'Accept': '*/*',
                                    'X-Requested-With': 'XMLHttpRequest'
                                },
                                success: function(response) {
                                    console.log('Verify response:', response);


                                    startCountdown( adTime );

                                    setTimeout(function() {

                                        $.ajax({
                                            url: 'https://koiniom.com/earn/validate',
                                            type: 'POST',
                                            data: { ad_id: adId },
                                            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                                            headers: {
                                                'Accept': '*/*',
                                                'X-Requested-With': 'XMLHttpRequest'
                                            },
                                            success: function(response) {

                                                console.log('Validate response:', response);
                                                document.title = JSON.parse(response).message;
                                                $("body").css("background-color", "#4caf50"); // ok

                                                if( response.indexOf("maximum") > -1 )  {
                                                    console.log("MAX");
                                                    location.href = "/faucet";
                                                }
                                                else {
                                                    location.reload();
                                                }


                                            },
                                            error: function(jqXHR, textStatus, errorThrown) {
                                                console.error('Error on validate:', textStatus, errorThrown);
                                            }
                                        });
                                    }, (adTime + 1) * 1000);

                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    console.error('Error on verify:', textStatus, errorThrown);
                                }

                            });

                        }
                        else {
                            console.error('ERR');
                        }
                    });

                }

            }, ( 3* 1000 ) );

        });


    }



    if( location.pathname.indexOf("/faucet") > -1 ) {

        document.getElementsByTagName('head')[0].appendChild(jq);

        setTimeout( function() {

            if( $("button:contains('Claim')").is(":visible") ) {
                $("button:contains('Claim')").click();
            }
            else {

              localStorage.setItem('faucet_ts', now);

              setTimeout( function() {
                  sleep();
              }, ( 3* 1000 ) );

            }

        }, 2* 1000 );


    }



    setTimeout( function() {
        location.reload();
    }, ( 90 * 1000 ) ); //ms


})();
