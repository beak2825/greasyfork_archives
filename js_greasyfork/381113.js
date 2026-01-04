// ==UserScript==
// @name         WME Tiempo Regresivo
// @namespace    https://greasyfork.org/es/scripts/381113-wme-tiempo-regresivo
// @version      2019.04.08.04
// @description  Agrega temporizador de cuenta regresiva para MapRaid Colombia
// @author       Walter-Bravo
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381113/WME%20Tiempo%20Regresivo.user.js
// @updateURL https://update.greasyfork.org/scripts/381113/WME%20Tiempo%20Regresivo.meta.js
// ==/UserScript==
//Some code based off PA MapRaid Countdown Timer by MoM

(function() {
    'use strict';
    function startClock() {
        const ProjStatus = 'true' //'true' means raid is in progress, 'false' means the raid hasnt started.
        var PHASE = 'MapRaid Colombia'
        var phaseTime = new Date('apr 15, 2019 04:59:59 UTC').getTime();
        var now = new Date().getTime();
        var time = phaseTime - now;
        var weeks = Math.floor(time / 604800000);
        var days = Math.floor(time%(604800000)/86400000);
        var hours = Math.floor((time%(86400000))/3600000);
        var minutes = Math.floor((time % (3600000)) / 60000);
        var seconds = Math.floor((time % (60000)) / 1000);
        var div = [];
        if (ProjStatus == 'true') {
            if (time > 18000001) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'lime'});
            }
            if ((time < 18000000) && (time > 0)) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'yellow'});
            }
            if (time < 0) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'red'});
            }
        }
        if ($('#countdown-timer').length <= 0) {
            div;
            $('#user-box').after(div);
            $('#user-profile').css('margin-bottom','5px');
        }
        $('#user-box').css('padding-bottom','5px');
        if (ProjStatus == 'false') {
            if (time > 604800000) {
                document.getElementById('countdown-timer').innerHTML = 'El ' + PHASE + ' Caribe 2019 Comienza en ' + weeks + 'w ' + days + 'd ' + hours + 'h ' + minutes + 'm ';
            }
            else if ((time < 604800000) && (time >= 18000001)) {
                document.getElementById('countdown-timer').innerHTML = 'El ' + PHASE + ' Caribe 2019 Comienza en ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
            else if ((time <= 18000000) && (time >= 1)) {
                document.getElementById('countdown-timer').innerHTML = 'El ' + PHASE + ' Caribe 2019 Comienza en ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
            else if (time < 0) {
                document.getElementById('countdown-timer').innerHTML = 'El ' + PHASE + ' Caribe 2019 a Iniciado, Felices Ediciones!';
            }
        }
        if (ProjStatus == 'true') {
            if (time > 604800000) {
                document.getElementById('countdown-timer').innerHTML = 'El ' + PHASE + ' Caribe 2019 Termina en ' + weeks + 'w ' + days + 'd ' + hours + 'h ' + minutes + 'm ';
            }
            else if ((time < 604800000) && (time >= 18000001)) {
                document.getElementById('countdown-timer').innerHTML = 'El ' + PHASE + ' Caribe 2019 Termina en ' + days + 'd ' + hours + 'h ' + minutes + 'm ';
            }
            else if ((time <= 18000000) && (time > 0)) {
                document.getElementById('countdown-timer').innerHTML = 'El ' + PHASE + ' Caribe 2019 Termina en ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
            else if (time < 0) {
                document.getElementById('countdown-timer').innerHTML = 'El ' + PHASE + ' Caribe 2019 a Terminado! <br> Gracias por todos sus Esfuerzos!';
            }
        }
    }
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.isLoggedIn()) {
            setInterval(startClock, 1000);
            console.log(GM_info.script.name, 'Initialized');
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }
    bootstrap();
})();
