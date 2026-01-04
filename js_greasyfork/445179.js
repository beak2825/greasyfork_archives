// ==UserScript==
// @name         Hide live followed channels that are playing Slots
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide live followed channels that are playing Slots, will show them again when they're not playing Slots anymore.
// @author       lifeAnime / Yhria
// @match        https://*.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445179/Hide%20live%20followed%20channels%20that%20are%20playing%20Slots.user.js
// @updateURL https://update.greasyfork.org/scripts/445179/Hide%20live%20followed%20channels%20that%20are%20playing%20Slots.meta.js
// ==/UserScript==

let passed = 0;

let myTimeout = setTimeout(function () {
    // execute script
    let followed_live = document.getElementsByClassName("Layout-sc-nxg1ff-0 blhocS");

    passed++;
    for (let element of followed_live){
        clearTimeout(myTimeout)
        console.log(element.getElementsByClassName("CoreText-sc-cpl358-0 ciPVTQ")[0].textContent," == ", "Slots ?", element.getElementsByClassName("CoreText-sc-cpl358-0 ciPVTQ")[0].textContent == "Slots");
        if (element.getElementsByClassName("CoreText-sc-cpl358-0 ciPVTQ")[0].textContent == "Slots"){
            element.parentElement.remove();
        }
    }
    if (passed > 6){
        clearTimeout(myTimeout)}
  }, 2000); //2000 = 2000ms = 2s