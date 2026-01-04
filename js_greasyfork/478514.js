// ==UserScript==
// @name         Youtube Spacebar Pause/Play Fix
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  A Youtube bug disables the space key shortcut, which often happens when you change windows and return to Youtube, often with the ALT + TAB shortcut. This script ensures that the spacebar PAUSE / PLAY shortcut works correctly.
// @author       waszner and Mimo
// @match        *://www.youtube.com/*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478514/Youtube%20Spacebar%20PausePlay%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/478514/Youtube%20Spacebar%20PausePlay%20Fix.meta.js
// ==/UserScript==



(function() {

    'use strict';




    function isYouTubeWatchPage() {
        return window.location.href.includes('www.youtube.com/watch');
    }


    // Fonction pour détecter les changements de page sur YouTube
    function detectPageChanges() {
        // Fonction pour afficher une alerte en cas de changement
        function pageIsWatch() {
            console.log("new video listeners")
            isYoutubeWatch = true;
            updateVideoListeners();
        }

        // Ajoutez un écouteur d'événement pour l'événement 'spfdone'
        window.addEventListener('spfdone', function() {
            if (isYouTubeWatchPage()) {
                pageIsWatch();
            }else{
                isYoutubeWatch = false;
            }
        });

        // Ajoutez un écouteur d'événement pour l'événement 'yt-navigate-finish'
        window.addEventListener('yt-navigate-finish', function() {
            if (isYouTubeWatchPage()) {
                pageIsWatch();
            }else{
                isYoutubeWatch = false;
            }
        });
    }


    detectPageChanges();
    if(isYouTubeWatchPage()){
        updateVideoListeners();

    }





    let isYoutubeWatch = isYouTubeWatchPage();

    let spacePressed = false;

    let currentTime = 0;

    let isVideoPlaying = false;

    let wasVideoPlaying = false;

    const YoutubeCommentFieldSelector = '#contenteditable-root'; //css selector of youtube comments
    const YoutubeSearchBar = '#search'; //css selector of youtube search bar

    const KPressDelay = 200; // how much time will the program wait before pressing K (probably ping dependent)

    // Add event listener

    document.addEventListener('keydown', pressKifWatch, true);

    function pressKifWatch(e){
        // Only executes the pressK function if it's a youtube watch page
        if(isYouTubeWatchPage()){
            pressKWithSpacebar(e);
        }
    }

    // Function to press "K" with the Spacebar when the video's play/pause state didn't change

    function pressKWithSpacebar(e) {

        //preventing playing/pausing the video while typing coments or replies

        if (e.target.matches(YoutubeCommentFieldSelector) || e.target.matches(YoutubeSearchBar)){

            return;

        }else{

            if (e.key === ' ' && spacePressed === false) {

                spacePressed = true;

                wasVideoPlaying = isVideoPlaying;

                setTimeout(simulateKKeyPress, KPressDelay);

            }

        }

    }

    function updateVideoListeners(){
        // Listen to the video's play and pause events to update the variables

        const video = document.querySelector('video');

        //These prevent external play/pause (pressing K, clicking on the video etc) from messing up the program's run

        video.addEventListener('play', function() {

            isVideoPlaying = true;

            if (spacePressed) { //Prevents the "double tap" of spaceBar when the video IS in focus and pressing the space bar did play/pause it

                spacePressed = false; // Reset the Spacebar press time if video started playing

            }

        });

        video.addEventListener('pause', function() {

            isVideoPlaying = false;

            if (spacePressed) { //Prevents the "double tap" of spaceBar when the video IS in focus and pressing the space bar did play/pause it

                spacePressed = false; // Reset the Spacebar press time if video paused

            }

        });

    }

    // Function to simulate pressing "K" if the conditions are met

    function simulateKKeyPress() {

        if (spacePressed && (wasVideoPlaying === isVideoPlaying)) {

            // Send an "K" keypress to simulate pressing "K"

            const nKeyPress = new KeyboardEvent('keydown', { key: 'K', code: 'KeyK', which: 75, keyCode: 75, charCode: 75});

            document.dispatchEvent(nKeyPress);

        }

    }




})();
