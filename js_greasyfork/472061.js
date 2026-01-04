// ==UserScript==
// @name         SittingOut
// @namespace    pokersittingout.zero.torn
// @version      0.4
// @description  Adds poker timer
// @author       -zero [2669774]
// @match        https://www.torn.com/loader.php?sid=holdem
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472061/SittingOut.user.js
// @updateURL https://update.greasyfork.org/scripts/472061/SittingOut.meta.js
// ==/UserScript==

var time = 300 // seconds

var players = [];

function convert(t){
    if (t == 0){
        return "NOW!";
    }
    let m = parseInt(Math.floor(t/60));
    let s = parseInt(t%60);

    if (s < 10){
        s = "0"+ s;
    }

    if (m < 10){
        m = "0"+ m;
    }

    return `${m}:${s}`;
}

function getTime(t){
    let hour = Math.floor(t/(60*60))%25;
    t %= 3600;
    let minutes = Math.floor(t/60);
    t %= 60;

    if (hour < 10){
        hour = "0" + hour;
    }
    if (minutes < 10){
        minutes = "0" + minutes;
    }
    if (t < 10){
        t = "0" + t;
    }

    return `${hour}:${minutes}:${t} TCT`
}
function check(){
    $("div[class^='players__'] > div").each(function(){
        let player = $('p[class^="name__"]', $(this)).text();
        //console.log(player);
     //  console.log($(this).text());
        if ($(this).text().includes("Sitting out") ){
         //   console.log($(this).text());
            
           // console.log(players);
            let timer = `<span seconds='${time}' id='zerotimer-${player}'>05:00</span>`;
            if ($(`#zerotimer-${player}`).length > 0){
                return;
            }
            let now = new Date();
            let secs = now.getUTCHours() * 60 * 60 + now.getUTCMinutes() * 60 + now.getUTCSeconds();
            secs += time;
            let timeout = getTime(secs);
            players.push(player);
            $("div[class^='detailsBox__']", $(this)).append(timer);
            $("div[class^='detailsBox__']", $(this)).append(`<p id='pzerotimer-${player}'>${timeout}</p>`);
        }
        else{
            if (players.includes(player)){
                $(`#zerotimer-${player}`).remove();
                $(`#pzerotimer-${player}`).remove();
                players.pop(player);
            }

        }
    });
}

function update(){
    $('span[id^="zerotimer-"]').each(function(){
        let seconds = $(this).attr("seconds");
        seconds--;
        if (seconds < 0){
            seconds = 0;
        }
        let tseconds = convert(seconds);
        $(this).html(tseconds);
        $(this).attr("seconds", seconds);
    });
}

setInterval(check, 500);
setInterval(update, 1000);
