// ==UserScript==
// @name         Adige improver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Beautify ladige
// @author       You
// @match        http://*.ladige.it/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371053/Adige%20improver.user.js
// @updateURL https://update.greasyfork.org/scripts/371053/Adige%20improver.meta.js
// ==/UserScript==

function beautify() {
    'use strict';

    var dialogs = document.getElementsByClassName("ui-dialog");
    for(let i in dialogs) {
        if (dialogs[i] && dialogs[i].style)
            dialogs[i].style.display = "none";
    }
    var overlays = document.getElementsByClassName("ui-widget-overlay");
    for(let i in overlays) {
        if (overlays[i] && overlays[i].style)
            overlays[i].style.display = "none";
    }
}

setInterval(beautify, 1000);