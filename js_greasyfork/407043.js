// ==UserScript==
// @name           Timvision Enhanced
// @name:it        Timvision Enhanced
// @namespace      http://cosoleto.free.fr/
// @version        0.3
// @description    Aggiunge scorciatoie simili a quelle di Youtube a timvision.it
// @description:it Aggiunge scorciatoie simili a quelle di Youtube a timvision.it
// @author         Francesco Cosoleto
// @match        http*://www.timvision.it/*
// @exclude      http*://www.timvision.it/profile
// @exclude      http*://www.timvision.it/promo
// @exclude      http*://www.timvision.it/support
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407043/Timvision%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/407043/Timvision%20Enhanced.meta.js
// ==/UserScript==

var statusbar;

function isFullscreen() {return document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || false;}

function toggleFullscreen() {

    if (isFullscreen()) {
        document.exitFullscreen();
    } else {
        var fsbut = document.getElementsByClassName("fullscreen-button");
        if (fsbut) { fsbut[0].firstElementChild.click();}
        //vid.requestFullscreen();
    }
}

function keydown(e) {

    if (!(document.activeElement.tagName === "BODY" || document.activeElement.tagName === "VIDEO" || document.activeElement.tagName === "DIV")) {
        return;}

    var vid = document.getElementById("videoPlayer");

    if (!vid) {
        return;
    }

    var bottom_ctrl = document.getElementsByClassName("bottom-controls");
    if (bottom_ctrl) {
        bottom_ctrl[0].appendChild(statusbar);
    }
    statusbar.innerHTML = '';
    if (keydown.timeout) {
        clearTimeout(keydown.timeout);
    }

    if (!e.ctrlKey && !e.altKey) {
        switch (e.key) {
            case 'f':
            case 'F':
                toggleFullscreen();
                e.preventDefault();
                break;
            case 'k':
            case 'K':
                if (vid.paused) {
                    vid.play();
                } else {
                    vid.pause();
                }
                e.preventDefault();
                break;
            case 'm':
            case 'M':
                vid.muted = !vid.muted;
                e.preventDefault();
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                vid.currentTime = e.key/10 * vid.duration;
                e.preventDefault();
                break;
            case 'j':
                vid.currentTime -= 10;
                e.preventDefault();
                break;
            case 'l':
                vid.currentTime += 10;
                e.preventDefault();
                break;
        }
        switch (e.keyCode) {
            case 35:
                // end video
                vid.currentTime = vid.duration;
                break;
            case 36:
                // restart video
                vid.currentTime = 0;
                break;
            case 37:
                // seek backward
                vid.currentTime -=5;
                break;
            case 39:
                // seek forward
                vid.currentTime +=5;
                break;
                // ,
            case 188:
                vid.playbackRate -= 0.1;
                statusbar.innerText = "Velocità: " + vid.playbackRate.toFixed(1);
                vid.parentNode.classList.remove("hide-controls");
                e.preventDefault();
                break;
                // .
            case 190:
                vid.playbackRate += 0.1;
                statusbar.innerText = "Velocità: " + vid.playbackRate.toFixed(1);
                vid.parentNode.classList.remove("hide-controls");
                e.preventDefault();
                break;
        }
    }
    keydown.timeout = setTimeout(function(){statusbar.innerHTML = ''}, 5000);
}

(function() {
    'use strict';

    statusbar = document.createElement('div');
    statusbar.setAttribute('style', "paddingLeft: 10px;");

    window.addEventListener("keydown", keydown, false);
})();
