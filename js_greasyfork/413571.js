// ==UserScript==
// @name         CloudFaucet.io - DOGE (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.5
// @description  Auto Claim. Obs.: Instalar apenas de uma criptomoeda.
// @author       Jadson Tavares
// @match        *://*.cloudfaucet.io/*
// @match        *://*.pescadordecripto.com/install/
// @match        *://*.pescadordecripto.com/dashboard/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413571/CloudFaucetio%20-%20DOGE%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/413571/CloudFaucetio%20-%20DOGE%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////// CONFIGURAÇÃO NOTIFICAÇÃO TELEGRAM //////
    var telegram_bot_token = ""; // TOKEN DO BOT
    var chat_id = ""; // ID DO SEU CHAT
    var message;
    var balance;
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

    function checkRoll(){
        if ($('#waiting-button').is(':visible')) {
            setTimeout(function(){
                if($('#collect-button').is(':visible')){
                    window.history.go(0);
                } else {
                    setTimeout(function(){
                        window.close();
                    },10000);
                    return;
                }
            },2000);
        }

        if($('.jconfirm-content').find('div').text().indexOf('0') > -1){
            $.ajax({
                url:'https://cloudfaucet.io/dashboard',
                type:'GET',
                success: function(data){
                    balance = $(data).find('.dashboard-value').eq(2).text();
                    console.log(balance);
                }
            });
            setTimeout(function(){
                message = "CloudFaucet.io\n- Sucesso: " + $('.jconfirm-content').find('div').text() + "\n- Sua balança: " + balance + "DOGE";
                ntb(message);
                setTimeout(function(){
                    window.close();
                    window.history.go(0);
                },1000);
            },5000);
        }
        setTimeout(checkRoll,1000);
    }

    function cloudFaucet(){
        setTimeout(function(){
            if($('.dogecoin-faucet-button.deactive.tipso_style').attr('class').indexOf('deactive')){
                $('.dogecoin-faucet-button.deactive.tipso_style').click();

                setTimeout(function(){
                    if($('#collect-button').is(':visible')){
                        $('#collect-button').click();

                        setTimeout(function(){
                            $('.btn.btn-default').click();
                        },5000);
                    }

                    setTimeout(function(){
                        if($('#collect-button').is(':visible')){
                            window.history.go(0);
                        }
                    },30000);

                    setTimeout(function(){
                        window.history.go(0);
                    },2760000);
                },5000);
            }
        },5000);

        setTimeout(function(){
            checkRoll();
        },1000);

        setTimeout(function(){
            window.history.go(0);
        },600000);
    }

    function open(){
        if (window.location.href == "https://pescadordecripto.com/dashboard/") {
            var win_cloudfaucet = window.open("https://cloudfaucet.io/faucet", "CloudFaucetDoge","width=10,height=10,left=-3000,top=-3000");
        }
        setTimeout(open,300000);
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href == "https://pescadordecripto.com/dashboard/") {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'cloudfaucet-io-doge';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'CLOUDFAUCET.IO - DOGE';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }

    $(document).ready(function(){
        if (window.location.href.indexOf("cloudfaucet.io/faucet") > -1) {
            cloudFaucet();
        }
    });

    if (window.location.href == "https://pescadordecripto.com/install/") {
        document.getElementById('cloudfaucet-io-doge').classList.add("faucet-active");
    }
})();