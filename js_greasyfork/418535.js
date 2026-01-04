// ==UserScript==
// @name         Krunker Features
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simple script to add client features to Krunker including: Game timer in the menu and find new game
// @author       KLZX121
// @match        https://krunker.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418535/Krunker%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/418535/Krunker%20Features.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Menu Timer
    setInterval(()=>{

        //move spectateButton
        document.getElementById('spectButton').setAttribute('style', 'top: 20px;left: 550px')

        //create element menuTimer
        let menuTimer = document.createElement("div")
        menuTimer.setAttribute('id', 'menuTimer')
        menuTimer.setAttribute('style', "margin-bottom: 50px;color: cyan")

        //append to instructions element
        document.getElementById('instructions').appendChild(menuTimer)

        //update menuTimer
        let time = document.getElementById('timerVal').innerHTML
        document.getElementById('menuTimer').innerHTML = time

    }, 1000)

    //Find New Game on F4
    document.onkeydown = findNewGame;

    function findNewGame(a){
        if (a.code !== 'F4') return;
        window.location.href = 'https://krunker.io';
    }

})();