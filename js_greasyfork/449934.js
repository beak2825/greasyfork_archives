// ==UserScript==
// @name        Simple hotkeys
// @namespace   Violentmonkey Scripts
// @match       https://e621.net/posts/*
// @grant       none
// @version     1.0.1
// @author      Nopeee
// @license     MIT
// @description 8/20/2022, 9:21:15 PM
// @downloadURL https://update.greasyfork.org/scripts/449934/Simple%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/449934/Simple%20hotkeys.meta.js
// ==/UserScript==




var base = location.origin;

function main () {
  
  document.addEventListener("keydown", function(event) {
    event.keyCode == 39 ? window.location = base + [...document.getElementsByClassName("next")][0].getAttribute("href") : null; // next
  });
    document.addEventListener("keydown", function(event) {
    event.keyCode == 37 ? window.location = base + [...document.getElementsByClassName("prev")][0].getAttribute("href") : null; // back
  });
 
}
 
main();