// ==UserScript==
// @name         LSD for bloxd (bloxd.io)
// @version      1.0
// @description  LSD for bloxd.io
// @author       Quazut
// @match        *://bloxd.io/*
// @match        *://staging.bloxd.io/*
// @match        *://bloxdhop.io/*
// @match        *://bloxdk12.com/*
// @match        *://doodlecube.io/*
// @match        *://eviltower.io/*
// @match        *://1219647973806571553.discordsays.com/*
// @license      GPL-3.0-only
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/522631/LSD%20for%20bloxd%20%28bloxdio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522631/LSD%20for%20bloxd%20%28bloxdio%29.meta.js
// ==/UserScript==
let rotation = 0;
function lsd() {
  if(document.querySelector("#noa-container")) {document.querySelector("#noa-container").style.filter = `hue-rotate(${rotation += 6}deg)`;}
  requestAnimationFrame(lsd);
}
requestAnimationFrame(lsd);