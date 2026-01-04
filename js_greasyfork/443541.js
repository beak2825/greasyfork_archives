// ==UserScript==
// @name         Roblox Avatar Halo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Get a Halo on your avatar! (Only for main home screen)
// @author       You
// @match        https://www.roblox.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443541/Roblox%20Avatar%20Halo.user.js
// @updateURL https://update.greasyfork.org/scripts/443541/Roblox%20Avatar%20Halo.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const delay = ms => new Promise(res => setTimeout(res, ms));
    console.log("Waiting 2.5 seconds for avatar to load...");
    await delay(2500);
    const avatars = document.getElementsByClassName("thumbnail-2d-container avatar-card-image");
    const name = document.getElementsByClassName("user-name-container")[0];
    if (name.innerText == "focat") {
        name.innerText = "[Owner] focat";
    }
    console.log(avatars)
    const avatar = avatars[2]
    var node = document.createElement("div");
    node.style=`background-image: url('https://images-ext-1.discordapp.net/external/IWa5QOlhYp15646AgFdqdgDkbcqL7mki0PpPKqGMh20/https/tobeh.host/regsprites/holy.gif'); background-size: contain; position: absolute; left: -33%; top: -33%; width: 166%; height: 166%; z-index: 1;`
    avatar.appendChild(node);
})();