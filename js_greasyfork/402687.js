// ==UserScript==
// @name         Freedogeon.com (Pescador de Cripto)
// @namespace    https://greasyfork.org/en/users/466691-jadson-tavares
// @version      2.2
// @description  Auto Roll.
// @author       Jadson Tavares
// @match        *://*.freedogeon.com/free-drop
// @match        *://*.freedogeon.com/free-doge
// @match        *://*.pescadordecripto.com/install/
// @match        *://*.pescadordecripto.com/dashboard/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402687/Freedogeoncom%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402687/Freedogeoncom%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function random(min,max){
        return min + (max - min) * Math.random();
    }

    function freeDogeon() {
        setInterval(function(){
            if ($('.free_play_element').eq(1).is(':visible')) {
                if(grecaptcha && grecaptcha.getResponse().length > 0) {
                    $('.free_play_element').eq(1).click();
                } else {
                    setTimeout(function(){
                        if ($('.free_play_element').eq(1).is(':visible')) {
                            $('.free_play_element').eq(1).click();
                        }
                    },20000);
                }
            } else {
                setTimeout(function(){
                    window.close();
                },25000);
            }
        },1000);

        setTimeout(function(){
            if ($('.free_play_element').eq(1).is(':visible')) {
                console.log("Status: reCAPTCHA not solved.");
                window.history.go(0);
            } else {
                window.close();
            }
        },30000);

        setInterval(function(){
            if ($('.free_play_element').eq(1).is(':visible')) {
                window.history.go(0);
            }
        },60000);
    }

    function open(){
        if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
            window.open("https://freedogeon.com/free-drop", "FreeDogeon","width=10,height=10,left=-3000,top=-3000");
        }
        setTimeout(open,3660000);
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href.indexOf("pescadordecripto.com/dashboard") > -1) {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'freedogeon-com';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'FREEDOGEON.COM';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }
    $(document).ready(function(){
        if (window.location.href.indexOf("freedogeon.com/free-drop") > -1) {
            freeDogeon();
        }
        if (window.location.href.indexOf("freedogeon.com/free-doge") > -1) {
            freeDogeon();
        }
    });
    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('freedogeon-com').classList.add("faucet-active");
    }
})();