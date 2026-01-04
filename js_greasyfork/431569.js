// ==UserScript==
// @name         NPC - RS Clock
// @namespace
// @version      0.6
// @description  A second clock that counts down to the next shop restock, with links to all active shops
// @author       dani, ben (mushroom) / Customized by an Asher (sidefury)
// @include      https://neopetsclassic.com/*
// @include      https://www.neopetsclassic.com/*
// @exclude      https://neopetsclassic.com/lab/process/
// @exclude      https://neopetsclassic.com/island/training/complete/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @noframes
// @grant        none
// @namespace https://greasyfork.org/users/799416
// @downloadURL https://update.greasyfork.org/scripts/431569/NPC%20-%20RS%20Clock.user.js
// @updateURL https://update.greasyfork.org/scripts/431569/NPC%20-%20RS%20Clock.meta.js
// ==/UserScript==

var storage;
localStorage.getItem("RSlogger==") != null ? storage = JSON.parse(localStorage.getItem("RSlogger==")) : storage = {ea_m: "N/A", ea_s: "N/A"};

//User Settings------------------------------------------------------------

let settingsButton = `<button class="open-settings"><img src="https://i.imgur.com/bkBAD1c.png" height="32"></button>`;
let settingsButtonClose = `<button class="close-settings"><img src="https://i.imgur.com/OKCEF8l.png" height="32"></button>`;

//to enable/disable sound change to "on"/"off" below
let alarm = localStorage.getItem('alarm', 0);
// let sound = localStorage.getItem('sound', "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3");

let settings_modal =
    `<div class="settings-modal">
        <div class="settings-form">
            <div class="seperator"><input type="checkbox" id="alarm" name="alarm" ${alarm == false ? 'checked="checked"' : ''}>
            <label>Alarm</label></div>
            <div class="seperator">
            <label>Sounds</label>

            <select id="sound">
               <option value="">--------OFF-</option>
               <option value="">------mario-</option>
               <option value="https://emopets.net/soundfiles/smb3_1-up.wav">1UP</option>
               <option value="https://emopets.net/soundfiles/smb3_coin.wav">ChaChing</option>
               <option value="https://emopets.net/soundfiles/smb3_enter_level.wav">Level Start</option>
               <option value="https://emopets.net/soundfiles/smb3_hurry_up.wav">Hurry!</option>
               <option value="https://emopets.net/soundfiles/smb3_jump.wav">Jump</option>
               <option value="https://emopets.net/soundfiles/smb3_level_clear.wav">Level Clear</option>
               <option value="https://emopets.net/soundfiles/smb3_mushroom_appears.wav">Big Man</option>
               <option value="https://emopets.net/soundfiles/smb3_pause.wav">Hold on</option>
               <option value="https://emopets.net/soundfiles/smb3_player_down.wav">Oh no!</option>
               <option value="https://emopets.net/soundfiles/smb3_power-up.wav">Powerful</option>
               <option value="https://emopets.net/soundfiles/smb3_whistle.wav">Warped</option>

               <option value="">----------tv-</option>
               <option value="https://xenafan.com/buffy/sounds/grrargh.wav">Grr Argh</option>
               <option value="https://emopets.net/soundfiles/Flashback.mp3">Flashback</option>
               <option value="http://downloads.bbc.co.uk/doctorwho/sounds/tardis.mp3?ject">Tardis</option>

               <option value="">----games-</option>
               <option value="http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav">Invaders</option>
               <option value="http://codeskulptor-demos.commondatastorage.googleapis.com/descent/Zombie.mp3">Minecraft</option>
               <option value="https://noproblo.dayjo.org/ZeldaSounds/WW_New/WW_Link_Call.wav">C'mon</option>
               <option value="http://www.noproblo.dayjo.org/ZeldaSounds/OOT/OOT_Navi_Hey1.wav">Hey</option>
               <option value="http://www.noproblo.dayjo.org/ZeldaSounds/OOT/OOT_Navi_Listen1.wav">Listen</option>

               <option value="">----random-</option>
               <option value="http://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3">Pop</option>
               <option value="http://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3">Success!</option>
               <option value="http://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/start.ogg">Sick Riff</option>
               <option value="http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/extralife.ogg">BAM!</option>
               <option value="http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/eatedible.ogg">*bloop*</option>
               <option value="http://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a">Shiny</option>
            </select></div>

            <button class="save-settings">Save RS Tone</button>
        </div>
    </div>`;

$('body').append(settingsButton);
$('body').append(settingsButtonClose);
$('body').append(settings_modal);

$(`#sound option[value="${sound}"]`).attr('selected', true);
$('.open-settings').on('click', function(e) {
    $('.settings-modal').show();
    $(this).hide();
    $('.close-settings').show();
});

$('.close-settings').on('click', function(e) {
    $('.settings-modal').hide();
    $(this).hide();
    $('.open-settings').show();
});

$('.save-settings').on('click', function(e) {
    let alarmVal = $('#alarm').prop('checked') ? 1 : 0;
    let soundVal = $('#sound').children('option:selected').val();

    localStorage.setItem('alarm', alarmVal);
    localStorage.setItem('sound', soundVal);
});

// Append the CSS to the page
let customCSS = `
    #linksContainer a {
        font-size: 17px;
        color: #ccc;
    }

    .open-settings, .close-settings {
        display: none;
        position: absolute;
        top: 1035px;
        left: 10px;
        padding: 0px;
        border: 0px;
        background: none;
    }

    .close-settings {
        display: none;
    }

    .seperator {
        margin-bottom: 10px;
    }

    .settings-modal {
        display: none;
        position: absolute;
        top: 1035; left: 50;
        background: white;
        border-radius: 10px;
        width: 170px;
    }

    .settings-form {
        display: flex;
        align-content: center;
        flex-direction: column;
        padding: 10px;
    }`;

$("<style>").prop("type", "text/css").html(customCSS).appendTo("head");

//alert color time in seconds, to change, only edit numbers
//yellow is at 1 min
var orange = 15
var red = 5

//colours
var shoplinks = "#000"
var linksbg = "#000"

var clockfont = "#000"
var clockbg = "#666"

//1m-36s
var clockfont1m = "#ffff00"
var clockbg1m = "#666"

//35s-11s
var clockfont35s = "#FFA500"
var clockbg35s = "#000"

//10-0s
var clockfont10s = "#000000"
var clockbg10s = "#FF0000"

//Begin Code------------------------------------------------------------

var m = storage.ea_m
var s = storage.ea_s
var st = 60 - s

//Sidebar check
if (document.getElementsByName("a").length > 0) {

    //Containers
    var timerContainer = document.createElement("div");
    timerContainer.id = "timerContainer";
    document.body.appendChild(timerContainer);
    timerContainer.innerHTML = "RS: 06:" + st;

    var linksContainer = document.createElement("div");
    linksContainer.id = "linksContainer";
    document.body.appendChild(linksContainer);
    linksContainer.style = "position: absolute; left: 780px; top: 310px; background: none; padding-top: -15px; padding-bottom:-15px; width: 103px; line-height: 24px; letter-spacing: -1px; text-align: center; color: " + shoplinks + "; text-shadow: -1px 1px 2px " + linksbg + ";";

    linksContainer.innerHTML = `<a href='/viewshop/?shop_id=1'>🧙</a> <a href='/viewshop/?shop_id=19'>🏰</a> <a href='/viewshop/?shop_id=28'>📚</a> <a href='/viewshop/?shop_id=15'>🧸</a>
                                <br><a href='/viewshop/?shop_id=4'>🐾</a> <a href='/viewshop/?shop_id=9'>🦋</a> <a href='/viewshop/?shop_id=10'>🎃</a> <a href='/viewshop/?shop_id=11'>🦕</a>
                                <br> <a href='/viewshop/?shop_id=25'>👕</a> <a href='/viewshop/?shop_id=24'>💄</a> <a href='/viewshop/?shop_id=3'>📚</a> <a href='/viewshop/?shop_id=13'>📚</a>
                                <br><a href='/viewshop/?shop_id=2'>🍅</a> <a href='/viewshop/?shop_id=18'>🍞</a> <a href='/viewshop/?shop_id=26'>👨‍🍳</a> <a href='/viewshop/?shop_id=5'>🥤</a>
                                <br><a href='/viewshop/?shop_id=16'>🧊</a> <a href='/viewshop/?shop_id=14'>🧚</a> <a href='/viewshop/?shop_id=21'>🦇</a> <a href='/viewshop/?shop_id=12'>🍖</a>
                                <br><a href='/viewshop/?shop_id=32'>🌱</a> <a href='/viewshop/?shop_id=33'>🍫</a>
                                `;
}

function checkTime() {

    var today = new Date();
    var hrs = today.getUTCHours() - 7
    var mins = today.getMinutes()
    var secs = today.getSeconds();

    hrs = hrs < 10 ? `0${hrs}` : hrs;
    mins = mins < 10 ? `0${mins}` : mins;
    secs = secs < 10 ? `0${secs}` : secs;

    var m = mins
    var s = secs
    var st = 59 - s
    var ans = st

    if (st<10) {
        ans = "0" + st;
    }
    else {
        ans = st;
    }

    if (window.location.href.indexOf("neopetsclassic.com") > -1) {
        var player = document.createElement('audio');
        player.src = sound;
        player.preload = 'auto';
    }

    var containerStyle1 = "position: absolute; left: 780px; top: 288px; background:"
    var containerStyle2 = "; padding-top: 1px; padding-bottom: 2px; width: 103px; font-size: 11px; color:"
    var containerStyle3 = "; text-align: center; border-radius: 5px;"

    if ( m == 0 || m == 7 || m == 14 || m == 21 || m == 28 || m == 35 || m == 42 || m == 49 || m == 60) {
        timerContainer.innerHTML = "6:" + ans + " until RS";
        timerContainer.style = containerStyle1 + clockbg + containerStyle2 + clockfont + containerStyle3;

    }

    else if ( m == 1 || m == 8 || m == 15 || m == 22 || m == 29 || m == 36 || m == 43 || m == 50) {
        timerContainer.innerHTML = "5:" + ans + " until RS";
        timerContainer.style = containerStyle1 + clockbg + containerStyle2 + clockfont + containerStyle3;

    }

    else if ( m == 2 || m == 9 || m == 16 || m == 23 || m == 30 || m == 37 || m == 44 || m == 51) {
        timerContainer.innerHTML = "4:" + ans + " until RS";
        timerContainer.style = containerStyle1 + clockbg + containerStyle2 + clockfont + containerStyle3;

    }

    else if ( m == 3 || m == 10 || m == 17 || m == 24 || m == 31 || m == 38 || m == 45 || m == 52 || m == 56) {
        timerContainer.innerHTML = "3:" + ans + " until RS";
        timerContainer.style = containerStyle1 + clockbg + containerStyle2 + clockfont + containerStyle3;

    }

    else if ( m == 4 || m == 11 || m == 18 || m == 25 || m == 32 || m == 39 || m == 46 || m == 53 || m == 57) {
        timerContainer.innerHTML = "2:" + ans + " until RS";
        timerContainer.style = containerStyle1 + clockbg + containerStyle2 + clockfont + containerStyle3;

    }

    else if ( m == 5 || m == 12 || m == 19 || m == 26 || m == 33 || m == 40 || m == 47 || m == 54 || m == 58) {
        timerContainer.innerHTML = "1:" + ans + " until RS";
        timerContainer.style = containerStyle1 + clockbg + containerStyle2 + clockfont + containerStyle3;

    }

    else if ( m == 6 || m == 13 || m == 20 || m == 27 || m == 34 || m == 41|| m == 48 || m == 55 || m == 59) {
        timerContainer.innerHTML = "0:" + ans + " until RS";
        timerContainer.style = containerStyle1 + clockbg + containerStyle2 + clockfont + containerStyle3;

        if ( ans > orange ) {
            timerContainer.innerHTML = "0:" + ans + " until RS";
            timerContainer.style = containerStyle1 + clockbg1m + containerStyle2 + clockfont1m + containerStyle3;
        }

        if ( ans == orange ) {
            timerContainer.innerHTML = "0:" + ans + " until RS";
            timerContainer.style = containerStyle1 + clockbg35s + containerStyle2 + clockfont35s + containerStyle3;
            if(alarm) {
                player.play();
            }
        }

        if ( ans <= orange && ans > red ) {
            timerContainer.innerHTML = "0:" + ans + " until RS";
            timerContainer.style = containerStyle1 + clockbg35s + containerStyle2 + clockfont35s + containerStyle3;

        }
        if ( ans <= red && ans > -1 ) {
            timerContainer.innerHTML = "0:" + ans + " until RS";
            timerContainer.style = containerStyle1 + clockbg10s + containerStyle2 + clockfont10s + containerStyle3;
        }

    }

    else {
        timerContainer.innerHTML = m + ":" + ans + " until RS";
        timerContainer.style = containerStyle1 + clockbg + containerStyle2 + clockfont + containerStyle3;
    }

}

(function(){
    "use strict";

    //first check
    checkTime()

    //refresh every 1 seconds
    setInterval(checkTime, 1000);

})();