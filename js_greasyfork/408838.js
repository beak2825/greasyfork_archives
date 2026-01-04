// ==UserScript==
// @name         EveDOGE.xyz (Pescador de Cripto)
// @namespace    https://greasyfork.org/en/users/466691-jadson-tavares
// @version      0.7
// @description  Coleta a recompensa de hora em hora
// @author       Jadson Tavares
// @match        *://evedoge.xyz/?a=roll*
// @match        https://*.pescadordecripto.com/dashboard/
// @match        https://*.pescadordecripto.com/install/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408838/EveDOGExyz%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408838/EveDOGExyz%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function random(min,max){
        return min + (max - min) * Math.random();
    }

    function evebch(){
        setInterval(function(){
            if ($('#rf').find('.bts').is(':visible')) {
                document.getElementsByClassName('bts')[2].click();
            } else {
                window.close();
            }
        },random(5000,10000));
        if (window.location.href.indexOf("evedoge.xyz/?a=roll") > -1) {
            setInterval(function(){
                window.history.go(0);
            },300000);
        }
    }

    function open(){
        if (window.location.href == "https://pescadordecripto.com/dashboard/") {
            window.open("https://evedoge.xyz/?a=roll", "EveDOGE","width=10,height=10,left=-3000,top=-3000");
        }
        setTimeout(open,3630000);
    }
    setTimeout(open,random(1000,900000));
    if (window.location.href == "https://pescadordecripto.com/dashboard/") {
        var div = document.createElement('div');
        div.className = 'faucet';

        var a = document.createElement('a');
        a.id = 'evedoge-xyz';
        a.className = 'faucet-link faucet-active';
        a.innerHTML = 'EVEDOGE.XYZ';

        div.appendChild(a);
        document.getElementById('faucets-ativadas').appendChild(div);
    }
    if (window.location.href.indexOf("evedoge.xyz/?a=roll") > -1) {
        evebch();
    }

    if (window.location.href == "https://pescadordecripto.com/install/") {
        document.getElementById('evedoge-xyz').classList.add("faucet-active");
    }
})();