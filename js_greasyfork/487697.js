// ==UserScript==
// @name         Bonk online friends on top
// @version      1.0
// @author       Salama
// @description  Makes online friends appear on top of the friend list
// @match        https://*.bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @license      MIT
// @supportURL   https://discord.gg/Dj6usq7ww3
// @namespace    https://greasyfork.org/users/824888
// @downloadURL https://update.greasyfork.org/scripts/487697/Bonk%20online%20friends%20on%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/487697/Bonk%20online%20friends%20on%20top.meta.js
// ==/UserScript==

let friends = document.getElementById("friends_scrollcontainer");
friends.insertBefore(document.getElementById("friends_online_table"), friends.children[0]);
friends.insertBefore(document.getElementById("friends_title_online"), friends.children[0]);
console.log("Made online friends appear on top of the friend list")