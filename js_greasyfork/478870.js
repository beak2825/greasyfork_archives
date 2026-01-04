// ==UserScript==
// @name         Automatically shortlink
// @description  Automatically link sites
// @author       Groland
// @version      9


// @match        https://mdn.lol/*
// @match        https://kenzo-flowertag.com/*
// @match        https://plumptofit.com/*
// @match        https://homeculina.com/*
// @match        https://chefslink.org/*
// @match        https://cookingpumpkin.com/*
// @match        https://ineedskin.com/*
// @match        https://financewrapper.net/*
// @match        https://danidmonkey.com/*
// @match        https://fishingbreeze.com/*
// @match        https://financeclick.net/*
// @match        https://bestfitnessgear4u.com/*
// @match        https://businessuniqueidea.com/*

// @match        https://lawyex.co/*
// @match        https://auntmanny.com/*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-latest.min.js
// @run-at document-end
// @noframes
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/478870/Automatically%20shortlink.user.js
// @updateURL https://update.greasyfork.org/scripts/478870/Automatically%20shortlink.meta.js
// ==/UserScript==




// edit "faucet_url" few lines bellow


this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';



    var faucet_url = // <--- EDIT HERE - if bypass or adblock, return to home faucet


    // focus page
    setInterval(function() { window.focus(); }, 100);
    document.hasFocus = function () {return true;};


    var $ = window.jQuery;
    $(document).ready(function() {


        // damn captcha
        $("#overlay").remove();
        $("#click").css("display","none");
        $("#"+ $(".g-recaptcha:first").closest("form>div").attr("id") ).css("display","block");


        if( $("#count").is(":visible") ) {

            var check = setInterval( function() {

                if( $("#count").text() == "0" ) {
                    clearInterval( check );

                    var check2 = setInterval( function() {

                        if( $("button[class^='btn-']:visible:contains('/')").first().text() ) {

                            clearInterval( check2 );
                            $("button[class^='btn-']:visible:contains('/')").first().click();

                        }

                    }, ( 1 * 1000 ) ); // slow down

                }

            }, ( 1 * 1000 ) ); // check for counter

        }
        else {

            setTimeout( function() {

                if( $(".g-recaptcha").is(":visible") ) {

                    document.title = "CAPTCHA!";
w
                    var r_timer = setInterval( function() {

                        if( $("#g-recaptcha-response").val().length > 32 ) {

                            if( $("button[class^='btn-']:visible:contains('/')").first().text() ) {

                                clearInterval( r_timer );
                                $("button[class^='btn-']:visible:contains('/')").first().click();


                            }

                        }

                    }, 3 * 3000 ); // check for captcha response



                }
                else {

                       location.reload();

                }

            }, ( 1 * 100 ) ); // wait to load captcha

        }

    });



    var check_err = setInterval( function() {

        if( location.host == "?redirect_to=random" || location.host == "talkforfitness.com" || location.href.indexOf("/bypass.htm") > -1 || location.href.indexOf("/adblock.htm") > -1 ) {

            clearInterval( check_err );

            // delete all domain cookies
            var cookies = document.cookie.split(";");
            for (var ic = 0; ic < cookies.length; ic++) {
                var cookie = cookies[ic];
                var eqPos = cookie.indexOf("=");
                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            }

            location.href = faucet_url;

        }


    }, ( 2 * 1000 ) );



    setTimeout( function() {
        location.reload
    }, ( 120 * 1000 ) ); // global reload if stucked 120sec = recaptcha expiry


})();

