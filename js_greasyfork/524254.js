// ==UserScript== 
// @name         GeoGuessr Quick Map
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Instant Map opening when hovering over it
// @author       kaya
// @match        https://www.geoguessr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524254/GeoGuessr%20Quick%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/524254/GeoGuessr%20Quick%20Map.meta.js
// ==/UserScript==

let activeClass;

function main1() {
  new MutationObserver(() => {
    const guessMap = document.querySelector(
      "[data-qa='guess-map']:not([data-skip])",
    );

    if (!guessMap) return;

    guessMap.setAttribute("data-skip", "");

    guessMap.addEventListener("mouseenter", () => {
      if (activeClass && !isPinned()) {
        guessMap.classList.add(activeClass);
        playWhooshSound();
      }
    });

    guessMap.addEventListener("mouseleave", () => {
      activeClass = guessMap.classList.item(guessMap.classList.length - 1);
      if (!isPinned()) {
        guessMap.classList.remove(activeClass);
        playWhooshSound();
      }
    });
  }).observe(document.body, { childList: true, subtree: true });
}

function isPinned() {
  const pinButton = document.querySelector(
    "[data-qa='guess-map__control--sticky-active']",
  );

  let pinned;

  if (pinButton) {
    pinButton.classList.forEach((cls) => {
      if (cls.includes("Active")) {
        pinned = true;
      }
    });
  }

  return pinned;
}

main1();