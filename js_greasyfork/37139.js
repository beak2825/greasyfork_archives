// ==UserScript==
// @name         fauceteasy
// @namespace    whatsup9942918024
// @version      1
// @description  Sign up: https://fauceteasy.win/?ref=2152 - enter your bitcoin adress on the page or in the script and start to earn every 10 minute automatically
// @author       manickam
// @match        https://fauceteasy.win/*
// @downloadURL https://update.greasyfork.org/scripts/37139/fauceteasy.user.js
// @updateURL https://update.greasyfork.org/scripts/37139/fauceteasy.meta.js
// ==/UserScript==

(function() {
    var adress = "";                               //enter your bitcoin adress here
    var password = "";                             //enter your password
    if(document.documentElement.innerText.indexOf('Your address bitcoin') > -1)
    {
        if(adress === "")
        {
            alert('enter your bitcoin adress or save it in script');
        }
        else
        {
            $('.form-control:eq(0)').val(adress);
            $('.form-control:eq(1)').val(password);

            setTimeout( function() {
                $('.btn.btn-enter.gradient').click();
            }, 3000);
        }
    }
    else
    {
        setInterval( function(){
            if($('#timer').text() === "")
            {
                var v1 = parseInt($( "input[name='captcha1']" ).attr('value'));
                var v2 = parseInt($( "input[name='captcha2']" ).attr('value'));
                var result = v1 + v2;
                $( "input[name='captcha_result']" ).val(result);
                setTimeout( function() {
                    $('#btn_claim').children().click();
                }, 1000);
                setTimeout( function(){
                    location.href = location.href;
                }, 3000);
            }
        },1000);
        setTimeout( function() {
            location.href = location.href;
        }, 600000);
    }
})();