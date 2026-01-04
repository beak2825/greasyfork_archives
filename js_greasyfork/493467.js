// ==UserScript==
// @name         Auto Next Round (Geoguessr)
// @namespace    alienperfect
// @version      1.3
// @description  Takes you to the next round immediately after guessing.
// @author       Alien Perfect
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=geoguessr.com
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/493467/Auto%20Next%20Round%20%28Geoguessr%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493467/Auto%20Next%20Round%20%28Geoguessr%29.meta.js
// ==/UserScript==

"use strict";

// Replace the value between the quotes if you want to use a different key.
const HOTKEY = "`";

function toggleScript() {
  const enabled = GM_getValue("enabled");

  if (enabled === false) {
    GM_setValue("enabled", true);
    return alert("Auto Next Round on");
  }

  GM_setValue("enabled", false);
  return alert("Auto Next Round off");
}

function onKey(e) {
  if (e.key === HOTKEY) toggleScript();
}

function main() {
  window.addEventListener("keydown", onKey);

  new MutationObserver(() => {
    if (
      !(
        location.pathname.includes("/game/") ||
        location.pathname.includes("/challenge/")
      )
    )
      return;

    const enabled = GM_getValue("enabled", true);
    const nextButton = document.querySelector("[data-qa='close-round-result']");

    if (enabled && nextButton) nextButton.click();
  }).observe(document.body, { childList: true, subtree: true });
}

main();
