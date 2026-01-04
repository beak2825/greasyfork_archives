// ==UserScript==
// @name         bitverts.io
// @namespace    http://moneybot24.com/
// @version      1.3.1
// @description  Sign up: https://anon.to/vH9b9B - Login, Click "View PTC Ads", Bot starts, sometime you have to complete a recaptcha code
// @author       MoneyBot24.com
// @match        http://bitverts.io/*
// @downloadURL https://update.greasyfork.org/scripts/370613/bitvertsio.user.js
// @updateURL https://update.greasyfork.org/scripts/370613/bitvertsio.meta.js
// ==/UserScript==

(function() {
    // bitcoin = 1, ethereum = 2, litecoin = 3, bitcoin cash = 4
    var coin = 1;  // change the number to the coin
    if(window.location.href.indexOf("see?ptc&v=") > -1)
    {
        var i = setInterval( function() {
            if(document.documentElement.innerText.indexOf('Success') > -1 || document.documentElement.innerText.indexOf('Error! Invalid Captcha.') > -1)
            {
                setTimeout( function(){
                    location.href = "http://bitverts.io/see-ads?b=" + coin;
                }, 1000);
            }
            else if(document.documentElement.innerText.indexOf('Please complete the captcha before you can get credited.') > -1)
            {
                alert('Captcha');
                clearInterval(i);
                setInterval( function() {
                    if(document.documentElement.innerText.indexOf('Success') > -1 || document.documentElement.innerText.indexOf('Error! Invalid Captcha.') > -1)
                    {
                        setTimeout( function(){
                            location.href = "http://bitverts.io/see-ads?b=" + coin;
                        }, 1000);
                    }
                }, 1000);
            }
        }, 1000);
    }
    else if(window.location.href.indexOf("see-ads") > -1)
    {
        var loc = parseInt(window.location.href.split('=')[1]);
        if(loc !== coin)
        {
            location.href = "http://bitverts.io/see-ads?b=" + coin;
        }
        else
        {
            var o =  $('.block-content.block-content-full').find('[id*=ad].col-md-3').not('#ad').find('a').not('.fc-state-disabled');

            if(o.length !== 0)
            {
                o.first().addClass('fc-state-disabled');
                console.log(o.first().attr('href'));
                var win = window.open(o.first().attr('href'));
                window.close();
            }
            else
            {
                alert('change the coin in the script');
            }
        }
    }

})();