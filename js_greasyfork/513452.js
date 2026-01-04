// ==UserScript==
// @name         Arena Frag Changer Script (Client-side)
// @namespace    https://greasyfork.org/en/users/1353377-kingbelisariusiv
// @version      1.4
// @description  Change your Arena-Frag to any value you want without being a reaper or killing reapers in the Arena (Client-sided Visual)
// @author       King Belisarius IX
// @match        *://*.evoworld.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513452/Arena%20Frag%20Changer%20Script%20%28Client-side%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513452/Arena%20Frag%20Changer%20Script%20%28Client-side%29.meta.js
// ==/UserScript==
let x = Number(prompt("Pick a number to get it's Arena Frags"));
function e() {
game.me.arenaFrags = x;
}
setInterval(e,0)
console.log(`Updated arena frags for ${game.me.nick}: ${x}`);