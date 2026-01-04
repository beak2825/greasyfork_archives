// ==UserScript==
// @name         Sync Play
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sync Play: Netflix
// @author       Will
// @match        https://www.netflix.com/watch/*
// @grant        none
// @iconURL      https://cdn4.iconfinder.com/data/icons/32_Pixel_Social_Media_Icons_by_leslienayibe/netflix.png
// @downloadURL https://update.greasyfork.org/scripts/397166/Sync%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/397166/Sync%20Play.meta.js
// ==/UserScript==

console.log("Sync Play");

function netflix_play() {
    var b = document.querySelector("button.button-nfplayerPlay");
    b.click();
}

window.onkeypress = function (evt) { // document.onkeypress doesn't seem to work on Facebook and Tampermonkey
    if (evt.keyCode == 83) { // 83 = S
        var t = Date.now();
        var to = t % (3*1000);
        setTimeout(netflix_play, to); // try again in 300 millisecondsb.click();
    }
}