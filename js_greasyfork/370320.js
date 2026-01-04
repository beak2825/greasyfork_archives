// ==UserScript==
// @name         Clixsatoshi
// @icon         http://clixsatoshi.com/favicon.ico
// @namespace    helpercoins.blogspot.com
// @version      1
// @description  Sign up: https://anon.to/2SihAt - Login, Click "View PTC Ads", Bot starts, sometime you have to complete a recaptcha code
// @author       Helpercoins.blogspot.com
// @match        http://clixsatoshi.com/*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/370320/Clixsatoshi.user.js
// @updateURL https://update.greasyfork.org/scripts/370320/Clixsatoshi.meta.js
// ==/UserScript==

(function() {

    if(window.location.href.indexOf("view") > -1) {
        var i = setInterval( function() {
            if(jQuery('.progress-bar').hasClass('progress-bar-success') || document.documentElement.innerText.indexOf('You have closed the CAPTCHA modal, please reload the advertisement.') > -1 || document.documentElement.innerText.indexOf('Invalid CAPTCHA code.') > -1 || document.documentElement.innerText.indexOf('Congratulations!') > -1 || document.documentElement.innerText.indexOf('You already viewed this ad in the last 24h...') > -1 || document.documentElement.innerText.indexOf('Invalid token!') > -1) {
                setTimeout( function(){
                    location.href = "http://clixsatoshi.com/ads";
                }, 1000);
            } else if(document.documentElement.innerText.indexOf('Awaiting captcha...') > -1) {
                var foCus =  jQuery('.form-control');
                if(foCus.length > -1) {
                    setTimeout( function() {
                        foCus.focus();
                    }, 1000);
                }
                clearInterval(i);
                setInterval( function() {
                    if(jQuery('.progress-bar').hasClass('progress-bar-success') || document.documentElement.innerText.indexOf('You have closed the CAPTCHA modal, please reload the advertisement.') > -1 || document.documentElement.innerText.indexOf('Invalid CAPTCHA code.') > -1 || document.documentElement.innerText.indexOf('Congratulations!') > -1 || document.documentElement.innerText.indexOf('You already viewed this ad in the last 24h...') > -1 || document.documentElement.innerText.indexOf('Invalid token!') > -1) {
                        setTimeout( function(){
                            location.href = "http://clixsatoshi.com/ads";
                        }, 1000);
                    }
                }, 1000);
            }
        }, 1000);
    } else if(window.location.href.indexOf("ads") > -1) {
        var ad =  $('.col-md-8').find('.viewads-ad').not('.visited-link').find('.viewads-row-title').find('a');

        if(ad.length !== 0) {
            console.log(ad.first().attr('href'));
            var win = window.open(ad.first().attr('href'));
            window.close();
        }
    }

})();