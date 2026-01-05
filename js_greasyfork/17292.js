// ==UserScript==
// @name         TIME VULCUN LOOT DROP -  DIMIZB
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  EN: Timer drops, Only Timer. ES: Bot que te dice el tiempo que falta para el próximo drop.
// @author       DimiZb
// @match        https://vulcun.com/user/lobby*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17292/TIME%20VULCUN%20LOOT%20DROP%20-%20%20DIMIZB.user.js
// @updateURL https://update.greasyfork.org/scripts/17292/TIME%20VULCUN%20LOOT%20DROP%20-%20%20DIMIZB.meta.js
// ==/UserScript==
/* DimiZb */
/**
 * Copyright (c) 2015-2016 Dimitri ZB. All rights reserved. Do not copy and redistribute this without permission. Free for personal use only.
 *
 * v2 is here!
 *
 * Hello dear Vulcunians,
 * 
 * 
 * Helps with the coding sessions. (Paypal: zbdimi@gmail.com)
 *
 * 
 * 
 *
 * 
 * 
 * 
 *
 * 
 * 
 * 1. Instlar el addon.
 * 2. Abri pagina de vulcun y saldra una tabla.
 * 3. Abrir streaming que menos tiempo tenga y esperar a que salte el drop y darle.
 * 4. 
 *
 * 5. Will also refresh the stream list every 10 minutes
 *
 * 
 *
 * PS: Use the Feedback forum if you have problems.
 */

'use strict';

var REFRESH_STREAMS_INTERVAL = 10 * 60 * 1000; // refresh the streams list after 10 minutes

var MSG_TWITCH_PLAYER_HIDDEN = "Twitch player is hidden / Twitch player oculto.";

var firebase;
var eta=0;
var streams;
var contests = {};
var localTimeDelay = 0;

function scan() {
    document.title = "Vulcun TIMER Drops v2 : Scanning...";
    streams = $('#vu-game-listing-ongoing .vu-channel-tab');
    var noOfStreams = streams.length;
    if(noOfStreams <= 0) {
        location.reload();
    }

    adjustLocalTime();

    console.info(new Date() + " Begin cycling through "+noOfStreams+" streams...");

    $(CON).append(
        '<div class="panel panel-default" style="border: 1px solid; color: #333">'+
        '<div class="panel-heading">'+
        '<span >Vulcun Timer Drops (ES: Solo pone el tiempo que falta para el drop).</span>'+
        '<span class="badge" style="float:right; background-color: #124585; border: 1px solid; ">Donate Paypal: zbdimi@gmail.com</span>'+
        '<span class="badge" style="float:right; background-color: white; color: #124585; border: 1px solid;">◔ ◡ ◔</span>'+
        '<span class="badge" style="float:right; background-color: white; color: #124585; border: 1px solid;">Getting items ?</span>'+
        '</div>'+
        '<div class="panel-body">'+
        '<ul class="list-group" id="loot-streams"><li style="border-bottom: 0px; margin-bottom: 5px; color: black;" class="list-group-item">Streams list, with timers! how cool is that :) </li></ul>'+
        '</div></div>');

    for (var i = 0; i < noOfStreams; i++) {
        setTimeout(function (i) {
            //console.log('i='+i);
            var stream = streams[i];
            var uniqueId = $(stream).attr('data-league');
            var channelName = $("div[data-league='" + uniqueId + "'] .indexVideoPanelTitle").text();
            firebase = new Firebase("https://lootdrop.firebaseio.com/lootdrop_v2/");
            firebase.child('eta/' + uniqueId).once('value', function (snap) {
                eta = snap.val();
                console.log('uid=' + uniqueId + ', eta=' + eta);
                if (eta != null && eta * 1000 > now()) {
                    //   console.log(uniqueId + ", " +eta);
                    contests[uniqueId + ''] = eta;
                    var remaining = eta * 1000 - now() + 5000;
                    // setTimeout(enterContest, remaining, uniqueId);
                } else {
                    log('Received eta value for ' + uniqueId + ' was null or negative. Skipping...');
                }
            });

            addStreamRow(i + 1, uniqueId, channelName);
        }, i * 100, i);
    }

    setInterval(function() {
        for (var key in contests) {
            //console.log("key="+key);
            if (key != undefined) {
                var remaining = contests[key] * 1000 - now();
                if (remaining >= 0) {
                    updateStreamRow(key, remaining);
                }
            }
        }
    }, 1000);

    setTimeout(function() {
        console.debug('Checking if streams are stuck in Starting...')
        var ok=false;
        for (var key in contests) {
            //console.log("key="+key);
            if (key != undefined) {
                ok = true;
            }
        }
        if(!ok) {
            console.debug("OK=false, refreshing.");
            location.reload();
        } else {
            console.debug("Streams are fine. Continue...");
        }
    }, 15000);
}

function now() {
    return new Date().getTime() + localTimeDelay;
}

function adjustLocalTime() {
    $.ajax({
        url: "/api/time",
        success: function(time){
            localTimeDelay = time*1000 - new Date().getTime();
        },
        async: false
    });

    if(localTimeDelay == 0) {
        console.log("Your clock is synchronized with vulcun server.");
    } else if(localTimeDelay < 0) {
        console.log("Your clock is ahead of vulcun server with " + parseInt(-localTimeDelay/1000) + " seconds");
    } else {
        console.log("Your clock is behind of vulcun server with " + parseInt(localTimeDelay/1000) + " seconds");
    }
}

function addStreamRow(index, uniqueId, channelName) {
    $('#loot-streams').append('<li style="border-bottom: 0px; margin-bottom: 10px;" class="list-group-item"><span style="margin-right: 10px; font-size: small;" class="label label-default" id="loot'+uniqueId+'">Starting...</span>' + index + '. ' + channelName+'</li>');
}

function updateStreamRow(key, remaining) {
    var timer = $('#loot' + key);
    var timerColor = '';
    if(remaining < 120000) {
        timerColor = 'red';
    } else if (remaining < 480000) {
        timerColor = '#e5b933';
    } else {
        timerColor = '#92b449';
    }

    timer.css('background-color', timerColor);
    timer.html("Loot drop in: " + convertTime(remaining));
}

var CONSOLE_ID = "autolooter-console";
var CON = '#' + CONSOLE_ID;

function hidePlayer() {
    var playerDiv = $('#channel-player-container');
    playerDiv.attr('class', '');
    playerDiv.attr('style', 'color: red;');
    playerDiv.html("<div id='" + CONSOLE_ID + "' </div>");
    var con = $(CON);
    $(CON).append('<span style="color: red"><b>' + MSG_TWITCH_PLAYER_HIDDEN + '</b></span><br/>');
}

function log(message) {
    console.log(new Date() + " : " + message);
}

function enterContest(id) {

    $.ajax({
        type: "POST",
        url: "https://vulcun.com/api/enterlootdrop",
        data: {'league_id': id},
        success: function (resp) {
        }
    });

    log(" ADDED Contest Entry for " + id + ". Check inventory in few minutes to see if you win!");
    $('#loot' + id).html("Entry submitted! Rescanning the timer...");

    setTimeout(function(uniqueId) {
        log('Rescan ' + uniqueId);
        var channelName = $("div[data-league='" + uniqueId + "'] .indexVideoPanelTitle").text();
        firebase = new Firebase("https://lootdrop.firebaseio.com/lootdrop_v2/");
        firebase.child('eta/' + uniqueId).once('value', function (snap) {
            eta = snap.val();
            console.log('uid=' + uniqueId + ', eta=' + eta);
            if(eta != null) {
                contests[uniqueId + ''] = eta;

                var remaining = eta * 1000 - now() + 5000;

                if (remaining >= 0) {
                    console.log('A new contest entry will be added for ' + uniqueId + ' in eta=' + remaining);
                    setTimeout(enterContest, remaining, uniqueId);
                } else {
                    console.log(uniqueId + " is offline");
                    var timer = $('#loot' + uniqueId);
                    timer.html("The stream is offline.");
                }
            }
        });
    }, 60000, id);
}

setTimeout(function() {
    if(location.href == 'https://vulcun.com/user/lobby') {
        location.assign('https://vulcun.com/user/lobby#page-live');
    }

    if(location.href != 'https://vulcun.com/user/lobby#page-live') {
        return;
    }

    setTimeout(function() {
        location.reload();
    }, REFRESH_STREAMS_INTERVAL);

    hidePlayer();

    scan();
}, 2000);

function convertTime(time) {
    var millis= time % 1000;
    time = parseInt(time/1000);
    var seconds = time % 60;
    time = parseInt(time/60);
    var minutes = time % 60;
    time = parseInt(time/60);
    var hours = time % 24;

    var sec, min, hrs;
    if (seconds < 10)  sec = "0" + seconds;
    else            sec = "" + seconds;
    if (minutes < 10)  min = "0" + minutes;
    else            min = "" + minutes;
    if (hours < 10)    hrs = "0" + hours;
    else            hrs = "" + hours;

    if (hours == 0)  return min + ":" + sec;
    else    return hrs + ":" + min + ":" + sec;
}
