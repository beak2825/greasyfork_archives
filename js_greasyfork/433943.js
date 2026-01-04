// ==UserScript==
// @name         Glar Autohat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  An auto interval hat switcher for glar.io
// @author       flancast90
// @match        *://glar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433943/Glar%20Autohat.user.js
// @updateURL https://update.greasyfork.org/scripts/433943/Glar%20Autohat.meta.js
// ==/UserScript==


var pressed = false
var i = 0
var hats;

if (window.location.href == 'http://glar.io/') {
    window.location.href = "http://glar.io/?game=eyJpcCI6InBob2VuaXguZ2xhci5pbyIsInBvcnQiOjUwMDAsInNzbCI6ZmFsc2UsImlkIjoxfQ"
}else {
    if (window.location.href == "http://glar.io/?game=eyJpcCI6InBob2VuaXguZ2xhci5pbyIsInBvcnQiOjUwMDAsInNzbCI6ZmFsc2UsImlkIjoxfQ") {
        document.addEventListener("keydown", function(e) {
            if (e.keyCode == 81) {
                if (pressed == false) {
                    document.getElementById("ui-hat-list-container").style.left = "-1000px";
                    hats = setInterval(change_hat, 500);
                    pressed = true;
                } else {
                    document.getElementById("ui-hat-list-container").style.left = "50%";
                    clearInterval(hats);
                    pressed = false;
                }
            }
        });

        function change_hat() {
            var len = document.getElementsByClassName('ui-hat-list-item').length;
            if (i < len) {
                document.getElementsByClassName('ui-hat-list-item')[i].click();
                i++;
            } else {
                i = 0;
            }
        }
    }else {
        document.write("Access Error: Hack Banned Except for on Extreme Server.")
    }
}