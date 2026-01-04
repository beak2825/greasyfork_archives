// ==UserScript==
// @name         Chrome Dino Hack For https://dino-chrome.com/ and https://chromedino.com/black/ Press s to set speed
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  Simple Invincibility and Speed Hack
// @author       Hypno7767
// @icon https://cdn.dribbble.com/users/974273/screenshots/3270748/chrom_no_internet_connection.png
// @include        https://chromedino.com/black/
// @include        https://dino-chrome.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413292/Chrome%20Dino%20Hack%20For%20https%3Adino-chromecom%20and%20https%3Achromedinocomblack%20Press%20s%20to%20set%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/413292/Chrome%20Dino%20Hack%20For%20https%3Adino-chromecom%20and%20https%3Achromedinocomblack%20Press%20s%20to%20set%20speed.meta.js
// ==/UserScript==

// Invincibility Script
Runner.instance_.gameOver = function(){}
//Speed hack
var button = document.createElement("Button");
button.innerHTML = "Speed Hack On";
button.style = "top:0;right:0;position:absolute;z-index:99999;padding:20px;";
document.body.appendChild(button);
button.onclick = function(){Runner.instance_.setSpeed(10000)};

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