// ==UserScript==
// @name        Volume slider for everynoise.com
// @namespace   https://greasyfork.org/users/1006736
// @match       https://everynoise.com/*
// @grant       GM.setValue
// @grant       GM.getValue
// @version     1.0
// @author      Haxton Sale
// @description Adds a simple volume slider to everynoise.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457617/Volume%20slider%20for%20everynoisecom.user.js
// @updateURL https://update.greasyfork.org/scripts/457617/Volume%20slider%20for%20everynoisecom.meta.js
// ==/UserScript==

/* jshint esversion:8 */

(async () => {
  const volume = await GM.getValue("volume", 100);

  const parent = document.createElement("div");
  parent.id = "volumeParent";

  const range = document.createElement("input");
  range.type = "range";
  range.id = "volumeSlider";
  range.min = 0;
  range.max = 100;
  range.value = volume;

  range.addEventListener("input", async (event) => {
    await GM.setValue("volume", event.target.value);
    document.getElementById('spotifyplayer').volume = event.target.value / 100;
  });

  let title = document.querySelector(".title");
  title.appendChild(parent);
  parent.appendChild(range);

  document.getElementById('spotifyplayer').volume = volume / 100;
})();