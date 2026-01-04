// ==UserScript==
// @name         ES.btcnewz.com (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.1
// @description  Faz o roll.
// @author       Jadson Tavares
// @match        *://*.es.btcnewz.com/user/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421267/ESbtcnewzcom%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/421267/ESbtcnewzcom%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function goto(url){
        window.location.href = url;
    }

    function setfaucet(){
        if(window.location.href.indexOf('faucet/2') > -1 && window.location.href.indexOf('faucet/20') < 0 && window.location.href.indexOf('faucet/21') < 0){
            goto($('.btn.btn-m.col-xs-offset-8.col-xs-2').attr('href'));
        } else if(window.location.href.indexOf('faucet/3') > -1){
            goto($('.btn.btn-m.col-xs-offset-8.col-xs-2').attr('href'));
        } else if(window.location.href.indexOf('faucet/4') > -1){
            goto($('.btn.btn-m.col-xs-offset-8.col-xs-2').attr('href'));
        } else if(window.location.href.indexOf('faucet/6') > -1){
           goto($('.btn.btn-m.col-xs-offset-8.col-xs-2').attr('href'));
        } else if(window.location.href.indexOf('faucet/7') > -1){
            goto($('.btn.btn-m.col-xs-offset-8.col-xs-2').attr('href'));
        } else if(window.location.href.indexOf('faucet/8') > -1){
            goto($('.btn.btn-m.col-xs-offset-8.col-xs-2').attr('href'));
        } else if(window.location.href.indexOf('faucet/11') > -1){
            goto($('.btn.btn-m.col-xs-offset-8.col-xs-2').attr('href'));
        } else if(window.location.href.indexOf('faucet/12') > -1){
            goto($('.btn.btn-m.col-xs-offset-8.col-xs-2').attr('href'));
        } else if(window.location.href.indexOf('faucet/13') > -1){
            goto($('.btn.btn-m.col-xs-offset-8.col-xs-2').attr('href'));
        } else if(window.location.href.indexOf('faucet/15') > -1){
            goto($('.btn.btn-m.col-xs-offset-8.col-xs-2').attr('href'));
        } else if(window.location.href.indexOf('faucet/16') > -1){
            goto($('.btn.btn-m.col-xs-offset-8.col-xs-2').attr('href'));
        } else if(window.location.href.indexOf('faucet/18') > -1){
            goto($('.btn.btn-m.col-xs-offset-8.col-xs-2').attr('href'));
        } else if(window.location.href.indexOf('faucet/19') > -1){
            goto($('.btn.btn-m.col-xs-offset-8.col-xs-2').attr('href'));
        } else if(window.location.href.indexOf('faucet/20') > -1){
            goto($('.btn.btn-m.col-xs-offset-8.col-xs-2').attr('href'));
        } else if(window.location.href.indexOf('faucet/21') > -1){
            goto('https://es.btcnewz.com/user/faucet/2');
        }
    }

    function roll(){
        var roll = setInterval(function(){
            if($('#timerPlace').is(':visible')){
                var text = $('#timerPlace').text();
                var hour = parseInt(text.split(":")[0]);
                var min = parseInt(text.split(":")[1]);
                if(min > 30 || hour > 0){
                    clearInterval(roll);
                    $('.btn.btn-link.m-b-5.save').click();
                    var checkCaptcha = setInterval(function(){
                        if(grecaptcha && grecaptcha.getResponse().length > 0) {
                            $('#switchCaptcha').next().next().find('div').eq(1).find('button').click();
                            setfaucet();
                        }
                    },2000);
                } else {
                    setfaucet();
                }
            }
            if($('.text-center').text().indexOf('This Faucet Will Unlock At ES-XP Level') > -1){
                setfaucet();
            }
        },1000)
    }

    function esfaucet(){
        if(window.location.href.indexOf('user/home') > -1){
            window.location.href = 'faucet/2';
        }
        if(window.location.href.indexOf('faucet/') > -1){
            roll();
        }
    }

    esfaucet();
    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('es-btcnewz-com').classList.add("faucet-active");
    }
})();