// ==UserScript==
// @name        FISHIES - destiny.gg
// @namespace   Violentmonkey Scripts
// @match       https://www.destiny.gg/bigscreen
// @grant       none
// @version     1.0
// @author      mif
// @license     MIT
// @description Permanent FISHIES FeelsOkayMan
// @downloadURL https://update.greasyfork.org/scripts/491550/FISHIES%20-%20destinygg.user.js
// @updateURL https://update.greasyfork.org/scripts/491550/FISHIES%20-%20destinygg.meta.js
// ==/UserScript==


const FISHIES = 5;

if (document.readyState !== "loading") {
  // console.log("111")
  injectScript();
} else {
  // console.log("222")
  document.addEventListener("DOMContentLoaded", injectScript);
}

function injectScript() {
  // console.log("333")
  let target_element = document.querySelector('#collapsemenu > ul.navbar-nav.me-auto')
  let custom_thing = document.createElement("img");
  custom_thing.src = "https://cdn.destiny.gg/emotes/660a76abae9df.gif"
  for(var fish=0; fish < FISHIES; fish++){
    target_element.appendChild(custom_thing.cloneNode(true));
  }
}
