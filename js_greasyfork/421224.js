// ==UserScript==
// @name         Yenten-Pool.info (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.1
// @description  Roll infinito...
// @author       Jadson Tavares
// @match        *://*.yenten-pool.info/faucet/*
// @match        *://*.pescadordecripto.com/install/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421224/Yenten-Poolinfo%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/421224/Yenten-Poolinfo%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var carteira = ""; //COLE SUA CARTEIRA DE YENTEN DA CREX24 ENTRE AS ASPAS

    var startInterval = setInterval(start,2000);

    function start(){
        $('#faucet').find('.form-group').find('input').val(carteira);
        if(grecaptcha && grecaptcha.getResponse().length > 0) {
            if(!$('#exampleModalCenter').is(':visible')){
                if($('#faucet').find('.form-group').find('input').val().length != 0){
                    $('#faucet').find('button')[0].click();
                }
            } else {
                $('#exampleModalCenter').find('div').eq(0).find('div').eq(0).find('div').eq(1).find('div').eq(0).find('button').click();
                clearInterval(startInterval);
            }
        }
    }

    setInterval(function(){
        if($('#error').find('div').is(':visible')){
            window.history.go(0);
        }
    },2000);

    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('yenten-pool-info').classList.add("faucet-active");
    }
})();