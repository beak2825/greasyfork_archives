// ==UserScript==
// @name         Free-Litecoin.com (Pescador de Cripto)
// @namespace    https://greasyfork.org/en/users/466691-jadson-tavares
// @version      1.7
// @description  Auto Roll.
// @author       Jadson Tavares
// @match        *://*.free-litecoin.com/*
// @match        *://*.pescadordecripto.com/install/
// @match        *://*.pescadordecripto.com/dashboard/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406765/Free-Litecoincom%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/406765/Free-Litecoincom%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////// CONFIGURAÇÃO NOTIFICAÇÃO TELEGRAM //////
    var telegram_bot_token = ""; // TOKEN DO BOT
    var chat_id = ""; // ID DO SEU CHAT
    var message;
    var withdraw;
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

    function free_litecoin(){
        console.log("Status: Page loaded.");
        setInterval(function(){
            if(grecaptcha && grecaptcha.getResponse().length > 0) {
                console.log("Status: reCAPTCHA solved.");
                if ($('#roll').is(':visible')) {
                    $('#roll').trigger('click');
                    console.log("Status: Button ROLL clicked.");

                    setTimeout(function(){
                        window.close();
                    },5000);
                } else {
                    console.log("Status: Button ROLL not visible.");
                    window.history.go(0);
                }
            }
            if($('#info').text().indexOf('0') > -1){
                $.ajax({
                    url:'https://free-litecoin.com/withdraw',
                    type:'GET',
                    success: function(data){
                        var str = $(data).find('.text-center').find('h4').eq(1).text();
                        var str2 = $(data).find('.text-center').find('h4').eq(2).text();
                        withdraw = parseFloat(str.substr(str.indexOf(':')+2, 10)) + parseFloat(str2.substr(str2.indexOf(':')+2, 10)) + " LTC";
                        console.log(withdraw);
                    }
                });
                message = "Free-Litecoin.com\n- Sucesso: " + $('#info').text() + "\n- Sua balança: " + $('#money').text() + " LTC\n- Saque mínimo: " + withdraw;
                ntb(message);
                setTimeout(function(){
                    window.close();
                    window.history.go(0);
                },1000);
            }
        }, 2000);

        setTimeout(function(){
            if($('#roll').is(':visible')) {
                console.log("Status: reCAPTCHA not solved.");
                window.history.go(0);
            } else {
                window.close();
            }
        },30000);
    }

    function open(){
        if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
            window.open("https://free-litecoin.com/", "Free-Litecoin","width=10,height=10,left=-3000,top=-3000");
        }
        setTimeout(open,3660000);
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'freelitecoin-com';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'FREE-LITECOIN.COM';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }
    $(document).ready(function(){
        if (window.location.href.indexOf("free-litecoin.com") > -1) {
            free_litecoin();
        }
    });
    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('freelitecoin-com').classList.add("faucet-active");
    }
})();