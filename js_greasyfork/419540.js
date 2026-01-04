// ==UserScript==
// @name         BitKing.biz (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.3
// @description  Auto Roll.
// @author       Jadson Tavares
// @match        *://*.bitking.biz/
// @match        *://*.pescadordecripto.com/install/
// @match        *://*.pescadordecripto.com/dashboard/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419540/BitKingbiz%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/419540/BitKingbiz%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function random(min,max){
        return min + (max - min) * Math.random();
    }

    function bitking(){
        console.log("Status: Page loaded.");
        setInterval(function(){
            if(grecaptcha && grecaptcha.getResponse().length > 0) {
                console.log("Status: reCAPTCHA solved.");
                if ($('#roll_button').is(':visible')) {
                    if(!$('body > div.swal-overlay.swal-overlay--show-modal > div > div.swal-text').is(':visible')){
                        $('#roll_button').trigger('click');
                    }
                    console.log("Status: Button ROLL clicked.");
                }
            }
            if($('body > div.swal-overlay.swal-overlay--show-modal > div > div.swal-text').is(':visible')){
                /*var withdraw = "0.00030000 BTC";
                message = "BitKing.biz\n- Sucesso: " + $('body > div.swal-overlay.swal-overlay--show-modal > div > div.swal-text').text() + "\n- Sua balança: " + $('#user_balance_bar').text() + " BTC\n- Saque mínimo: " + withdraw;
                ntb(message);*/
                setTimeout(function(){
                    window.close();
                    window.history.go(0);
                },1000);
            }
        },5000);

        setTimeout(function(){
            if($('#roll_button').is(':visible')) {
                console.log("Status: reCAPTCHA not solved.");
                window.history.go(0);
            } else {
                window.close();
            }
        },30000);

        setInterval(function(){
            window.history.go(0);
        },600000);
    }

    function open(){
        if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
            window.open("https://www.bitking.biz/", "Btcmaker","width=10,height=10,left=-3000,top=-3000");
        }
        setTimeout(open,3660000);
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'bitking-biz';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'BITKING.BIZ';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }
    if (window.location.href.indexOf("bitking.biz") > -1) {
        bitking();
    }
    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('bitking-biz').classList.add("faucet-active");
    }
})();