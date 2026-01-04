// ==UserScript==
// @name     Youtube Music Continue Watching Auto-Confirmer
// @namespace Youtube Music Continue Watching Auto-Confirmer
// @description  Automatically clicks 'Ok' when the 'Video paused. Continue watching?' dialogue pops up.
// @version  1
// @match https://music.youtube.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/422978/Youtube%20Music%20Continue%20Watching%20Auto-Confirmer.user.js
// @updateURL https://update.greasyfork.org/scripts/422978/Youtube%20Music%20Continue%20Watching%20Auto-Confirmer.meta.js
// ==/UserScript==

setInterval( function() {
    for (let possiblePopUpMatch of document.getElementsByClassName('text style-scope ytmusic-you-there-renderer' )) {
        if (possiblePopUpMatch.innerText === "Video paused. Continue watching?") {
            possiblePopUpMatch.parentNode.querySelector("#button").click();
            console.log("Skiped Listning Prompt")
        }
    }
}, 100);
console.log("Youtube Music Continue Watching Auto-Comfirmer")