// ==UserScript==
// @name         Wildlynx Technology - Multi-Faucet - FreeBitcoin.Win
// @namespace    http://wildbitsio.blogspot.com
// @version      1.0.1
// @description  Powerful Tool for miners. Automate your mining capability. Save TIME!!
// @author       Ronald DC
// @match        http://freebitcoin.win/*
// @match        https://freebitcoin.win/*
// @downloadURL https://update.greasyfork.org/scripts/41077/Wildlynx%20Technology%20-%20Multi-Faucet%20-%20FreeBitcoinWin.user.js
// @updateURL https://update.greasyfork.org/scripts/41077/Wildlynx%20Technology%20-%20Multi-Faucet%20-%20FreeBitcoinWin.meta.js
// ==/UserScript==

(function() {

    var i = setInterval( function() {

        var bitcoin = true;
        var bitcore = true;
        var dogecoin = true;
        var litecoin = true;
        var kb3coin = false;
        var ethereum = true;
        var potcoin = true;
        var faucets = $(".kkcount-down-1:contains('Ready to claim')");

        if(!bitcore || !bitcoin || !dogecoin || !kb3coin || !litecoin || !ethereum || !potcoin)
        {
            faucets = faucets.parent().parent();

            if(!bitcore)
            {
                faucets.not("[href*=bitcore]");
            }
            if(!bitcoin)
            {
                faucets = faucets.not("[href*=bitcoin]");
            }
            if(!dogecoin)
            {
                faucets = faucets.not("[href*=doge]");
            }
            if(!kb3coin)
            {
                faucets = faucets.not("[href*=kb3coin]");
            }
            if(!litecoin)
            {
                faucets = faucets.not("[href*=lite]");
            }
            if(!ethereum)
            {
                faucets = faucets.not("[href*=ethereum]");
            }
            if(!potcoin)
            {
                faucets = faucets.not("[href*=pot]");
            }
        }

        if(faucets.length !== 0)
        {
            faucets[0].click();
        }
    }, 1000);
    setInterval( function(){
        var el =  $('#adcopy_response');
        var a =  $('.alert').length;
        if(a === 1 || a === 2)
        {

            if(document.location.href.indexOf('withdraw') > -1)
            {
                location.href = "http://freebitcoin.win/settings/withdraw";
            }
            else if(document.location.href.indexOf('settings') < -1)
            {
                location.href = "http://freebitcoin.win/faucet/";
            }
        }
        else if(document.documentElement.innerText.indexOf('Thanks, you can now validate') > -1)
        {
            setTimeout( function() {
                $('.btn.btn-block.btn-primary')[0].click();
            }, 4000);
        }
        else  if(el.length > -1)
        {
            setTimeout( function() {
                var checkPlay = setInterval( function() {
                    $('#playBtn').click();
                    setTimeout( function() {
                        $('#adcopy-expanded-response').focus();
                        $('#adcopy-expanded-response').attr('autocomplete', 'on');
                    }, 3000);
                    clearInterval(checkPlay);
                }, 1000);
                $('#adcopy_response').focus();
                $('#adcopy_response').attr('autocomplete', 'on');

            }, 2000);
        }
    }, 1000);

})();
