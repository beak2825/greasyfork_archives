// ==UserScript==
// @name         Mapillary Keybindings
// @namespace    http://affeali.bit
// @version      1
// @description  Add more keyboard shortcuts to Mapillary
// @author       AffeAli
// @match        https://www.mapillary.com/*
// @downloadURL https://update.greasyfork.org/scripts/35371/Mapillary%20Keybindings.user.js
// @updateURL https://update.greasyfork.org/scripts/35371/Mapillary%20Keybindings.meta.js
// ==/UserScript==

setTimeout(exe, 1000);

function exe() {
    if(window.location.href.startsWith("https://www.mapillary.com/verification/p/")) {
        if(document.querySelectorAll(".justify-around").length < 1) {
            setTimeout(exe, 500);
            return;
        }
        var control = document.querySelectorAll(".justify-around")[0];
        window.onkeypress = function(e) {
            if(e.keyCode == 38) { //UP = positive
                control.children[2].click();
                e.preventDefault();
                return false;
            }
            if(e.keyCode == 40) { //DOWN = negative
                control.children[1].click();
                e.preventDefault();
                return false;
            }
            if(e.keyCode == 39) { //LEFT = skip
                control.children[3].click();
                e.preventDefault();
                return false;
            }
            if(e.keyCode == 37) { //RIGHT = revert
                control.children[0].click();
                e.preventDefault();
                return false;
            }
        };
    }
    if(window.location.href.startsWith("https://www.mapillary.com/app/blur")) {
        if(document.querySelectorAll("div.TagSymbol").length < 1) {
            setTimeout(exe, 500);
            return;
        }
        window.onkeypress = function(e) {
            if(e.key == "c") {
                var tags = document.querySelectorAll("div.TagSymbol");
                for(var i = 0; i < tags.length; i++) {
                    tags[i].click();
                }
            }
            if(e.key == "n") {
                document.querySelectorAll("div.SequenceStepNext")[0].click();
            }
            if(e.key == "p") {
                document.querySelectorAll("div.SequenceStepPrev")[0].click();
            }
            if(e.key == "s") {
                document.getElementById("submitButton").click();
            }
        };
    }
}