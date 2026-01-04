// ==UserScript==
// @name        BINGO FISHIES
// @namespace   Violentmonkey Scripts
// @match       https://www.destiny.gg/bigscreen*
// @grant       none
// @version     1.24.04.03.0
// @author      mif
// @license     MIT
// @description BINGO WITH FISHIES
// @downloadURL https://update.greasyfork.org/scripts/491570/BINGO%20FISHIES.user.js
// @updateURL https://update.greasyfork.org/scripts/491570/BINGO%20FISHIES.meta.js
// ==/UserScript==


const FISHIES = 1;
const BINGO = "https://bingobaker.com/#660d7365d80528f6";

if (document.readyState !== "loading") { // Abathur
  injectScript();
} else { // Wait for page to load I think FeelsDankMan
  document.addEventListener("DOMContentLoaded", injectScript);
}

function injectScript() {
  // Get parent (navbar)
  let target_element = document.querySelector('#collapsemenu > ul.navbar-nav.me-auto')

  // FISHIES
  let custom_thing = document.createElement("img");
  custom_thing.src = "https://cdn.destiny.gg/emotes/660a76abae9df.gif"

  // Make the bingo part
  let bingo_thing = document.createElement("a");
  bingo_thing.href = BINGO;
  bingo_thing.align = "center";
  bingo_thing.innerHTML="Daily BINGO";
  bingo_thing.className="nav-link";

  // Display elements
  for(var fish=0; fish < FISHIES; fish++){
    target_element.appendChild(custom_thing.cloneNode(true));
  }
  target_element.appendChild(bingo_thing.cloneNode(true));
  for(var fish=0; fish < FISHIES; fish++){
    target_element.appendChild(custom_thing.cloneNode(true));
  }
}
