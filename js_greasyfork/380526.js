// ==UserScript==
// @name         WME MapRaid Timer
// @namespace    https://greasyfork.org/es/scripts/380526-wme-mapraid-timer
// @version      2019.05.26.02
// @description  Agrega temporizador de cuenta regresiva para MapRaid Colombia
// @author       Walter-Bravo
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380526/WME%20MapRaid%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/380526/WME%20MapRaid%20Timer.meta.js
// ==/UserScript==
//Some code based off PA MapRaid Countdown Timer by MoM

(function() {
    'use strict';
    function startClock() {
        const ProjStatus = 'false' //'true' means raid is in progress, 'false' means the raid hasnt started.
        var PHASE = 'MapRaid Colombia'
        var phaseTime = new Date('may 26, 2019 20:00:00 UTC').getTime();
        var now = new Date().getTime();
        var time = phaseTime - now;
        var weeks = Math.floor(time / 604800000);
        var days = Math.floor(time%(604800000)/86400000);
        var hours = Math.floor((time%(86400000))/3600000);
        var minutes = Math.floor((time % (3600000)) / 60000);
        var seconds = Math.floor((time % (60000)) / 1000);
        var div = [];
        if (ProjStatus == 'false') {
            if (time > 18000001) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'red'});
            };
            if ((time < 18000000) && (time > 0)) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'yellow'});
            };
            if (time < 0) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'lime'});
            };
        };
        if ($('#countdown-timer').length <= 0) {
            div;
            $('#user-box').after(div);
            $('#user-profile').css('margin-bottom','5px');
        }
        $('#user-box').css('padding-bottom','5px');
        if (ProjStatus == 'false') {
            document.getElementById('countdown-timer').innerHTML = 'El ' + PHASE + ' 2019 Comienza en ' + weeks + 's ' + days + 'd ' + hours + 'h ' + minutes + 'm ';
            if((time < 604800000) && (time >= 18000001)) {
                document.getElementById('countdown-timer').innerHTML = 'El ' + PHASE + ' 2019 Comienza en ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            };
                if (time < 0) {
                document.getElementById('countdown-timer').innerHTML = 'El ' + PHASE + ' 2019 a Iniciado, Felices Ediciones!';
            };
        };
        if (ProjStatus == 'true') {
            document.getElementById('countdown-timer').innerHTML = 'El ' + PHASE + ' 2019 Termina en ' + weeks + 's ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            if((time < 604800000) && (time >= 18000001)) {
                document.getElementById('countdown-timer').innerHTML = 'El ' + PHASE + ' 2019 Termina en ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            };
            if ((time <= 18000000) && (time > 0)) {
                document.getElementById('countdown-timer').innerHTML = 'El ' + PHASE + ' 2019 Termina en ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            };
            if (time < 0) {
                document.getElementById('countdown-timer').innerHTML = 'El ' + PHASE + ' 2019 a Terminado! <br> Gracias por todos sus Esfuerzos!';
            };
        };
    };

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
