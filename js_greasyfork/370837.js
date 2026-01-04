// ==UserScript==
// @name         WME NY UR Project Timer
// @namespace    Dude495
// @version      2019.06.18.001
// @description  Adds count down timer for the NY UR Project.
// @author       Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
/* global W */
/* global $ */
/* global I18n */
/* global WazeWrap */
// @downloadURL https://update.greasyfork.org/scripts/370837/WME%20NY%20UR%20Project%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/370837/WME%20NY%20UR%20Project%20Timer.meta.js
// ==/UserScript==
//Some code based off PA MapRaid Countdown Timer by MoM

(function() {
    'use strict';
    let phase = [];
    function startClock() {
        let entry = getTimerData(phase);
        let PHASE = entry.phase
        let phaseTime = new Date(entry.date).getTime();
        let now = new Date().getTime();
        let time = phaseTime - now;
        let weeks = Math.floor(time / 604800000);
        let days = Math.floor(time%(604800000)/86400000);
        let hours = Math.floor((time%(86400000))/3600000);
        let minutes = Math.floor((time % (3600000)) / 60000);
        let seconds = Math.floor((time % (60000)) / 1000);
        var div = [];
        if (entry.status == 'ACTIVE') {
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
        else {
            if (time > 18000001) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'red'});
            }
            if ((time < 18000000) && (time > 0)) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'yellow'});
            }
            if (time <= 0) {
                div = $('<div>', {id: 'countdown-timer'}).css({marginBottom:'3px', paddingLeft:'2px', textAlign:'center', fontWeight:'600', background: 'green'});
            }
        }
        if ($('#countdown-timer').length <= 0) {
            div;
            $('#user-box').after(div);
            $('#user-profile').css('margin-bottom','5px');
        }
        $('#user-box').css('padding-bottom','5px');
        if (entry.status == 'INACTIVE') {
            if (time => 604800000) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' phase begins in '+ weeks + 'w ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
            if (time < 604800000) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' phase begins in ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
                //debugger;
            }
            if (time < 0) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' phase has started, Happy Editing!';
            }
        }
        if (entry.status == 'ACTIVE') {
            document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' phase ends in ' + weeks + 'w ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            if((time < 604800000) && (time >= 18000001)) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' phase ends in ' + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
            if ((time <= 18000000) && (time > 0)) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' phase ends in ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
            }
            if (time < 0) {
                document.getElementById('countdown-timer').innerHTML = 'The ' + PHASE + ' phase has ended! <br> Thank you for all your efforts!';
            }
        }
    }
    var Timer = [];
    var URL = 'https://sheets.googleapis.com/v4/spreadsheets/1T6ByV5NzQ6GwqiUW6i2JgeE2cBTz9KSjRKN69Ng1zfo/values/data';
    var u8Er = 'QUl6YVN5Q0Jza1RKMnZJN0NXRG9rMFZncUUwX3ByRDNoMjBkcEFn';
    async function loadProjectData() {
        console.log('NY UR Project: Loading Timer Data....');
        var SHEET = URL +'/?key='+atob(u8Er);
        await $.getJSON(SHEET, function(ldata){
            Timer = ldata;
            console.log('NY UR Project: Timer Data Loaded....');
        });
    }
    function getTimerData(Phase) {
        let TimerData = Timer.values.map(obj =>{
            return {phase: obj[0], date: obj[1], status: obj[2]}
        });
        for(let i=0; i<TimerData.length; i++){
            return TimerData[i];
        }
        return null;
    }
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.isLoggedIn()) {
            loadProjectData();
            setTimeout(setInterval(startClock, 1000), 5000);
            console.log(GM_info.script.name, 'Initialized');
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }
    bootstrap();
})();
