// ==UserScript==
// @name         Grundos.cafe - RS Clock ONLY
// @namespace    https://greasyfork.org/users/1008951
// @version      v2.2.13
// @description  A second clock that counts down to the next shop restock, with links to all active shops
// @author       dani, ben (mushroom), rowan
// @match      https://grundos.cafe/*
// @match      https://www.grundos.cafe/*
// @exclude      https://www.grundos.cafe/~*
// @exclude      https://grundos.cafe/process/
// @exclude      https://grundos.cafe/island/training/complete/*
// @exclude      https://www.grundos.cafe/userlookup/*
// @exclude      https://www.grundos.cafe/~*
// @exclude      https://www.grundos.cafe/market/browseshop/?owner=*
// @exclude     https://www.grundos.cafe/itemview/*
// @exclude     https://www.grundos.cafe/useobject*
// @exclude      https://www.grundos.cafe/guilds*
// @exclude      https://www.grundos.cafe/petlookup/?pet_name=*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @noframes
// @grant        none


// @downloadURL https://update.greasyfork.org/scripts/449892/Grundoscafe%20-%20RS%20Clock%20ONLY.user.js
// @updateURL https://update.greasyfork.org/scripts/449892/Grundoscafe%20-%20RS%20Clock%20ONLY.meta.js
// ==/UserScript==

var storage;
localStorage.getItem("GCRSlogger==") != null ? storage = JSON.parse(localStorage.getItem("GCRSlogger==")) : storage = {ea_m: "N/A", ea_s: "N/A"};

var loc = window.location.href;
//User Settings------------------------------------------------------------

let settingsButton = `<button class="open-settings"><img src="https://i.imgur.com/zEU1z8C.png" height="40"></button>`;
let settingsButtonClose = `<button class="close-settings"><img src="https://i.imgur.com/zEU1z8C.png" height="40"></button>`;

//to enable/disable sound change to "on"/"off" below
let alarm = localStorage.getItem('alarm', 0);
let sound = localStorage.getItem('sound', "http://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3");

let settings_modal =
    `
    <div class="settings-modal">
        <div class="settings-title">
            RS Clock Settings
        </div>

        <div class="settings-form">
            <div class="seperator"></div>

            <div class="seperator"><label><a href="https://emopets.net/rssound" target="_blank">Sounds</a><br>
</label>
            <select id="sound">

               <option value="">------OFF-</option>
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

            <button class="save-settings">Save Settings</button>
        </div>
    </div>
`;

 
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
   

    .settings-title {
        padding: 10px;
        background: #ffcf01;
        color: black;
        font-weight: bold;
        font-size: 0.8em;
        text-align: center;
        text-shadow: 2px 2px 5px #FFF;
    }

    .open-settings, .close-settings {
        position:absolute;
        top: 700px;
        left: 40px;
        padding: 0px;
        border: 0px;

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
        top: 555px; left: 100px;
        margin: auto;
        background: rgba(255, 255, 255, 1);
        border-radius: 25px;
        width: 200px;
        height: 200px;
        border: 2px solid rgba(0, 0, 0, 1);
        overflow: hidden;
    }

    .settings-form {
        display: flex;
        align-content: center;
        justify-content: center;
        flex-direction: column;
        padding: 20px;
    }
    `;

    $("<style>").prop("type", "text/css").html(customCSS).appendTo("head");

//alert color time in seconds, to change, only edit numbers
//yellow is at 1 min
var orange = 35
var red = 10

//to change colors change hex codes below
//hex codes online: https://coolors.co/
var shoplinks = "#BC617C"
var linksbg = "#C19EBE"

var clockfont = "black"
var clockbg = "#FFFF63" //change the font too ^
var border = "black"

//1m-36s
var clockfont1m = "#ffff00"
var clockbg1m = "#000000"

//35s-11s
var clockfont35s = "#FFA500"
var clockbg35s = "#000000"

//10-0s
var clockfont10s = "#000000"
var clockbg10s = "#FF0000"

//Begin Code------------------------------------------------------------

var m = storage.ea_m
var s = storage.ea_s
var st = 60 - s

//Sidebar check

//Containers
var timerContainer = document.createElement("div");
    timerContainer.id = "timerContainer";
    document.body.appendChild(timerContainer);
    timerContainer.innerHTML = "RS: 06:" + st;
    timerContainer.style = "position:absolute;left:16px;top:504px;background:" + clockbg + ";padding-top:1px;padding-bottom:2px;width:100;font-size:12;color:" + clockfont + ";text-align:center;";

var linkscontainer = document.createElement("div");
    linkscontainer.id = "linkscontainer";
    document.body.appendChild(linkscontainer);
    linkscontainer.innerHTML =
        `
        `
    linkscontainer.style = "position:absolute;left:770px;top:30px;background:#transparent; lineHeight: 2; padding-top:-15px;padding-bottom:-15px;width:160;text-align:center;border-radius:25px;";
    

function checkTime() {

var today = new Date();
var mins = parseInt(document.querySelector("#NST_clock_minutes").innerHTML)
var secs = parseInt(document.querySelector("#NST_clock_seconds").innerHTML)

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

if (sound && loc.indexOf("www.grundos.cafe/") > -1) {
var player = document.createElement('audio');
player.src = sound;
player.preload = 'auto';
}

var containerStyle1 = "position:absolute;left:16px;top:504px;border:1px solid;background:"
var containerStyle1b = ";border-color:"
var containerStyle2 = ";padding-top:1px;padding-bottom:2px;width:94;font-size:11;color:"
var containerStyle3 = ";text-align:center;"

    if ( m == 0 || m == 6 || m == 12 || m == 18 || m == 24 || m == 30 || m == 36 || m == 42 || m == 48 || m == 54 || m == 60) {
        timerContainer.innerHTML = "5:" + ans + " until RS";
        timerContainer.style = containerStyle1 + clockbg + containerStyle1b + border + containerStyle2 + clockfont + containerStyle3;

    }

    else if ( m == 1 || m == 7 || m == 13 || m == 19 || m == 25 || m == 31 || m == 37 || m == 43 || m == 49 || m == 55) {
        timerContainer.innerHTML = "4:" + ans + " until RS";
        timerContainer.style = containerStyle1 + clockbg + containerStyle1b + border + containerStyle2 + clockfont + containerStyle3;

    }

    else if ( m == 2 || m == 8 || m == 14 || m == 20 || m == 26 || m == 32 || m == 38 || m == 44 || m == 50 || m == 56) {
        timerContainer.innerHTML = "3:" + ans + " until RS";
        timerContainer.style = containerStyle1 + clockbg + containerStyle1b + border + containerStyle2 + clockfont + containerStyle3;

    }

    else if ( m == 3 || m == 9 || m == 15 || m == 21 || m == 27 || m == 33 || m == 39 || m == 45 || m == 51 || m == 57) {
        timerContainer.innerHTML = "2:" + ans + " until RS";
        timerContainer.style = containerStyle1 + clockbg + containerStyle1b + border + containerStyle2 + clockfont + containerStyle3;

    }

    else if ( m == 4 || m == 10 || m == 16 || m == 22 || m == 28 || m == 34 || m == 40 || m == 46 || m == 52 || m == 58) {
        timerContainer.innerHTML = "1:" + ans + " until RS";
        timerContainer.style = containerStyle1 + clockbg + containerStyle1b + border + containerStyle2 + clockfont + containerStyle3;

    }

    else if ( m == 5 || m == 11 || m == 17 || m == 23 || m == 29 || m == 35 || m == 41 || m == 47 || m == 53 || m == 59) {
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
setInterval(checkTime, 500);

})();