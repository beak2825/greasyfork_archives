// ==UserScript==
// @name         BonusBitcoin.co (Pescador de Cripto)
// @namespace    https://greasyfork.org/en/users/466691-jadson-tavares
// @version      1.6
// @description  Auto Claim.
// @author       Jadson Tavares
// @match        *://*.bonusbitcoin.co/*
// @match        *://*.pescadordecripto.com/install/
// @match        *://*.pescadordecripto.com/dashboard/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402689/BonusBitcoinco%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402689/BonusBitcoinco%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////// CONFIGURAÇÃO NOTIFICAÇÃO TELEGRAM //////
    var telegram_bot_token = ""; // TOKEN DO BOT
    var chat_id = ""; // ID DO SEU CHAT
    var message;
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

    function bonusBtc() {
        setTimeout(function(){
            if ($('#FaucetForm').find('[data-bind="click: delayedClaim, text: claimButtonText, enable: canClaimNow"]').is(':disabled')) {
                $('#captchaContainer').css('display', 'none');
                window.close();
            }
        },1000);

        setInterval(function(){
            if(grecaptcha && grecaptcha.getResponse().length > 0) {
                if ($('#FaucetForm').find('[data-bind="click: delayedClaim, text: claimButtonText, enable: canClaimNow"]').is(':visible') && $('#FaucetForm').find('[data-bind="click: delayedClaim, text: claimButtonText, enable: canClaimNow"]').is(':enabled')) {

                    $('#FaucetForm').find('[data-bind="click: delayedClaim, text: claimButtonText, enable: canClaimNow"]').trigger('click');

                    setTimeout(function(){
                        message = "BonusBitcoin.co\n- Sucesso: " + $('.modal-body').find('.text-success').text();
                        ntb(message);
                        if ($('.btn-default').is(':visible')) {
                            $('.btn-default').trigger('click');
                            setTimeout(function(){
                                window.close();
                            },1000);
                        }
                    },5000);
                }
            } else {
                return;
            }
        },1000);

        setTimeout(function(){
            if ($('#FaucetForm').find('[data-bind="click: delayedClaim, text: claimButtonText, enable: canClaimNow"]').is(':visible') &&
                $('#FaucetForm').find('[data-bind="click: delayedClaim, text: claimButtonText, enable: canClaimNow"]').is(':enabled')) {
                window.history.go(0);
            }
        },30000);

        setInterval(function() {
            if (window.location.href.indexOf("bonusbitcoin.co/faucet") > -1) {
                window.history.go(0);
            }
        }, 900000);
    }

    function open(){
        if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
            window.open("https://bonusbitcoin.co/faucet", "BonusBitcoin","width=10,height=10,left=-32000,top=-32000");
        }
        setTimeout(open,960000);
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'bonusbitcoin-co';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'BONUSBITCOIN.CO';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }
    $(document).ready(function(){
        if (window.location.href.indexOf("bonusbitcoin.co/faucet") > -1) {
            bonusBtc();
        }
    });

    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('bonusbitcoin-co').classList.add("faucet-active");
    }
})();