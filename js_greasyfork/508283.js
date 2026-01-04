// ==UserScript==
// @name         CityGuesser Shortcuts
// @namespace    https://cityguesser.eu/game
// @version      2024-09-19
// @description  Adds shortcuts to the browser game "City Guesser"
// @author       EmilyDieHenne
// @license MIT
// @match        https://virtualvacation.us/guess
// @match        https://cityguesser.eu/game
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508283/CityGuesser%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/508283/CityGuesser%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const speedSlider = document.getElementById("speedSlider");
    const speedSliderLabel = document.getElementById("output-id");
    const playbackRates = [
        {rate: 0.25, sliderValue: 1, label: "0.1"},
        {rate: 0.5, sliderValue: 50, label: "0.5"},
        {rate: 0.75, sliderValue: 75, label: "0.7"},
        {rate: 1, sliderValue: 100, label: "1.0"},
        {rate: 1.25, sliderValue: 125, label: "1.2"},
        {rate: 1.5, sliderValue: 150, label: "1.5"},
        {rate: 1.75, sliderValue: 175, label: "1.7"},
        {rate: 2, sliderValue: 200, label: "2.0"},
    ]
    let currentIndex = 3;
    const setPlaybackSpeed = (playback) => {
           player.setPlaybackRate(playback.rate)
           speedSlider.value = playback.sliderValue
           speedSliderLabel.value = playback.label
    }

    addEventListener("keydown", (e) => {
        switch(e.key){
            case "q":
                setPlaybackSpeed(playbackRates[0]);
                break;
            case "e":
                setPlaybackSpeed(playbackRates[playbackRates.length - 1]);
                break;
            case "+":
                if(currentIndex < playbackRates.length - 1){
                    currentIndex++;
                    setPlaybackSpeed(playbackRates[currentIndex]);
                }
                break;
            case "-":
                if(currentIndex > 0){
                    currentIndex--;
                    setPlaybackSpeed(playbackRates[currentIndex]);
                }
                break;
        }

    });
    addEventListener("keyup", (e) => {
       if (["q", "e"].includes(e.key) ) {
            setPlaybackSpeed(playbackRates[currentIndex]);
       }
    });

})();