// ==UserScript==
// @name         FaucetCrypto.com (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.8
// @description  Auto Claim, PTC ADS, Shortlinks
// @author       Jadson Tavares
// @match        *://*.pescadordecripto.com/install/
// @match        *://*.faucetcrypto.com/*
// @match        *://*.faucet.gold/*
// @match        *://*.claim4.fun/*
// @match        *://*.fc-lc.com/*
// @match        *://*.fcdot.lc/*
// @match        *://*.fcc.lc/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412100/FaucetCryptocom%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/412100/FaucetCryptocom%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function random(min,max){
        return min + (max - min) * Math.random();
    }

    function faucetcrypto(){
        setInterval(function(){
            // Daily Bonus
            if(window.location.href.indexOf('dash/home') > -1 && $('.flex.justify-between').find('button').is(':enabled')){
                $('.flex.justify-between').find('button').click();
            } else {
                if(window.location.href.indexOf('dash/complete-achievement') < 0){
                    // Ready to Claim
                    if($('.truncate.text-primary').is(':visible')){
                        $('.truncate.text-primary').click();

                        if($('#generate-link-btn').is(':visible')){
                            $('#generate-link-btn').click();
                        }
                    } else {
                        // Ptc Ads
                        if($('.con-vs-chip.ml-auto.vs-chip-compact.vs-chip-danger.con-color').is(':visible')){
                            if(window.location.href.indexOf('dash/ptc-ads') < 0){
                                if(window.location.href.indexOf('generate-ptc-link') < 0){
                                    if(window.location.href.indexOf('external/view-ptc') < 0){
                                        if(!$('#generate-link-btn').is(':visible')){
                                            window.location.href = 'https://www.faucetcrypto.com/dash/ptc-ads';
                                        }
                                    }
                                } else {
                                    if($('#generate-link-btn').is(':visible')){
                                        $('#generate-link-btn').click();
                                    }
                                }
                            } else {
                                if($('.flex.justify-between').find('button').is(':enabled')){
                                    $('.flex.justify-between').find('button').each(function(i) {
                                        var btn = $(this);
                                        setTimeout(btn.trigger.bind(btn, "click"), i * 65000);
                                    });
                                }
                            }
                        } else {
                            // Ptc Ads Click Button Continue
                            if(window.location.href.indexOf('external/view-ptc') > -1){
                                if($('.vs-button-text.vs-button--text.text-white').is(':visible')){
                                    $('.vs-button-text.vs-button--text.text-white').click();
                                }
                            } else {
                                // Achievements
                                if($('.con-vs-chip.ml-auto.vs-chip-compact.vs-chip-success.con-color').is(':visible')){
                                    if(window.location.href.indexOf('faucetcrypto.com/dash/achievements') < 0){
                                        if(window.location.href.indexOf('complete-achievement') < 0){
                                            window.location.href = 'https://www.faucetcrypto.com/dash/achievements';
                                        }
                                    } else {
                                        $('.flex.justify-between').find('button').each(function(i) {
                                            var btn = $(this);
                                            if(btn.is(':enabled')){
                                                setTimeout(btn.trigger.bind(btn, "click"), i * 5000);
                                            } else {
                                                $('.vs-tabs--li').find('.vs-tabs--btn').each(function(i) {
                                                    var btn = $(this);
                                                    setTimeout(btn.trigger.bind(btn, "click"), i * 10000);
                                                });
                                            }
                                        });
                                    }
                                } else {
                                    // Shortlinks
                                    if($('.con-vs-chip.ml-auto.vs-chip-compact.vs-chip-warning.con-color').is(':visible')){
                                        if(window.location.href != 'https://www.faucetcrypto.com/dash/shortlinks'){
                                            if(window.location.href.indexOf('generate-link') < 0){
                                                if(!$('#main-button').is(':visible')){
                                                    window.location.href = 'https://www.faucetcrypto.com/dash/shortlinks';
                                                }
                                            } else {
                                                if($('#generate-link-btn').is(':visible')){
                                                    $('#generate-link-btn').click();
                                                }
                                            }
                                        } else {
                                            if($('.vs-component.vs-button.vs-button-primary.vs-button-relief').is(':visible')){
                                                $('.vs-component.vs-button.vs-button-primary.vs-button-relief').each(function(i) {
                                                    var btn = $(this);
                                                    var name = btn.parent().parent().parent().find('td').eq(1).text();
                                                    if(name != 'Exe.io'){
                                                        if(name != 'Clik.pw'){
                                                            if(name != 'Bitcoinly.in'){
                                                                    setTimeout(btn.trigger.bind(btn, "click"), i * 65000);
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    } else {
                                        // Faucet.gold, Claim4.fun
                                        if($('#showTimerText').is(':visible')){
                                            $('#showTimerText').click();
                                        }
                                        // Fc-lc.com
                                        if($('.btn.btn-primary').is(':visible')){
                                            $('.btn.btn-primary').click();
                                        }
                                        // Fcdot.lc
                                        if($('#invisibleCaptchaShortlink').is(':visible')){
                                            if(grecaptcha && grecaptcha.getResponse().length > 0) {
                                                $('#invisibleCaptchaShortlink').click();
                                            }
                                        }
                                        $('#surl').each(function(){
                                            window.location.href = $(this).attr('href');
                                        });
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if($('#generate-link-btn').is(':visible')){
                        $('#generate-link-btn').click();
                    }
                }
            }
        },10000);

        setInterval(function(){
            if($('#main-button').is(':visible')){
                $('#main-button').click();
            }
        },2000);

        setInterval(function(){
            window.location.href = "https://www.faucetcrypto.com/dash/home";
        },random(600000,900000));
    }

    $(document).ready(function(){
        if (window.location.href == "https://pescadordecripto.com/install/") {
            document.getElementById('faucetcrypto-com').classList.add("faucet-active");
        }
        setTimeout(function(){
            console.log('Start script.');
            faucetcrypto();
        },random(20000,60000));
    });
})();