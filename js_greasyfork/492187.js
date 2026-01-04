// ==UserScript==
// @name         FLY INC walkthrough*
// @namespace    FLY INC & advertisingexcel walkthrough helper.
// @description  Automatically walk through FLY INC link sites
// @author       QwertyBug
// @version      2.1.9

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


// @match        https://boardgamechick.com/*
// @match        https://phineypet.com/*
// @match        https://tunebug.com/*
// @match        https://edonmanor.com/*
// @match        https://gametechreviewer.com/*
// @match        https://vegan4k.com/*
// @match        https://pluginmixer.com/*
// @match        https://chefknives.expert/*
// @match        https://vrtier.com/*
// @match        https://basketballsavvy.com/*
// @match        https://healthyfollicles.com/*
// @match        https://hauntingrealm.com/*
// @match        https://misterio.ro/*
// @match        https://boredboard.com/*
// @match        https://gearsadviser.com/*

// @match        https://advertisingexcel.com/*


// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-latest.min.js
// @run-at document-start
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492187/FLY%20INC%20walkthrough%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/492187/FLY%20INC%20walkthrough%2A.meta.js
// ==/UserScript==

// https://shinchu.net/backup/w/?get=tyDW&short=wefly.me
// https://crewus.net/backup/w/?get=qmFr&short=urlsfly.me
// domain phineypet.com doing problems, so we skip = return to faucet
// edit "faucet_url" few lines bellow

this.$ = this.jQuery = jQuery.noConflict(true);

(function () {
    'use strict';






   // var faucet_url = "https://coingax.com/links"; // <--- EDIT HERE - if bypass or adblock, return to home faucet


    var monitor = function () {};

    setInterval(function () {
        window.focus();
    }, 100);
    document.hasFocus = function () {
        return true;
    };


    var $ = window.jQuery;
    $(document).ready(function () {

       // $("#overlay").remove();

       // $("#click").css("display", "block");
       // $("#" + $(".g-recaptcha:first").closest("form>div").attr("id")).css("display", "block");



        if ($("#count").is(":visible")) {
            document.title = "COUNT!";
            var check = setInterval(function () {

                if ($("#count").text() == "0") {
                    clearInterval(check);

                    var check2 = setInterval(function () {

                        if ($("button[class^='btn-']:visible:contains('/')").first().text()) {

                            clearInterval(check2);
                            $("button[class^='btn-']:visible:contains('/')").first().click();

                        }

                    }, (1 * 1000)); // slow down

                }

            }, (1 * 1000)); // check for counter

        } else {

            setTimeout(function () {
                if ($(".g-recaptcha").is(":visible")) {
                    document.title = "CAPTCHA!";
                    var r_timer = setInterval(function () {
                        if ($("#g-recaptcha-response").val().length > 0) {
                            if ($("button[class^='btn-']:visible:contains('/')").first().text()) {
                                clearInterval(r_timer);
                                $("button[class^='btn-']:visible:contains('/')").first().click();
                            }
                        }
                    }, 3 * 1000); // check for captcha response
                } else {
                    var source = document.getElementsByTagName('html')[0].innerHTML;
                    var found1 = source.search('Click Any Ad & Keep It Open For 15 Seconds To Continue');
                    var found2 = source.search('Click Any Ad & Keep It Open For 15 Seconds To Unlock Captcha');
                    var qq = eval(found1 + found2);
                    document.title = "Click Any Ad";
                    if (qq > 1) {
                        location.reload();
                    }
                }
            }, (3 * 1000)); // wait to load captcha
        }
    });



    if (location.host == "advertisingexcel.com") {
        var check = setInterval(function () {
            var check3 = setInterval(function () {
                if ($("button[class^='btn-']:visible:contains('Continue')").first().text()) {
                    clearInterval(check3);
                    $("button[class^='btn-']:visible:contains('Continue')").first().click();
                }
                if ($("button[class^='btn-']:visible:contains('Get Link')").first().text()) {
                    clearInterval(check3);
                    $("button[class^='btn-']:visible:contains('Get Link')").first().click();
                }

            }, (1 * 1000)); // slow down
        }, (1 * 1000)); // check for counter
    }


    var check_err = setInterval(function () {

        if (location.host == "phineypet.com" || location.href.indexOf("/bypass.htm") > -1 || location.href.indexOf("/adblock.htm") > -1) { // location.host == "linksfly.me" ||

            clearInterval(check_err);

            var cookies = document.cookie.split(";");
            for (var ic = 0; ic < cookies.length; ic++) {
                var cookie = cookies[ic];
                var eqPos = cookie.indexOf("=");
                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            }

          //  location.href = faucet_url;

        }


    }, (2 * 1000));



    setTimeout(function () {}, (200 * 1000)); // global reload if stucked 120sec = recaptcha expiry


})();