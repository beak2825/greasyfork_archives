// ==UserScript==
// @name         WME Land of the Pure Timer
// @namespace    Dude495
// @version      2019.04.03.02
// @description  Adds count down timer for the Land of the Pure (Pakistan) WoW
// @author       Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378295/WME%20Land%20of%20the%20Pure%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/378295/WME%20Land%20of%20the%20Pure%20Timer.meta.js
// ==/UserScript==
//Some code based off PA MapRaid Countdown Timer by MoM

(function() {
    'use strict';
    function startClock() {
        const ProjStatus = 'true' //'true' means raid is in progress, 'false' means the raid hasnt started.
        var PHASE = 'Land of the Pure'
        var phaseTime = new Date('apr 03, 2019 23:59:59 UTC').getTime();
        var now = new Date().getTime();
        var time = phaseTime - now;
        var weeks = Math.floor(time / 604800000);
        var days = Math.floor(time%(604800000)/86400000);
        var hours = Math.floor((time%(86400000))/3600000);
        var minutes = Math.floor((time % (3600000)) / 60000);
        var seconds = Math.floor((time % (60000)) / 1000);
        var div = [];
        if (ProjStatus == 'true') {
            if (time > 86400001) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'lime'});
            }
            if ((time < 86400000) && (time > 0)) {
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
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW begins in ' + weeks + 'w ' + days + 'd ' + hours + 'h ' + minutes + 'm ';
            }
            else if ((time < 604800000) && (time >= 18000001)) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW begins in ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
            else if ((time <= 18000000) && (time >= 1)) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW begins in ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
            else if (time < 0) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW has started, Happy Editing!';
            }
        }
        if (ProjStatus == 'true') {
            if (time > 604800000) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW ends in ' + weeks + 'w ' + days + 'd ' + hours + 'h ' + minutes + 'm ';
            }
            else if ((time < 604800000) && (time >= 86400001)) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW ends in ' + days + 'd ' + hours + 'h ' + minutes + 'm ';
            }
            else if ((time <= 86400000) && (time >= 18000001)) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW ends in ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
            else if ((time <= 18000000) && (time > 0)) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW ends in ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
            else if (time < 0) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' WoW has ended! <br> Thank you for all your efforts!';
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
