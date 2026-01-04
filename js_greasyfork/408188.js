// ==UserScript==
// @name         madman
// @namespace    http://tampermonkey.net/
// @version      69
// @description  no u
// @author       idk
// @match        https://diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408188/madman.user.js
// @updateURL https://update.greasyfork.org/scripts/408188/madman.meta.js
// ==/UserScript==

var ctx = document.getElementById("canvas").getContext("2d");
var madman = new Image();
madman.src = "https://cdn.discordapp.com/emojis/358731954654281760.png?v=1"
ctx.arc = function(x, y, r) { ctx.drawImage(madman, x - r, y - r, r * 2, r * 2); }