// ==UserScript==
// @name         ClaimBTC.io (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.1
// @description  Auto Roll
// @author       Jadson Tavares
// @match        *://claimbtc.io/
// @match        *://claimbtc.io/free.php
// @match        *://*.pescadordecripto.com/install/
// @match        *://*.pescadordecripto.com/dashboard/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411842/ClaimBTCio%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/411842/ClaimBTCio%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function random(min,max){
        return min + (max - min) * Math.random();
    }

    function claimbtc(){
        if($('.collect_content').find('.claim').is(':enabled')){
            $('.collect_content').find('.claim').click();
        }

        setInterval(function(){
            if(grecaptcha && grecaptcha.getResponse().length > 0) {
                setTimeout(function(){
                    window.close();
                },10000);
            } else {
                return;
            }
        },1000);

        setInterval(function(){
            if ($('.collect_content').find('.claim').is(':disabled')) {
                setInterval(function(){
                    if ($('.collect_content').find('.claim').is(':enabled')) {
                        window.history.go(0);
                    } else {
                        window.close();
                        return;
                    }
                },2000);
            }
        },1000);

        setTimeout(function(){
            if($('.modal_box').find('.modal_title').is(':visible')){
                window.history.go(0);
            } else {
                return;
            }
        },20000);
    }

    function open(){
        if (window.location.href == "https://pescadordecripto.com/dashboard/") {
            window.open("https://claimbtc.io/free.php", "ClaimBTC","width=10,height=10,left=-3000,top=-3000");
        }
        setTimeout(open,3630000);
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href == "https://pescadordecripto.com/dashboard/") {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'claimbtc.io';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'CLAIMBTC.IO';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }
    if (window.location.href.indexOf("claimbtc.io") > -1) {
        setTimeout(function(){
            claimbtc();
        },10000);
    }

    if (window.location.href == "https://pescadordecripto.com/install/") {
        document.getElementById('claimbtc.io').classList.add("faucet-active");
    }
})();