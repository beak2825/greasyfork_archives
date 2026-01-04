// ==UserScript==
// @name         Hitbox Anti Blackscreen
// @namespace    http://tampermonkey.net/
// @version      v1.0.0
// @description  Removes blackscreen, tell me if it doesn't work.
// @author       iNeonz
// @match        https://hitbox.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hitbox.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501805/Hitbox%20Anti%20Blackscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/501805/Hitbox%20Anti%20Blackscreen.meta.js
// ==/UserScript==

setInterval(() => {
    let block = document.querySelector("#appContainer > div.blocker");
    if (block){
     console.log(block);
     block.remove();
    }// Simple loop that removes blackscreen
},1000);