// ==UserScript==
// @name         Generals.io Add warning
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Plays a sound that warns you about Add
// @author       z33r0x
// @match        *://generals.io/*
// @icon         https://generals.io/favicon/favicon-32x32.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474667/Generalsio%20Add%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/474667/Generalsio%20Add%20warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables

    var WarningSound = new Audio('https://raw.githubusercontent.com/RunDTM/scripts/main/kick-short-boomy.wav')
    var TheSound = new Audio('https://raw.githubusercontent.com/RunDTM/scripts/main/kick-warm-boomy.wav')

    WarningSound.loop = false
    TheSound.loop = false

    // Functions

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    function GetTurnCounter() {
        var TurnCounter = document.getElementById('turn-counter')

        if (!TurnCounter) return

        return Number(TurnCounter.textContent.split(' ')[1].split('.')[0])
    }

    function PlaySound(sound) {
        if (!sound.paused) {
            sound.pause()
            sound.currentTime = 0
        }

        sound.play()
    }

    async function Main() {
        var PreviousTurns

        while (true) {

            var Turns = GetTurnCounter()

            if (Turns != PreviousTurns && Turns) {
                PreviousTurns = Turns

                for (let i = 1; i <= 4; i++) {
                    var New = (Turns + i) / 25

                    if (Math.floor(New) == New) {
                        PlaySound(WarningSound)
                    }
                }

                var NewX = Turns / 25
                if (Math.floor(NewX) == NewX || (Turns == 10 || Turns == 15)) {
                    PlaySound(TheSound)
                }
            }

            await sleep(10)
        }
    }

    // Main

    Main()
})();