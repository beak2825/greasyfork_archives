// ==UserScript==
// @name         QuantoFaltaProVest
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Contador com quanto falta pro seu vestibular dos sonhos que você não vai passar mas gosta de se iludir pensando que colocando essa merda vai fazer você ficar motivado quando na realidade te falta uma boa surra de pau mole
// @author       snipa
// @include      *
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/381039/QuantoFaltaProVest.user.js
// @updateURL https://update.greasyfork.org/scripts/381039/QuantoFaltaProVest.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // pre-run
    var dataVestibular = new Date('Nov 11, 2019 13:00:00').getTime();
    var dataHoje = new Date().getTime();
    var diferenca = dataVestibular - dataHoje;

    var dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    var horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    var segundos = Math.floor((diferenca % (1000 * 60)) / 1000);
    var total = dias + " dias " + horas + " horas " + minutos + " minutos " + segundos + " segundos ";

    var contagem = '<div class="deus" style="all: initial; * {all: unset;} border-width: 3px; background-color: #cae8ca; border-style: solid; border-color: #336600; position: fixed; padding: 7px; bottom: 0; right: 0; max-width: 450px; z-index: 999; font-size: 20px; pointer-events: none;"><div id="cron">'+total+'</div></div>';

    $('body').append(contagem);

    var intervalo;

    function cron() {
        var dataVestibular = new Date('Nov 11, 2019 13:00:00').getTime();

        intervalo = setInterval(function() {
            var dataHoje = new Date().getTime();

            var diferenca = dataVestibular - dataHoje;

            var x = 1000 * 60 * 60 * 24;

            var dias = Math.floor(diferenca / x);
            var horas = Math.floor((diferenca % x) / (1000 * 60 * 60));
            var minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
            var segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

            document.getElementById("cron").innerHTML = dias + " dias " + horas + " horas " + minutos + " minutos " + segundos + " segundos ";

            if (diferenca < 0) {
                clearInterval(intervalo);
                document.getElementById("cron").innerHTML = "É HOJE";
            }
        }, 1000);
    }

    cron();

    // Verificar hora
    var hora = new Date().getHours();
    if (hora == 23 || hora <= 5){
        $('body').html("<div style='font-size: 120px; margin: 20px; text-align: center; margin-top: 400px'>já deu por hoje, vai dormir vagabundo</div>");
    }

    // Bloquear sites
    var blacklist = ['instagram', 'facebook'];
    var url = window.location.href;
    blacklist.forEach(function(i){
        if (url.match(i)){
           $('body').html("<div style='font-size: 120px; margin: 20px; text-align: center; margin-top: 400px'>vai tomar no seu cu na moral</div>");
        }
    });
})();