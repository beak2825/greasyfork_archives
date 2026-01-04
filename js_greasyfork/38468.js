// ==UserScript==
// @name         bitverts.io
// @namespace    http://moneybot24.com/
// @version      1.1
// @description  Sign up: http://bitverts.io/?r=14626 - Login, Click "View PTC Ads", Bot starts, sometime you have to complete a recaptcha code
// @author       MoneyBot24.com
// @match        http://bitverts.io/*
// @downloadURL https://update.greasyfork.org/scripts/38468/bitvertsio.user.js
// @updateURL https://update.greasyfork.org/scripts/38468/bitvertsio.meta.js
// ==/UserScript==



(function() {
    if(window.location.href.indexOf("see?ptc&v=") > -1)
    {
        var i = setInterval( function() {
            if(document.documentElement.innerText.indexOf('Success') > -1 || document.documentElement.innerText.indexOf('Error! Invalid Captcha.') > -1)
            {
                setTimeout( function(){
                    location.href = "http://bitverts.io/see-ads?ptc";
                }, 1000);
            }
            else if(document.documentElement.innerText.indexOf('Please complete the captcha before you can get credited.') > -1)
            {
                alert('Captcha');
                clearInterval(i);
                setInterval( function(){
                   if(document.documentElement.innerText.indexOf('Success') > -1 || document.documentElement.innerText.indexOf('Error! Invalid Captcha.') > -1)
                   {
                        setTimeout( function(){
                            location.href = "http://bitverts.io/see-ads?ptc";
                        }, 1000);
                   }
                },1000);
            }
        }, 1000);
    }
    else if(window.location.href.indexOf("see-ads?ptc") > -1)
    {
        var o =   $('.col-md-3').not('#ad').children().not('.fc-state-disabled').first();
        o.addClass('fc-state-disabled');
        console.log(o.attr('href'));
        var win = window.open(o.attr('href'), '_self');
    }

})();