// ==UserScript==
// @name         Mute Yandex Music Ads
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Mute Yandex.Music advertising!
// @author       You
// @match        https://music.yandex.ru/*
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398311/Mute%20Yandex%20Music%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/398311/Mute%20Yandex%20Music%20Ads.meta.js
// ==/UserScript==
'use strict';

var timerTry = 1000;

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

function toogleMute(){
    var volumeBtn = document.querySelector('.volume__btn');
    triggerMouseEvent(volumeBtn, 'mousedown');
}

var currentPlays = true;

function setupObservers( ){

    var songInfo = document.querySelector('title').innerText;

    if (songInfo !== null) {
        if (songInfo === 'Реклама') {
            if (currentPlays) {
                console.log("Mute Yandex Ads");
                toogleMute();
                currentPlays = false;
            }
        } else if (!currentPlays) {
            console.log("UnMute Yandex Ads");
            toogleMute();
            currentPlays = true;
        }

    }

    setTimeout(setupObservers, timerTry);
}

setTimeout(setupObservers, timerTry);