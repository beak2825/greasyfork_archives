// ==UserScript==
// @name         Bitshark.io (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.4
// @description  Auto Mining.
// @author       Jadson Tavares
// @match        *://*.bitshark.io/dashboard/
// @match        *://*.pescadordecripto.com/dashboard/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419543/Bitsharkio%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/419543/Bitsharkio%20%28Pescador%20de%20Cripto%29.meta.js
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

    function bitshark(){
        setInterval(function(){
            if($('#content > div > div.miner-container.text-center > div:nth-child(1) > div > span').is(':visible')){
                $('#content > div > div.miner-container.text-center > div:nth-child(3) > img').click();

                setTimeout(function(){
                    if(!$('#content > div > div.miner-container.text-center > div:nth-child(1) > div > span').is(':visible')){
                        var b = $('#balance-mobile > span').text();
                        var balance = b.substr(0,b.indexOf('D'));
                        message = "Bitshark.io\n- Sucesso: Mineração completa!\n- Sua balança: " + balance + " BTC\n- Saque mínimo: 0.00030000 BTC";
                        ntb(message);
                        setTimeout(function(){
                            window.close();
                            window.history.go(0);
                        },1000);
                    }
                },3000);
            }
        },2000);

        setTimeout(function(){
            if($('#content > div > div.miner-container.text-center > div:nth-child(1) > div > span').is(':visible')){
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
            window.open("https://bitshark.io/dashboard/", "Bitshark","width=10,height=10,left=-3000,top=-3000");
        }
        setTimeout(open,3660000);
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'bitshark-io';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'BITSHARK.IO';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }
    if (window.location.href.indexOf("bitshark.io/dashboard") > -1) {
        bitshark();
    }
    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('bitshark-io').classList.add("faucet-active");
    }
})();