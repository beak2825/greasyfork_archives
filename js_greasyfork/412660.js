// ==UserScript==
// @name         Freebitco.in (Pescador de Cripto)
// @namespace    https://greasyfork.org/en/users/466691-jadson-tavares
// @version      0.9
// @description  Auto Roll.
// @author       Jadson Tavares
// @match        *://*.freebitco.in/*
// @match        *://*.pescadordecripto.com/install/
// @match        *://*.pescadordecripto.com/dashboard/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412660/Freebitcoin%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/412660/Freebitcoin%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var count_min = 1;

    ////// CONFIGURAÇÃO NOTIFICAÇÃO TELEGRAM //////
    var telegram_bot_token = ""; // TOKEN DO BOT
    var chat_id = ""; // ID DO SEU CHAT
    var message;
    var withdraw;
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

    function freeBitcoinComCaptcha() {
        console.log("Status: Pagina carregada. Conta com captcha.");
        setInterval(function(){
            if ($('#free_play_form_button').is(':visible')) {
                if(grecaptcha && grecaptcha.getResponse().length > 0) {
                    console.log("Status: reCAPTCHA solved.");
                    $('#free_play_form_button').click();
                    console.log("Status: Button ROLL clicked.");

                    setTimeout(function(){
                        window.close();
                    },10000);
                }
            } else {
                setTimeout(function(){
                    window.close();
                },10000);
            }

            if($('#free_play_result').find('.bold.center').text().indexOf('0') > -1){
                $.ajax({
                    url:'https://freebitco.in/',
                    type:'GET',
                    success: function(data){
                        var str = $(data).find('#auto_withdraw_option').find('.large-12.small-12.columns.center.reward_table_box.table_header_background.br_5_5').find('div').text();
                        withdraw = str.substr(str.indexOf('0')-1, 15);
                        console.log(withdraw);
                    }
                });
                setTimeout(function(){
                    message = "Freebitco.in\n- Sucesso: " + $('#free_play_result').find('.bold.center').text() + "\n- Sua balança: " + $('#balance').text() + " BTC\n- Saque mínimo: " + withdraw;
                    ntb(message);

                    setTimeout(function(){
                        window.close();
                        window.history.go(0);
                    },1000);
                },5000);
            }
        }, 2000);

        setTimeout(function(){
            if($('#free_play_form_button').is(':visible')) {
                console.log("Status: reCAPTCHA not solved.");
                window.history.go(0);
            } else {
                setTimeout(function(){
                    window.close();
                },1000);
            }
        },30000);

        setTimeout(function(){
            $('.close-reveal-modal')[0].click();
            console.log("Status: Button CLOSE POPUP clicked.");
        }, random(31000,33000));
    }

    function freeBitcoinSemCaptcha() {
        console.log("Status: Pagina carregada. Conta sem captcha");
        setTimeout(function(){
            if($('#free_play_form_button').is(':visible')) {
                $('#free_play_form_button').click();
                console.log("Status: Button ROLL clicked.");
                message = "Freebitco.in - Sucesso: Auto Roll";
                ntb(message);
            } else {
                setTimeout(function(){
                    window.close();
                },1000);
            }
        }, random(2000,4000));

        setTimeout(function(){
            $('.close-reveal-modal')[0].click();
            console.log("Status: Button CLOSE POPUP clicked.");
        }, random(12000,18000));

        setTimeout(function(){
            if($('#free_play_form_button').is(':visible')) {
                console.log("Status: button not clicked.");
                window.history.go(0);
            } else {
                setTimeout(function(){
                    window.close();
                },1000);
            }
        },30000);

        setInterval(function(){
            $('#free_play_form_button').click();
            console.log("Status: Button ROLL clicked again.");
        }, random(3605000,3615000));
    }

    function open(){
        if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
            window.open("https://freebitco.in/?op=home", "FreeBitco","width=10,height=10,left=-3000,top=-3000");
        }
        setTimeout(open,3660000);
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'freebitco-in-auto-roll';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'FREEBITCO.IN';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }
    $(document).ready(function(){
        if (window.location.href.indexOf("freebitco.in") > -1) {
            setTimeout(function(){
                if($('#free_play_recaptcha').is(':visible')){
                    freeBitcoinComCaptcha();
                } else {
                    freeBitcoinSemCaptcha();
                }
            },10000);
        }
    });
    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('freebitco-in-auto-roll').classList.add("faucet-active");
    }
})();