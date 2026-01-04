// ==UserScript==
// @name         FreeChain.link (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.8
// @description  Auto Roll
// @author       Jadson Tavares
// @match        https://freechainlink.io/free*
// @match        https://*.pescadordecripto.com/dashboard/
// @match        https://*.pescadordecripto.com/install/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411459/FreeChainlink%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/411459/FreeChainlink%20%28Pescador%20de%20Cripto%29.meta.js
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

    function freechain_link(){
        setInterval(function(){
            if ($('.roll-wrapper').find('.roll-button').is(':visible')) {
                $('.roll-wrapper').find('.roll-button').click();
            } else {
                if($('.free').find('.result').text().indexOf('0') > -1){
                    $('.withdraw-button.bg-2').click();
                    var str = $('.withdraw').find('.header.bg-3').text();
                    var withdraw = str.substr(str.indexOf(':')+1, 16);
                    $.ajax({
                        url:'https://freechainlink.io/settings',
                        type:'GET',
                        success: function(data){
                            var email = $(data).find('.form-control.email')[0].value;
                            message = "FreeChainLink.io\n- Email: "+ email +"\n- Sucesso: " + $('.free').find('.result').text() + "\n- Sua balança: " + $('.navbar-coins.bg-1').find('a').text() + "\n- Saque mínimo: " + withdraw;
                            ntb(message);
                            setTimeout(function(){
                                window.close();
                                window.history.go(0);
                            },1000);
                        }
                    });
                } else {
                    window.close();
                }
            }
        },random(5000,10000));
        if (window.location.href.indexOf("freechainlink.io/free") > -1) {
            setInterval(function(){
                window.history.go(0);
            },300000);
        }
    }
    function open(){
        if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
            window.open("https://freechainlink.io/free", "FreeChainLink","width=10,height=10,left=-3000,top=-3000");
        }
        setTimeout(open,3630000);
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'freechain-link';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'FREECHAINLINK.IO';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }
    if (window.location.href.indexOf("freechainlink.io/free") > -1) {
        freechain_link();
    }

    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('freechain-link').classList.add("faucet-active");
    }
})();