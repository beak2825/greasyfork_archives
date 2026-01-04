// ==UserScript==
// @name         evoworld.io Hotkeys
// @name:ru      evoworld.io Горячие клавишы
// @namespace    http://tampermonkey.net/
// @version      1
// @author       @jmatg1
// @match        https://evoworld.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evoworld.io
// @grant        none
// @description "evoworld.io Hotkeys"
// @description:ru "evoworld.io Горячие клавишы
// @contributionURL https://www.donationalerts.com/r/jmatg1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478061/evoworldio%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/478061/evoworldio%20Hotkeys.meta.js
// ==/UserScript==
(function () {

    document.body.onkeydown = function (e) {
        if (e.shiftKey && joinedGame && !imDead) {
            boost();
        }

        if ((e.code === 'KeyS' || e.code === 'ArrowDown') && joinedGame && !imDead) {
            skillUse()
        }
    }
    document.body.onkeyup = function (e) {
        if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
            if (joinedGame && imDead) {
                playAgain();
            }
        }
        if ((e.code === 'KeyS' || e.code === 'ArrowDown') && joinedGame && !imDead) {
            skillStop();
        }
        if (e.keyCode == 81) {
            if (joinedGame && !imDead) {
                sendEmote(1); // dislike
            }
        }
        if (e.keyCode == 69) {
            if (joinedGame && !imDead) {
                sendEmote(10); // haha
            }
        }
        if (e.keyCode == 51) {
            if (joinedGame && !imDead) {
                sendEmote(4); // Broken Heart
            }
        }
        if (e.keyCode == 52) {
            if (joinedGame && !imDead) {
                sendEmote(11); // heart
            }
        }
        if (e.keyCode == 82) {
            if (joinedGame && !imDead) {
                sendEmote(1); // dislike
            }
        }
        if (e.keyCode == 84) {
            if (joinedGame && !imDead) {
                sendChat(29); // rats
            }
        }
        if (e.keyCode == 76) {
            if (joinedGame && !imDead) {
                askForDiscord(1); // discord
            }
        }
        if (e.keyCode == 67) {
            if (joinedGame && !imDead) {
                sendChat(22); // fight
            }
        }
        if (e.keyCode == 88) {
            if (joinedGame && !imDead) {
                sendChat(3); // goodbye
            }
        }
        if (e.keyCode == 90) {
            if (joinedGame && !imDead) {
                sendChat(14); // funny
            }
        }
        if (e.keyCode == 86) {
            if (joinedGame && !imDead) {
                sendChat(39); // come
            }
        }
        if (e.keyCode == 70) {
            if (joinedGame && !imDead) {
                sendChat(38); // wait
            }
        }
        if (e.keyCode == 53) {
            if (joinedGame && !imDead) {
                sendEmote(2); // sadsmile
            }
        }
        if (e.keyCode == 54) {
            if (joinedGame && !imDead) {
                sendEmote(13); // goodbye2
            }
        }
        if (e.keyCode == 55) {
            if (joinedGame && !imDead) {
                sendEmote(7); // angry
            }
        }
        if (e.keyCode == 56) {
            if (joinedGame && !imDead) {
                sendEmote(6); // cry
            }
        }
        if (e.keyCode == 57) {
            if (joinedGame && !imDead) {
                sendEmote(5); // dislike
            }
        }
        if (e.keyCode == 48) {
            if (joinedGame && !imDead) {
                sendEmote(3); // killme
            }
        }
        if (e.keyCode == 71) {
            if (joinedGame && !imDead) {
                sendChat(15); // lol
            }
        }
        if (e.keyCode == 30) {
            if (joinedGame && !imDead) {
                sendChat(40); // forget
            }
        }
    }


})();