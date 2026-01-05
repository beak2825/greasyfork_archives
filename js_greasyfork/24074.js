// ==UserScript==
// @name         The YouTube Limiter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Helps in your goals to limit the use of youtube videos!
// @author       theKidOfArcrania
// @include      http*://www.youtube.com*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/24074/The%20YouTube%20Limiter.user.js
// @updateURL https://update.greasyfork.org/scripts/24074/The%20YouTube%20Limiter.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var energy = 0; //energy in seconds. max is 600 (10 minutes)
var timerPopup = document.createElement("P");
var error = document.createElement("P");
var timer = document.createElement("SPAN");
var updater;
var lastUpdate;
var armed = false;

var timerText = document.createTextNode("Time left: ");

timerPopup.style = "z-index: 2000000000; background: yellow; font-family: arial; position: fixed; font-size: 20px;";
timer.style = "font-weight: bold";
timerPopup.appendChild(timerText);
timerPopup.appendChild(timer);

error.style = "z-index=2000000000; background=yellow; font-family: arial; position: fixed; font-size: 20px; color: red";
error.innerHTML = "We're sorry. But you have used up all your time. Please refresh this page later to see how much energy you recharged...";

document.body.insertBefore(timerPopup, document.body.childNodes[0]);
lastUpdate = new Date();

//Arming/ disarming of youtube
arm();
document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        unArm();
    }else {
        arm();
    }
});
document.addEventListener("unload", unArm, true);

//Arms a youtube page with a timer
function arm() {
    if (armed) return;
    armed = true;
    var now = new Date().getTime();
    var last = GM_getValue("INACTIVE", now);
    var elapsed = now - last;
    
    //Recharge energy with exchange rate of 1 minute of no activity
    //yielding 1 second of watching time.
    energy = GM_getValue("ENERGY", 4) + elapsed / (1000 * 60);
    energy = Math.min(energy, 600);

    lastUpdate = new Date();
    updater = setInterval(updateEnergy, 4);
}

//Unarms the limiter, recharge energy for next use.
//Called whenver the window is minimized or unfocused
function unArm() {
    if (!armed) return;
    armed = false;
    
    GM_setValue("INACTIVE", new Date().getTime());
    GM_setValue("ENERGY", energy);
    clearInterval(updater);
}

//Checks the amount of time left
function updateEnergy() {
    var before = lastUpdate;
    lastUpdate = new Date();
    var after = lastUpdate;
    
    energy -= (after - before) / 1000;
    energy = Math.max(energy, 0);
    
    if (energy > 60) {
        timer.style.color = "green";
    }else if (energy > 20){
        timer.style.color = "goldenrod";
    }else {
        timer.style.color = "red";
    }
    
    GM_setValue("INACTIVE", new Date().getTime());
    GM_setValue("ENERGY", energy);
    
    if (energy <= 0) {
        unArm();
        document.body.innerHTML = "";
        document.body.appendChild(error);
    }else {
        var secs = Math.floor(energy) % 60;
        var mins = Math.floor(energy / 60) % 60;
        var hrs = Math.floor(energy / 3600) % 24;
        
        timer.innerHTML = padTime(hrs) + ":" + padTime(mins) + ":" + padTime(secs);
    }
}
    
function padTime(t) {
    var a = Math.abs(t);
    if (a < 10) 
        return (t < 0 ? "-0" : "0") + a;
    else 
        return (t < 0 ? "-" : "") + a;
}