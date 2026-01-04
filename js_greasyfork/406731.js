// ==UserScript==
// @name         Freebitco.in Conta Com Captcha (Pescador de Cripto)
// @namespace    https://greasyfork.org/en/users/466691-jadson-tavares
// @version      1.6
// @description  Auto roll
// @author       Jadson Tavares
// @match        *://*.freebitco.in/*
// @match        *://*.pescadordecripto.com/install/
// @match        *://*.pescadordecripto.com/dashboard/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406731/Freebitcoin%20Conta%20Com%20Captcha%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/406731/Freebitcoin%20Conta%20Com%20Captcha%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var count_min = 1;

    function random(min,max){
        return min + (max - min) * Math.random();
    }

    function freeBitcoin() {
        console.log("Status: Page loaded.");
        setInterval(function(){
            if ($('#free_play_form_button').is(':visible')) {
                if(grecaptcha && grecaptcha.getResponse().length > 0) {
                    console.log("Status: reCAPTCHA solved.");
                    $('#free_play_form_button').click();
                    console.log("Status: Button ROLL clicked.");
                    setTimeout(function(){
                        window.close();
                    },1000);
                }
            } else {
                window.close();
            }
            
        }, random(1000,2000));

        setTimeout(function(){
            if($('#free_play_form_button').is(':visible')) {
                console.log("Status: reCAPTCHA not solved.");
                window.history.go(0);
            } else {
                window.close();
            }
        },90000);

        setInterval(function(){
            console.log("Status: Elapsed time " + count_min + " minutes");
            count_min = count_min + 1;
        }, 60000);

        setTimeout(function(){
            $('.close-reveal-modal')[0].click();
            console.log("Status: Button CLOSE POPUP clicked.");
        }, random(31000,33000));

        setInterval(function(){
            if ($('#free_play_form_button').is(':visible')) {
                $('#free_play_form_button').click();
                console.log("Status: Button ROLL clicked again.");
            }
        }, random(3605000,3615000));
    }

    function open(){
        if (window.location.href == "https://pescadordecripto.com/dashboard/") {
            window.open("https://freebitco.in/?op=home", "FreeBitco","width=10,height=10,left=-3000,top=-3000");
        }
        setTimeout(open,3630000);
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href == "https://pescadordecripto.com/dashboard/") {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'freebitco-in-roll-com-captcha';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'FREEBITCO.IN (Conta com captcha)';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }
    if (window.location.href.indexOf("freebitco.in") > -1) {
        freeBitcoin();
    }
    if (window.location.href == "https://pescadordecripto.com/install/") {
        document.getElementById('freebitco-in-roll-com-captcha').classList.add("faucet-active");
    }
})();