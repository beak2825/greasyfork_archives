// ==UserScript==
// @name         AIS
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Period to skip forward, comma to skip backward (cause why not), slash to edit keybinds and skip time. Works only on HTML5 videos for now.
// @author       jaek#9509
// @match        https://twist.moe/a/*/*
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/370511/AIS.user.js
// @updateURL https://update.greasyfork.org/scripts/370511/AIS.meta.js
// ==/UserScript==

(async function() {
    'use strict;'

    var get = GM.getValue;
    var set = GM.setValue
    var skipTime = await get("skipTime", 85);
    var forwardKey = await get("forwardKey", 190);
    var backKey = await get("backKey", 188);
    var editKey = 191
    document.addEventListener("keydown", function(e){
        var vid = document.getElementsByTagName("video")[0];
        switch(e.keyCode){
            case forwardKey:
                vid.currentTime += skipTime;
                break;
            case backKey:
                vid.currentTime -= skipTime;
                break;
            case editKey:
                skipTime = Number(prompt("How much time to skip?", skipTime) || skipTime);
                forwardKey = Number(prompt("Key code for skipping forward? (Use keycode.info if you don't know what keycodes are)", forwardKey) || forwardKey);
                backKey = Number(prompt("Key code for skipping backward? (keycode.info for info)", backKey) || backKey);
                set("skipTime", skipTime);
                set("forwardKey", forwardKey);
                set("backKey", backKey);
                break;
            default: return;
        }
    e.preventDefault()
    });
})();
