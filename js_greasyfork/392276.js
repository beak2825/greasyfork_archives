// ==UserScript==
// @name         Chrome Dino Simple Hack For https://dino-chrome.com/
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  Simple Invincibility and Speed Hack
// @author       Hypno7767
// @icon https://cdn.dribbble.com/users/974273/screenshots/3270748/chrom_no_internet_connection.png
// @include        https://dino-chrome.com/
// @include        https://t-rex-game.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392276/Chrome%20Dino%20Simple%20Hack%20For%20https%3Adino-chromecom.user.js
// @updateURL https://update.greasyfork.org/scripts/392276/Chrome%20Dino%20Simple%20Hack%20For%20https%3Adino-chromecom.meta.js
// ==/UserScript==


// NOTE: I am fully aware this is basic as f*ck, but stay with me here.
// NOTE: I am fully aware this is basic as f*ck, but stay with me here.
// NOTE: I am fully aware this is basic as f*ck, but stay with me here.
// NOTE: I am fully aware this is basic as f*ck, but stay with me here.
// NOTE: I am fully aware this is basic as f*ck, but stay with me here.
// it really took me a long time to figure this out. HTML is so much easier, dammit.

// Invincibility Script
Runner.instance_.gameOver = function(){}
//Speed hack
var button = document.createElement("Button");
button.innerHTML = "Speed Hack Enable";
button.style = "top:0;right:0;position:absolute;z-index:99999;padding:20px;";
document.body.appendChild(button);
button.onclick = function(){Runner.instance_.setSpeed(40)};

// Other Speed Hack (press "s" for it)

window.addEventListener("keydown", hehe, false);

showHacks();

function showHacks(){
    var box = document.getElementById("desktop-controls");
    var controls = document.createElement("div");
    controls.className = "title2";
    controls.id = "adamsstuff";
    var lol = document.getElementById("adamsstuff");
}

function hehe(e){
    if(e.keyCode == "83"){
        var a = prompt("What Speed Would You Like?");
        if(isNaN(a)){
            window.alert("Please enter a number next time");
        }else{
            Runner.instance_.setSpeed(a);
        }
    }

else if(e.keyCode == "68"){
        var b = prompt("What Distance Would You Like?");
        if(isNaN(b)){
            window.alert("Please enter a number next time");
        }else{
            Runner.instance_.distanceRan = b
        }
    }
}