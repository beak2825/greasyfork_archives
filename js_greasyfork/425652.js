// ==UserScript==
// @name         Remove Replay
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a button to delete bonk menu replay.
// @author       MYTH_doglover
// @match        https://bonk.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425652/Remove%20Replay.user.js
// @updateURL https://update.greasyfork.org/scripts/425652/Remove%20Replay.meta.js
// ==/UserScript==

let replaydelete = document.createElement("div");
replaydelete.classList.add("brownButton");
replaydelete.classList.add("brownButton_classic");
replaydelete.classList.add("buttonShadow");
replaydelete.innerHTML = "REPLAY OFF";

replaydelete.onclick = function () {
let myobj = document.getElementById("bgreplay");
myobj.remove();
}

let headthing = document.getElementById("settings_filterprofanity_label");
headthing.appendChild (replaydelete);
