// ==UserScript==
// @name         Toggle chat keybind
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Toggle chat on/off on geoguessr to move fast when pin has been placed
// @author       Lemson
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491798/Toggle%20chat%20keybind.user.js
// @updateURL https://update.greasyfork.org/scripts/491798/Toggle%20chat%20keybind.meta.js
// ==/UserScript==

document.addEventListener("keypress", (e) => {
    if(e.key === "b") {
        const chatEnabled = localStorage.getItem("__GEOGUESSR_EMOTES_ENABLED__") === "true";

        if(chatEnabled) {
            localStorage.setItem("__GEOGUESSR_EMOTES_ENABLED__", "false");
            console.log("Turned chat off");
        } else {
            localStorage.setItem("__GEOGUESSR_EMOTES_ENABLED__", "true");
            console.log("Turned chat on");
        }
    }
});
