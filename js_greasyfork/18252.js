// ==UserScript==
// @name         Mute Google Music Ads
// @namespace    WillNiels
// @version      1.0
// @author       William Nielsen
// @description  Blocks Google Music Ads by muting them.
// @match        http*://play.google.com/music/listen*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18252/Mute%20Google%20Music%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/18252/Mute%20Google%20Music%20Ads.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var timerTry = 1000;

function muteAds(){
    var volumeSlider = document.querySelector('#material-vslider');
    
    if(localStorage.getItem("volume") == null){
        localStorage.setItem("volume", 25);
    }

    if( document.querySelector('#currently-playing-title').innerHTML == "We'll be right back" ){
        console.log('Mute Google Ads: Blocking the ad!');
        volumeSlider.value = 0;
    }else{
        var preValue = localStorage.getItem("volume");
        console.log("Volume set to: " + preValue + "%");
        volumeSlider.value = preValue;
    }
}

function setupObservers( ){

    console.log("Mute Google Ads: Setting up observer.");
    var songInfo = document.querySelector('#playerSongInfo');
    var volumeSlider = document.querySelector('#material-vslider');

    if (songInfo !== null && volumeSlider !== null) {
        var config = {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        };
        
        //first observer for detecting ads
        var observer = new window.MutationObserver(muteAds);
        observer.observe(songInfo, config);

        //second observer for saving volume setting
        var observer2 = new window.MutationObserver(function(){
            if(volumeSlider.value !== 0)
                localStorage.setItem("volume",volumeSlider.value);
        });

        observer2.observe(volumeSlider, config);
    }
    else {
        console.warn('Mute Google Ads: Failed to find player, Retrying...');
        timerTry += 1000;
        setTimeout(setupObservers, timerTry);
    }
}

setTimeout(setupObservers, timerTry);