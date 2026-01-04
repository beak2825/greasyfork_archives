// ==UserScript==
// @name         Faster Minimap (Geoguessr)
// @namespace    alienperfect
// @version      1.3
// @description  Close map on hover faster
// @author       Alien Perfect
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=geoguessr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485963/Faster%20Minimap%20%28Geoguessr%29.user.js
// @updateURL https://update.greasyfork.org/scripts/485963/Faster%20Minimap%20%28Geoguessr%29.meta.js
// ==/UserScript==

"use strict";

let activeClass;

function main() {
  new MutationObserver(() => {
    const guessMap = document.querySelector(
      "[data-qa='guess-map']:not([data-skip])",
    );

    if (!guessMap) return;

    guessMap.setAttribute("data-skip", "");

    guessMap.addEventListener("mouseenter", () => {
      if (activeClass && !isPinned()) {
        guessMap.classList.add(activeClass);
      }
    });

    guessMap.addEventListener("mouseleave", () => {
      activeClass = guessMap.classList.item(guessMap.classList.length - 1);

      if (!isPinned()) {
        guessMap.classList.remove(activeClass);
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

main();
