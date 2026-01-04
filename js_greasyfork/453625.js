// ==UserScript==
// @name        9anime.to Speed Switcher
// @namespace   Violentmonkey Scripts
// @match       https://vidstream.pro/embed/*
// @grant       none
// @version     1.0
// @author      DanielLambert
// @license     MIT
// @description Allows custom speeds to be added to the vid player.
// @downloadURL https://update.greasyfork.org/scripts/453625/9animeto%20Speed%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/453625/9animeto%20Speed%20Switcher.meta.js
// ==/UserScript==

// Only works for the Vidstream servers for now.

function setup(ml, o) {
  const video = document.querySelector(".jw-video.jw-reset");
  const speedOptions = document.querySelector("#jw-settings-submenu-playbackRates > div:nth-child(1)");
  function addCustomSpeedOptions(...speeds) {
    speeds.forEach(x => {
      speedOptions.insertAdjacentHTML("beforeend", `<button type="button" class="jw-reset-text jw-settings-content-item" aria-label="${x}x" role="menuitem" aria-checked="false" dir="auto" style="color: yellow" onclick="document.querySelector('.jw-video.jw-reset').playbackRate = ${x}">${x}x</button>`);
    });
  }
  if (speedOptions.childElementCount === 5) {
    o.disconnect();
    addCustomSpeedOptions(3, 4, 5, 5.5, 6.5, 33); // Add new speeds here.
  }
}

const observer = new MutationObserver(setup);
observer.observe(document.body, {childList: true, subtree: true});
