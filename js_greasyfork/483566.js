// ==UserScript==
// @name         scroll
// @description  turn off spacebar scroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       peanutakie
// @match        https://sploop.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483566/scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/483566/scroll.meta.js
// ==/UserScript==

const hatMenu = document.querySelector("#hat-menu");

window.addEventListener("keydown", onWindowKeyDown);

function onWindowKeyDown(e) {
  if (e.which == 32 && hatMenu.style.display == "flex"){ e.preventDefault(); }
};