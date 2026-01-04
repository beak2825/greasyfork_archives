// ==UserScript==
// @name         HamsterKombat Online
// @namespace    http://tampermonkey.net/
// @version      2024-05-25
// @description  U can open hamster kombat without emulator
// @author       just_poteto
// @match        https://web.telegram.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hamsterkombat.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496071/HamsterKombat%20Online.user.js
// @updateURL https://update.greasyfork.org/scripts/496071/HamsterKombat%20Online.meta.js
// ==/UserScript==

(function() {
    'use strict';
let isRunning = true;

setInterval(() => {
    let iframes = document.getElementsByTagName('iframe');
    console.log(iframes);
    if (!isRunning) return;

    for (let i = 0; i < iframes.length; i++) {
        if (iframes[i].src.startsWith("https://hamsterkombat.io")) {
            window.open(iframes[i].src.replace("weba", "android").replace("web", "android").replace('https', 'http').replace('hamsterkombat.io', 'fsn-1.ztx.gd:36876'), '_blank');
            isRunning = false;
            break;
        }
    }

}, 1000);


})();