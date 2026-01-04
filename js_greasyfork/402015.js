// ==UserScript==
// @name         Wilds.io autoshoot
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  press Z to toggle, X and C to increase or decrease the interval
// @author       You
// @match        wilds.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402015/Wildsio%20autoshoot.user.js
// @updateURL https://update.greasyfork.org/scripts/402015/Wildsio%20autoshoot.meta.js
// ==/UserScript==

(function() {
    window.shooting = false;
    window.interval= 100;
    window.txt = "";
    window.messages = [];

    function x() {
        setTimeout(function(){
            if (!shooting){return}
            if (CLIENT.Game.player.charged >= 1.0) {
                CLIENT.Game.send("release")
            } else if (CLIENT.Game.player.charged <= 0.1) {
                CLIENT.Game.send("press")
            }
            setTimeout(x, interval)
        },interval)
    }

    var customControls = {
        z: "toggleAuto",
        x: "increaseAutoShootInterval",
        c: "decreaseAutoShootInterval"
    }

    let original = UI.Console.prototype.say;
    UI.Console.prototype.say = function(...args) {
        original.bind(app.console, ...args)()
        messages.push([...args])
    }

    function customBinder(e) {
        try {
            if (CLIENT.Game.$textinput[0].style.display !== "none") {
                return;
            }
        } catch(e){return;}
        switch (customControls[e.key]) {
            case "toggleAuto":
                shooting = !shooting;
                txt = "toggleAuto: " + shooting;
                if (shooting) {x()}
                break;
            case "increaseAutoShootInterval":
                interval = interval > 10000 ? 10000 : interval + 50;
                txt = "increaseAutoShootInterval: " + interval;
                break;
            case "decreaseAutoShootInterval":
                interval = interval < 100 ? 50 : interval - 50;
                txt = "increaseAutoShootInterval: " + interval;
                break;
            default:
                break;
        }
        if (txt) {
            console.log(txt);
            app.console.say(txt);
            txt = "";
        }
        document.getElementById("zoomOut").style.display = "";
        document.getElementById("zoomIn").style.display = "";
    }
    document.addEventListener("keydown", customBinder);
})();