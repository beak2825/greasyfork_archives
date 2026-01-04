// ==UserScript==
// @name         UATV-keybindings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds missing keybindings for seeking on desktop, fixes switching between audio and video stream on mobile
// @author       Molten Cheese Bear
// @match        https://unauthorized.tv/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464646/UATV-keybindings.user.js
// @updateURL https://update.greasyfork.org/scripts/464646/UATV-keybindings.meta.js
// ==/UserScript==

function seekRew(){
    var now = uatvPlayer.currentTime();
    uatvPlayer.currentTime(now-10);
    }

function seekFwd(){
    var now = uatvPlayer.currentTime();
    uatvPlayer.currentTime(now+10);
    console.log("skipping ahead...");
    }

function switchToAudio1() {
    let currentPlayerTime = Math.floor(uatvPlayer.currentTime());
    window.location.href = `${urlProtocol}//${urlDomain}/listen/${contentId}/s${currentPlayerTime}/`;
}

function switchToVideo1() {
    let currentPlayerTime = Math.floor(uatvPlayer.currentTime());
    window.location.href = `${urlProtocol}//${urlDomain}/watch/${contentId}/s${currentPlayerTime}/`;
}

(function() {
    'use strict';

    // keybindings for Desktop
    document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37:
            seekRew();
            break;
        case 39:
            seekFwd();
            break;
        }
    }

    //touch event bindings for mobile clients
    document.addEventListener("touchstart",e => {
        var cw = e.view.innerWidth;
        var tp = e.targetTouches[0].clientX;


        if(e.target.playerId == 'uatv-player'){
          if(tp < cw * 0.3){
              console.log("do skip backwards");
              seekRew();
          }
           if(tp > cw * 0.7){
              console.log("do skip forward");
              seekFwd();
          }
            if(tp > cw * 0.3 && tp < cw * 0.7){
              console.log("toggle play/pause");
              togglePlayPause();
          }
        }

});

    // fixing the loss of currentTime when switching between
    // audio and video stream on mobile devices
var mobileButton = document.getElementsByClassName('button')[3];

if(mobileButton.innerHTML == 'Stream audio'){
    mobileButton.removeAttribute('href');
    mobileButton.setAttribute('id','mobileStreamAudioButton');
    mobileButton.addEventListener("click", switchToAudio1);
}

if(mobileButton.innerHTML == 'Stream video'){
    mobileButton.removeAttribute('href');
    mobileButton.setAttribute('id','mobileStreamVideoButton');
    mobileButton.addEventListener("click", switchToVideo1);
}



})();