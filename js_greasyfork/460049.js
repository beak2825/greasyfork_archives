// ==UserScript==
// @name         FLY INC walkthrough - Need captcha solver!
// @description  Automatically walk through FLY INC link sites
// @author       WXC
// @version      1.10

// @match        https://linksfly.me/*
//
// @match        https://thumb9.net/*
// @match        https://shinbhu.net/*
// @match        https://crewus.net/*
// @match        https://crewbase.net/*
// @match        https://topcryptoz.net/*
// @match        https://allcryptoz.net/*
// @match        https://ultraten.net/*
// @match        https://uniqueten.net/*
// @match        https://thumb8.net/*
// @match        https://shinchu.net/*
// @match        https://batmanfactor.com/*
// @match        https://phineypet.com/*
// @match        https://talkforfitness.com/*
// @match        https://techedifier.com/*

// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-latest.min.js
// @run-at document-start
// @noframes
// @namespace https://greasyfork.org/users/713625
// @downloadURL https://update.greasyfork.org/scripts/460049/FLY%20INC%20walkthrough%20-%20Need%20captcha%20solver%21.user.js
// @updateURL https://update.greasyfork.org/scripts/460049/FLY%20INC%20walkthrough%20-%20Need%20captcha%20solver%21.meta.js
// ==/UserScript==



// domain phineypet.com doing problems, so we skip = return to faucet
// edit "faucet_url" few lines bellow


this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';


    var faucet_url = "https://coingax.com/links"; // <--- EDIT HERE - if bypass or adblock, return to home faucet


    var monitor = function(){};

    // focus page
    setInterval(function() { window.focus(); }, 100);
    document.hasFocus = function () {return true;};


    var $ = window.jQuery;
    $(document).ready(function() {


        // damn captcha
        $("#overlay").remove();
        //$("#click").css("display","none");
        $("#click").css("display","block");
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

                    var r_timer = setInterval( function() {

                        if( $("#g-recaptcha-response").val().length > 32 ) {

                            if( $("button[class^='btn-']:visible:contains('/')").first().text() ) {

                                clearInterval( r_timer );
                                $("button[class^='btn-']:visible:contains('/')").first().click();

                            }

                        }

                    }, 3 * 1000 ); // check for captcha response

                }
                else {

                    location.reload();

                }

            }, ( 5 * 1000 ) ); // wait to load captcha

        }

    });



    var check_err = setInterval( function() {

        if( location.host == "phineypet.com" || location.href.indexOf("/bypass.htm") > -1 || location.href.indexOf("/adblock.htm") > -1 ) { // location.host == "linksfly.me" ||

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