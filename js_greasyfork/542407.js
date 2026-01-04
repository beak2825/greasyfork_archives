// ==UserScript==
// @name         Watchchain
// @namespace    http://tampermonkey.net/
// @version      20240322a
// @description  Updates the Torn background color based on chain timer. Draws browser focus at 60 seconds remaining. Please don't rely on only this for watching chains until you've confirmed it!!
// @author       simplyzalp
// @homepageURL  https://www.torn.com/profiles.php?XID=2691559
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/542407/Watchchain.user.js
// @updateURL https://update.greasyfork.org/scripts/542407/Watchchain.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function drawAlarm() {
        return document.querySelector('.responsive-sidebar-container').animate([
            { offset: 0.00, backgroundColor: "#010" },
            { offset: 0.50, backgroundColor: "#020" },
            { offset: 0.60, backgroundColor: "#080" },
            { offset: 0.75, backgroundColor: "#ff0" },
            { offset: 0.90, backgroundColor: "#f00" },
            { offset: 0.99, backgroundColor: "#f0f" },
            { offset: 1.00, backgroundColor: "#fff" }
        ],{
            duration: 300*1000,
            easing: 'ease-out',
            delay: 0,
            iterations: 1,
            direction: 'normal',
            fill: 'none'
        });
    }
    //const alarmWav = new Audio('https://freesound.org/people/Timbre/sounds/483639/download/483639__timbre__ahooga-vintage-car-horn-remix-of-craigsmiths-freesound-480002.wav');;
    let hasAlerted = false; // flag to prevent repeated alerts
    let hasResetAnimation = false; // flag to prevent multiple restarts of background color animation
    let colorAnim; // will use to hold animations later
    const interval = setInterval(function() {
        ///console.log('checking chain timer');
        let timeLeftStr = document.querySelector('.bar-timeleft___B9RGV').innerHTML;
        let timeLeftArr = timeLeftStr.split(":");
        let timeLeftInt = Number(timeLeftArr[0])*60 + Number(timeLeftArr[1]);
        console.log(`${timeLeftInt} seconds remaining${timeLeftInt < 30 ? '!' : ''}`);

        // background colors
        if (299 <= timeLeftInt) {
            if (!hasResetAnimation) {
                hasResetAnimation = true;
                try { colorAnim.cancel(); } catch (e) { console.warn(`Ignored this error while cancelling the background color animation:\n ${e}`); }
                colorAnim = drawAlarm();
            }
        } else {
            hasResetAnimation = false;
        }

        /*if (0 < timeLeftInt && timeLeftInt <= 30) {
            drawAlarm();
        } else if (30 < timeLeftInt && timeLeftInt <= 60) {
            document.querySelector('.responsive-sidebar-container').style.backgroundColor = "#300";
        } else if (60 < timeLeftInt && timeLeftInt <= 120) {
            document.querySelector('.responsive-sidebar-container').style.backgroundColor = "#220";
        } else if (120 < timeLeftInt) {
            document.querySelector('.responsive-sidebar-container').style.backgroundColor = "#010";
        }*/

        // sound
        /*if (0 < timeLeftInt && timeLeftInt <= 270 && alarmWav.paused) {
            alarmWav.play();
        } else if (30 < timeLeftInt && !alarmWav.paused) {
            alarmWav.load(); // pauses and reloads sound from beginning
        }*/

        // warning message
        if (0 < timeLeftInt && timeLeftInt <= 60 && !hasAlerted) {
            window.alert('Less than one minute on chain!');
            hasAlerted = true;
        } else if (60 < timeLeftInt && hasAlerted) {
            hasAlerted = false;
        }
    }, 1000);

//    clearInterval(interval); // thanks @Luca D'Amico

})();