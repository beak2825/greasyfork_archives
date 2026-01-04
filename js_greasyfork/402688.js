// ==UserScript==
// @name         BitFun.co (Pescador de Cripto)
// @namespace    https://greasyfork.org/en/users/466691-jadson-tavares
// @version      2.2
// @description  Auto Claim.
// @author       Jadson Tavares
// @match        *://*.bitfun.co/*
// @match        *://*.pescadordecripto.com/install/
// @match        *://*.pescadordecripto.com/dashboard/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402688/BitFunco%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402688/BitFunco%20%28Pescador%20de%20Cripto%29.meta.js
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

    function auto(){
        setTimeout(function(){
            $('.claimButton').trigger('click');

            setInterval(function(){
                if(grecaptcha && grecaptcha.getResponse().length > 0) {
                    if ($('.modal-footer').find('[data-bind="click: instantClaim"]').is(':visible')) {
                        $('.modal-footer').find('[data-bind="click: instantClaim"]').trigger('click');
                        message = "BitFun.co\n- Sucesso: Auto Claim.\n- CoinPot balance: " + $('.accountBalance').find('span').text() + " satoshis";
                        ntb(message);

                        setTimeout(function(){
                            if ($('.btn-default').is(':visible')) {
                                $('.btn-default').trigger('click');

                                setTimeout(function(){
                                    window.close();
                                },1000);
                            }
                        },3000);
                    }
                } else {
                    return;
                }
            },1000);

            setInterval(function(){
                if ($('.claimButton').is(':disabled')) {
                    setInterval(function(){
                        if ($('.claimButton').is(':enabled')) {
                            window.history.go(0);
                        } else {
                            window.close();
                            return;
                        }
                    },2000);
                }
            },1000);

            setTimeout(function(){
                if ($('.modal-footer').find('[data-bind="click: instantClaim"]').is(':visible')) {
                    window.history.go(0);
                } else {
                    return;
                }
            },30000);
        },500);
    }

    function bitFun() {
        setTimeout(function() {
            if(!$('[data-target="#SignInModal"]').is(':visible')){
                if (window.location.href.indexOf("bitfun.co/games") > -1) {
                    window.location.href = "https://bitfun.co/dice";
                }

                if ($('.claimButton').is(':visible')) {
                    auto();
                }
            }
        }, 1000);
    }

    function open(){
        if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
            var win_bitfun = window.open("https://bitfun.co/dice", "BitFun","width=10,height=10,left=-3000,top=-3000");
        }
        setTimeout(open,210000);
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'bitfun-co';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'BITFUN.CO';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }
    $(document).ready(function(){
        if (window.location.href.indexOf("bitfun.co/dice") > -1) {
            bitFun();
        }
    });
    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('bitfun-co').classList.add("faucet-active");
    }
})();