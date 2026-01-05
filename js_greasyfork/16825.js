// ==UserScript==
// @name         Vulcun Auto click + Auto Drop
// @namespace    http://tampermonkey.net/White
// @description  Drop automatico facil e pratico | VULCUN
// @author       William
// @match        https://vulcun.com/user/lobby*
// @grant        none
// @version 2.5.1.20160204115446
// @downloadURL https://update.greasyfork.org/scripts/16825/Vulcun%20Auto%20click%20%2B%20Auto%20Drop.user.js
// @updateURL https://update.greasyfork.org/scripts/16825/Vulcun%20Auto%20click%20%2B%20Auto%20Drop.meta.js
// ==/UserScript==
/* jshint -W097 */
/**
// SCRIPT ATUALIZADO V 2.5 SEM ERROS OU QUALQUER TIPO DE ATRASO, JAMAIS APAGUE OU MUDE ALGUMA LINHA ABAIXO, OU O SCRIPT PARARA DE FUNCIONAR!
 */

'use strict';

var REFRESH_STREAMS_INTERVAL = 5 * 60 * 1000; // refresh the streams list after 5 minutes

var MSG_TWITCH_PLAYER_HIDDEN = "Lives Streams Twitch é escondido pelo Script Vulcun Loot Auto Clicker, para melhorar o desempenho.";

var firebase;
var eta=0;
var streams;
var contests = {};
var localTimeDelay = 0;

function scan() {
    document.title = "Auto Click + Drop, Scanning...";
    streams = $('#vu-game-listing-ongoing .vu-channel-tab');
    var noOfStreams = streams.length;
    if(noOfStreams <= 0) {
        location.reload();
    }

    adjustLocalTime();

    console.info(new Date() + " Begin cycling through "+noOfStreams+" streams...");

    $(CON).append(
        '<div class="panel panel-default" style="border: 2px solid; color: #000000">'+
        '<div class="panel-heading" style="border: 1px solid; color: #000000">'+
        '<span > Script Vulcun Auto Drop Atualizado V 2.5!</span>'+
        '<span > Não existem múltiplas abas...</span>'+
        '<span class="badge" style="float:right; background-color: white; color: #000000; border: 1px solid;">>Aproveite este script.</span>'+
        '<span class="badge" style="float:right; background-color: white; color: #000000; border: 1px solid;">Obtendo itens?</span>'+
        '</div>'+
        '<div class="panel-body" style="border: 2px solid; color: #000000">'+
        '<ul class="list-group" id="loot-streams"><li style="border-bottom: 0px; margin-bottom: 5px; color; #124585"><b> Lista de stream e seus tempos, Aproveite :) </li></ul>'+
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
                    setTimeout(enterContest, remaining, uniqueId);
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
    $('#loot-streams').append('<li style="border-bottom: 0px; margin-bottom: 10px;" class="list-group-item"><span style="margin-right: 10px; font-size: small;" class="label label-default" id="loot'+uniqueId+'">Iniciando, Aguarde...</span>' + index + '. ' + channelName+'</li>');
}

function updateStreamRow(key, remaining) {
    var timer = $('#loot' + key);
    var timerColor = '';
    if(remaining < 120000) {
        timerColor = 'red';
    } else if (remaining < 480000) {
        timerColor = '#336ce5';
    } else {
        timerColor = '#7bb449';
    }

    timer.css('background-color', timerColor);
    timer.html("Loot dropavel em: " + convertTime(remaining));
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
                    timer.html("A stream esta offline.");
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
