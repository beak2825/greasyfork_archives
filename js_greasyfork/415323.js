// ==UserScript==
// @name         MoonBitcoin.cash (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.3
// @description  Auto Roll
// @author       Jadson Tavares
// @match        *://moonbitcoin.cash/faucet
// @match        https://*.pescadordecripto.com/dashboard/
// @match        https://*.pescadordecripto.com/install/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415323/MoonBitcoincash%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/415323/MoonBitcoincash%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////// CONFIGURAÇÃO NOTIFICAÇÃO TELEGRAM //////
    var telegram_bot_token = ""; // TOKEN DO BOT
    var chat_id = ""; // ID DO SEU CHAT
    var message;
    ///////////////////////////////////////////////

    /////////// CONFIGURAÇÃO DO SCRIPT ////////////
    var exe_min = 60; // TEMPO EM MINUTOS, MINIMO 5 MINUTOS
    ///////////////////////////////////////////////

    function random(min,max){
        return min + (max - min) * Math.random();
    }

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

    function checkRoll(){
        if($('[data-bind="text: claimAmount().toFixed(claimAmount() >= 0.001 ? 4 : 8)"]').text().indexOf('0.00000050') > -1){
            setTimeout(function(){
                if($('[data-bind="text: claimAmount().toFixed(claimAmount() >= 0.001 ? 4 : 8)"]').text().indexOf('0.00000050') < 0){
                    window.history.go(0);
                }
            },2000);
        }
        setTimeout(checkRoll,1000);
    }

    function roll(){
        if(grecaptcha && grecaptcha.getResponse().length > 0) {
            $('.modal-footer').find('button').eq(1).click();
        }
        if($('.close').eq(1).is(':visible')){
            message = "MoonBitcoin.cash\n- Sucesso: Recebeu " + $('[data-bind="text: claimedAmount().toFixed(8)"]').eq(0).text() + " BCH\n- CoinPot balance: " + $('[data-bind="text: balance().toFixed(8)"]').eq(1).text() + " BCH";
            ntb(message);

            setTimeout(function(){
                $('.close').eq(1).click();

                window.close();
            },3000);
        }
        setTimeout(roll,5000);
    }

    function moonBtc(){
        setTimeout(function(){
            if ($('.btn.btn-coin.btn-lg').is(':visible')) {
                $('.btn.btn-coin.btn-lg').click();
                roll();
                checkRoll();
            }
        },1000);

        setTimeout(function(){
            if ($('.close').eq(0).is(':visible')) {
                window.history.go(0);
            } else {
                return;
            }
        },30000);

        setTimeout(function(){
            window.history.go(0);
        }, 1560000);
    }

    function open(){
        if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
            var win_moonbitcoincash = window.open("https://moonbitcoin.cash/faucet", "MoonBitcoinCash","width=10,height=10,left=-3000,top=-3000");
        }
        setTimeout(open,random(exe_min*1000*60,exe_min*1000*60+10*1000*60));
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'moonbitcoin-cash';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'MOONBITCOIN.CASH';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }

    $(document).ready(function(){
        setTimeout(function(){
            if (window.location.href.indexOf("moonbitcoin.cash/faucet") > -1) {
                moonBtc();
            }
        },10000);
    });
    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('moonbitcoin-cash').classList.add("faucet-active");
    }
})();