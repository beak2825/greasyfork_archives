// ==UserScript==
// @name         Youtube mousewheel volume control
// @version      1.0.0
// @description  Control youtube video volume by scrolling over the video.
// @author       Leblayd
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @namespace    https://greasyfork.org/en/users/292107
// @downloadURL https://update.greasyfork.org/scripts/381929/Youtube%20mousewheel%20volume%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/381929/Youtube%20mousewheel%20volume%20control.meta.js
// ==/UserScript==

var changeAmount = 5;
var hideIndicatorTime = 9000;
var shiftModifier = function(change) { return change * 4; };

var player = document.getElementsByClassName("html5-video-container")[0];
player.addEventListener("mouseenter", disableScroll);
player.addEventListener("mouseleave", enableScroll);
player.addEventListener("wheel", volControll);

var volText = setUpVolumeIndicator();
player.appendChild(volText);

function volControll(e) {
    if (e.ctrlKey || e.altKey) return; // cancel if alt or ctrl key is pressed, as we use the default in those cases

    var video = document.getElementsByClassName("video-stream html5-main-video")[0];
    var currVol = video.volume;

    var direction = e.deltaY < 0;
    var actualChange = changeAmount / 100;
    if (e.shiftKey) actualChange = shiftModifier(actualChange);

    if (direction) currVol += actualChange;
    else currVol -= actualChange;

    if (currVol > 1) currVol = 1;
    else if (currVol < 0) currVol = 0;

    video.volume = currVol;

    document.getElementsByClassName("ytp-volume-panel")[0].setAttribute("aria-valuenow", currVol * 100);
    document.getElementsByClassName("ytp-volume-slider-handle")[0].setAttribute("style", "left:" + currVol * 40 + "px;");
    document.getElementsByClassName("ytp-svg-fill ytp-svg-volume-animation-speaker")[0].setAttribute("d", getVolumeIconAttribute(currVol));

    volText.innerHTML = Math.round(currVol * 100,0);
    volText.hidden = false;
    setTimeout(function() {
        volText.hidden = true;
    }, hideIndicatorTime);
}

function setUpVolumeIndicator() {
    var t = document.createElement("h1");
    t.style.fontSize = "50px";
    t.style.color = "rgba(255,255,155,1)";
    t.style.textShadow = "0px 5px 10px rgba(0,0,0,1)";
    t.style.margin = "15px 0 0 15px";
    t.style.float = "left";
    t.style.position = "absolute";
    t.style.zIndex = 10000;
    t.style.fontWeight = 200;
    return t;
}

function getVolumeIconAttribute(volume) {
    if (volume === 0) return "m 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z";
    else if (volume >= 0.5) return "M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z";
    else return "M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z";
}

// Disable Scrolling -- https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily

function preventDefault(e) {
    e = e || window.event;
    e.returnValue = e.altKey || e.ctrlKey; // prevents default, unless alt or ctrl key is pressed
}

function disableScroll() {
    window.onwheel = preventDefault;
}

function enableScroll() {
    window.onwheel = null;
}