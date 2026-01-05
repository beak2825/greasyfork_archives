// ==UserScript==
// @name         Pre-Alpha Zeta Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description   provides a tricksplit with F, triplesplit with V, Double Split D, Popsplit R, Q Macro Feed & Radio( Press Shift to Pause and play. Left and right arrow Keys to to change stations Up and down to change Volume
// @author       Nexus and  Other people
// @match        http://alis.io/
// @match        http://Gota.io/
// @match        http://Agar.io/
// @match        http://back.alis.io/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/29586/Pre-Alpha%20Zeta%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/29586/Pre-Alpha%20Zeta%20Script.meta.js
// ==/UserScript==
 
var radioIndex = 0;
var radios = [
    "http://frshoutcast.comunicazion.eu:8815/;",
    "http://pulseedm.cdnstream1.com:8124/1373_128",
    "http://uk1.internet-radio.com:8118/stream",
    "http://stream2.dancewave.online:8080/dance.mp3",
    "http://176.31.240.87:8000/rp.mp3",
    "http://5.39.71.159:8430/stream",
    "http://89.105.32.27/beat128.mp3?icy=http"
];
 
$("body").append("<audio id='radio' src='http://stream2.dancewave.online:8080/dance.mp3'></audio>");
 
$("#chatroom").css("height", "300px");
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var Goddamn = 25;
function keydown(event) {
    switch(event.keyCode) {
        case 16:
            if (document.getElementById("radio").paused) {
                document.getElementById("radio").play();
            } else {
                document.getElementById("radio").pause();
            }
        case 38:
            document.getElementById("radio").volume += 0.1;
            break;
        case 40:
            document.getElementById("radio").volume -= 0.1;
            break;
        case 37:
            if (--radioIndex <= 0) {
                radioIndex = radios.length-1;
            }
            $("#radio").attr("src", radios[radioIndex]);
            document.getElementById("radio").play();
            break;
        case 39:
            if (++radioIndex == radios.length) {
                radioIndex = 0;
            }
            $("#radio").attr("src", radios[radioIndex]);
            document.getElementById("radio").play();
            break;
    }
    if (event.keyCode == 81) {
        Feed = true;
        setTimeout(Fucking, Goddamn);
    } // Tricksplit
    if (event.keyCode == 70) {
       Bullshit();
        setTimeout(Bullshit, Goddamn);
        setTimeout(Bullshit, Goddamn*2);
        setTimeout(Bullshit, Goddamn*3);
    } // Triplesplit
    if (event.keyCode == 86) {
        Bullshit();
        setTimeout(Bullshit, Goddamn);
        setTimeout(Bullshit, Goddamn*2);
    } // Doublesplit
    if (event.keyCode == 68) {
        Bullshit();
        setTimeout(Bullshit, Goddamn);
    } // Split
    if (event.keyCode == 49) {
        Bulltshit();
    }  // PopSplit
    if (event.keyCode == 82) {
        Bullshit();
        setTimeout(Bullshit, Goddamn*5.32232210323424323);
}
}// When Player Lets Go Of Q, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 81) {
        Feed = false;
    }
    if (event.keyCode == 79) {
        Dingus = false;
    }
}
// Feed Macro With Q
function Fucking() {
    if (Feed) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(Bullshit, Goddamn);
    }
}
function Bullshit() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}