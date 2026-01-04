// ==UserScript==
// @name         survivadblock
// @namespace    http://tampermonkey.net/
// @version      2.011
// @description  AD Block
// @author       How to ?
// @match        http://surviv.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40431/survivadblock.user.js
// @updateURL https://update.greasyfork.org/scripts/40431/survivadblock.meta.js
// ==/UserScript==

setTimeout(function() {
var d = document;
//removes stuff
d.getElementById("ad-block-main-med-rect").remove();
d.getElementById("start-top-left").remove();
d.getElementById("ad-block-main-leader-bot").remove();
d.getElementById("social-share-block").remove();
d.getElementById("start-top-right").remove();
d.getElementById("start-bottom-left").remove();
d.getElementById("news").style.color = "yellow";
d.getElementById("start-help").style.color = "yellow";
}, 0);