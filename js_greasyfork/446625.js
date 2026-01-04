// ==UserScript==
// @name         Cookie Clicker Hack
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  UNDETECTED | Get Tons Of Money In Cookie Clicker, Use Right Shift to open the menu. Now has WASD controls in the ascending menu. Top bar was removed.
// @author       Brenny#0001 | 1Brenny1
// @match        https://orteil.dashnet.org/cookieclicker/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashnet.org
// @grant        none
// @license     GNU
// @downloadURL https://update.greasyfork.org/scripts/446625/Cookie%20Clicker%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/446625/Cookie%20Clicker%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        Game.bakeryNameSet("Hacked Bakery");
        var TopBar = document.getElementById("topBar")
        TopBar.remove()
        Game.grandmaNames = ["1Brenny1","Brenny#0001","Hacked"]
    },5000)

    var X = 0
    var Y = 0
    var Multiplier = 0
    var AutoClicker = false
    var Clicker
    var Multi

    function KeyDown(){
    var KeyCode = event.code;

        if (KeyCode == "KeyW"){
            Y = 1
        } else if (KeyCode == "KeyS") {
            Y = -1
        } else if (KeyCode == "KeyA") {
            X = 1
        } else if (KeyCode == "KeyD") {
            X = -1
        }

        if (KeyCode == "ShiftRight") {
            var Mode = prompt("Which value do you want to modify? (Cookies or sugar lumps or Multiplier, Auto Clicker)").toLowerCase()
            if (Mode == "cookie" || Mode == "cookies"){
                try {
                    var Amnt = parseInt(prompt("How many cookies do you want added?"))
                    if (!Number.isNaN(Amnt)){
                        Game.Earn(Amnt)
                        alert(Amnt + " Cookies have been added to your account")
                    }
                } catch {
                    alert("Input is not a valid integer")
                }
            } else if (Mode == "lumps" || Mode == "sugar" || Mode == "sugar lump" || Mode == "sugar lumps") {
                try {
                    var Amnt = parseInt(prompt("How many sugar lumps do you want added?"))
                    if (!Number.isNaN(Amnt)) {
                        Game.lumps = Game.lumps + Amnt
                        alert(Amnt + " Sugar lumps have been added to your account")
                    }
                } catch {
                    alert("Input is not a valid integer")
                }
            } else if (Mode == "multiplier") {
                try {
                    var Amnt = parseInt(prompt("What do you want your multiplier to be?"))
                    Multiplier = Amnt
                } catch {
                    alert("Input is not a valid integer")
                }

                if (Multiplier > 0) {
                    Multi = setInterval(function(){
                        Game.gainBuff('frenzy', 0.1, Multiplier)
                        Game.gainBuff('click frenzy', 0.1, Multiplier)
                    },100)
                }
                if (Multiplier == 0) {
                    clearInterval(Multi)
                }
            } else if (Mode == "auto clicker" || Mode == "auto" || Mode == "clicker") {
                AutoClicker = !AutoClicker
                if (AutoClicker) {
                    alert("Auto Clicker Enabled")
                    Clicker = setInterval(function(){
                        Game.ClickCookie()
                    },0)
                } else {
                    alert("Auto Clicker Disabled")
                    clearInterval(Clicker)
                }
            }
        }
    }
    function KeyUp(){
        var KeyCode = event.code
        if (KeyCode == "KeyW"){
            Y = 0
        } else if (KeyCode == "KeyS") {
            Y = 0
        } else if (KeyCode == "KeyA") {
            X = 0
        } else if (KeyCode == "KeyD") {
            X = 0
        }
    }

    window.addEventListener('keydown', KeyDown, true);
    window.addEventListener('keyup',KeyUp,true);

    setInterval(function(){
        Game.AscendOffXT += X * 1
        Game.AscendOffYT += Y * 1
        try {var GameWindow = document.getElementById("game"); GameWindow.styles.onWeb.top = "0px"} catch {}
        document.title = "Hacked Cookie Clicker"
    },1);
})();