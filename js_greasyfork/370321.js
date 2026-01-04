// ==UserScript==
// @name         Bitverts.io
// @icon         http://bitverts.io/template/default/assets/img/favicons/favicon.png
// @namespace    helpercoins.blogspot.com
// @version      1
// @description  Sign up: https://anon.to/IQDshu - Login, Click "View PTC Ads", Bot starts, sometime you have to complete a recaptcha code
// @author       Helpercoins.blogspot.com
// @match        http://bitverts.io/*
// @downloadURL https://update.greasyfork.org/scripts/370321/Bitvertsio.user.js
// @updateURL https://update.greasyfork.org/scripts/370321/Bitvertsio.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // bitcoin = 1, ethereum = 2, litecoin = 3, bitcoin cash = 4
    var coin = 3;  // change the number to the coin
    if(window.location.href.indexOf("see?ptc&v=") > -1) {
        var i = setInterval( function() {
            if(document.documentElement.innerText.indexOf('Success') > -1 || document.documentElement.innerText.indexOf('Error! Invalid Captcha.') > -1) {
                setTimeout( function(){
                    location.href = "http://bitverts.io/see-ads?b=" + coin;
                }, 1000);
            } else if(document.documentElement.innerText.indexOf('Please complete the captcha before you can get credited.') > -1) {
                alert('Captcha');
                clearInterval(i);
                setInterval( function() {
                    if(document.documentElement.innerText.indexOf('Success') > -1 || document.documentElement.innerText.indexOf('Error! Invalid Captcha.') > -1) {
                        setTimeout( function(){
                            location.href = "http://bitverts.io/see-ads?b=" + coin;
                        }, 1000);
                    }
                }, 1000);
            }
        }, 1000);
    } else if(window.location.href.indexOf("see-ads") > -1) {
        var loc = parseInt(window.location.href.split('=')[1]);
        if(loc !== coin) {
            location.href = "http://bitverts.io/see-ads?b=" + coin;
        } else {
            var ads =  $('.block-content.block-content-full').find('[id*=ad].col-md-3').not('#ad').find('a').not('.fc-state-disabled');

            if(ads.length !== 0) {
                ads.first().addClass('fc-state-disabled');
                console.log(ads.first().attr('href'));
                var win = window.open(ads.first().attr('href'));
                window.close();
            } else {
                alert('change the coin in the script');
            }
        }
    }

})();