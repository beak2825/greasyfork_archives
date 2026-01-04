// ==UserScript==
// @name         Activities Numbered (Geoguessr)
// @namespace    alienperfect
// @version      1.2
// @description  Shows the number of played games in activities.
// @author       Alien Perfect
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=geoguessr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507921/Activities%20Numbered%20%28Geoguessr%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507921/Activities%20Numbered%20%28Geoguessr%29.meta.js
// ==/UserScript==

"use strict";

function main() {
  new MutationObserver(() => {
    if (window.location.pathname !== "/me/activities") return;
    showNumbers();
  }).observe(document.body, { childList: true, subtree: true });
}

function showNumbers() {
  const activities = document.querySelectorAll(
    "[class*='activities_entries__']:not([data-skip])",
  );

  if (!activities) return;

  Array.from(activities).forEach((node) => {
    const expandButton = node.parentNode.querySelector(
      "[class*='activities_expandButtonWrapper__']",
    );

    if (!expandButton) return;

    expandButton.prepend(
      createNumDiv(node.childNodes.length),
    );

    node.setAttribute("data-skip", "");
  });
}

function createNumDiv(length) {
  const div = document.createElement("div");

  div.textContent = `(${length})`;
  div.style.margin = "1rem";

  return div;
}

main();
