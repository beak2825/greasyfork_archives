// ==UserScript==
// @name         Uulotto.com (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.5
// @description  Auto Roll
// @author       Jadson Tavares
// @match        *://*.uulotto.com/*
// @match        *://*.pescadordecripto.com/install/
// @match        *://*.pescadordecripto.com/dashboard/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410986/Uulottocom%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/410986/Uulottocom%20%28Pescador%20de%20Cripto%29.meta.js
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

    function uulotto(){
        console.log('Start script.');
        setInterval(function(){
            if(!$('#countdown').is(':visible')){
                $('.btn.btn_roll').click();
            } else {
                setTimeout(function(){
                    window.close();
                },10000);
            }
        },1000);

        setInterval(function(){
            if(grecaptcha && grecaptcha.getResponse().length > 0) {
                setTimeout(function(){
                    window.close();
                },10000);
            } else {
                return;
            }

            if($('#success_tips').is(':visible')){
                $.ajax({
                    url:'https://www.uulotto.com/myaccount/withdraw.html',
                    type:'GET',
                    success: function(data){
                        var str = $(data).find('.desc').find('p').eq(0).text();
                        withdraw = str.substr(str.indexOf('0')-1, 15);
                        console.log(withdraw);
                    }
                });
                setTimeout(function(){
                    message = "Uulotto.com\n- Sucesso: " + $('#success_tips').text() + "\n- Sua balança: " + $('#userAsset_header').text() + "\n- Saque mínimo: " + withdraw;
                    ntb(message);
                    setTimeout(function(){
                        window.close();
                        window.history.go(0);
                    },1000);
                },5000);
            }
        },2000);

        setInterval(function(){
            if ($('#countdown').is(':visible')) {
                setInterval(function(){
                    if (!$('#countdown').is(':visible')) {
                        window.history.go(0);
                    } else {
                        setTimeout(function(){
                            window.close();
                        },10000);
                        return;
                    }
                },2000);
            }
        },1000);

        setTimeout(function(){
            if($('.pop-cont-box').is(':visible')){
                window.history.go(0);
            } else {
                return;
            }
        },20000);

        setInterval(function(){
            window.history.go(0);
        },600000);
    }

    function open(){
        if (window.location.href == "https://pescadordecripto.com/dashboard/") {
            window.open("https://www.uulotto.com/freebitcoin.html", "Uulotto","width=10,height=10,left=-3000,top=-3000");
        }
        setTimeout(open,300000);
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href == "https://pescadordecripto.com/dashboard/") {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'uulotto-com';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'UULOTTO.COM';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }

    $(document).ready(function(){
        setTimeout(function(){
            uulotto();
        },5000);
    });

    if (window.location.href == "https://pescadordecripto.com/install/") {
        document.getElementById('uulotto-com').classList.add("faucet-active");
    }
})();