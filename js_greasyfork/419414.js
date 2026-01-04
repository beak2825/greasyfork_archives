// ==UserScript==
// @name         Btcmaker.io (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.5
// @description  Auto Roll.
// @author       Jadson Tavares
// @match        *://btcmaker.io/faucet.php
// @match        *://*.pescadordecripto.com/install/
// @match        *://*.pescadordecripto.com/dashboard/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419414/Btcmakerio%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/419414/Btcmakerio%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////// CONFIGURAÇÃO NOTIFICAÇÃO TELEGRAM //////
    var telegram_bot_token = ""; // TOKEN DO BOT
    var chat_id = ""; // ID DO SEU CHAT
    var message;
    ///////////////////////////////////////////////

    function ntb(msg){
        $.ajax({
            url:'https://api.telegram.org/bot'+telegram_bot_token+'/sendMessage',
            method:'POST',
            data:{chat_id:chat_id,text:msg},
            success:function(){
                console.log(message);
            }
        });
    }

    function random(min,max){
        return min + (max - min) * Math.random();
    }

    function btcmaker(){
        console.log("Status: Page loaded.");
        setInterval(function(){
            if(grecaptcha && grecaptcha.getResponse().length > 0) {
                console.log("Status: reCAPTCHA solved.");
                if ($('#process_claim_hourly_faucet').is(':visible')) {
                    $('#process_claim_hourly_faucet').click();
                    console.log("Status: Button ROLL clicked.");

                    setTimeout(function(){
                        window.close();
                    },10000);
                } else {
                    console.log("Status: Button ROLL not visible.");
                    setTimeout(function(){
                        window.history.go(0);
                    },5000);
                }
            }
            if($('body > div.jq-toast-wrap.top-right > div').is(':visible')){
                var withdraw = "0.00030000 BTC";
                var s = $('body > div.jq-toast-wrap.top-right > div').text();
                var success = s.substr(s.indexOf('!')+1);
                message = "Btcmaker.io\n- Sucesso: " + success + "\n- Sua balança: " + $('body > header > nav > div.navbar-header > div > div > span').text() + " BTC\n- Saque mínimo: " + withdraw;
                ntb(message);
                setTimeout(function(){
                    window.close();
                    window.history.go(0);
                },1000);
            }
        },1500);

        setTimeout(function(){
            if($('#process_claim_hourly_faucet').is(':visible')) {
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
            window.open("https://btcmaker.io/faucet.php", "Btcmaker","width=10,height=10,left=-3000,top=-3000");
        }
        setTimeout(open,3660000);
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'btcmaker-io';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'BTCMAKER.IO';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }
    if (window.location.href.indexOf("faucet") > -1) {
        btcmaker();
    }
    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('btcmaker-io').classList.add("faucet-active");
    }
})();