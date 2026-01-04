// ==UserScript==
// @author      Tobias Becker
// @name        NoHeisePlus
// @description Remove Heise+ links
// @match       https://www.heise.de/*
// @version     1
// @grant       none
// @namespace   https://cmdq.org/greasemonkey/NoHeisePlus
// @downloadURL https://update.greasyfork.org/scripts/425624/NoHeisePlus.user.js
// @updateURL https://update.greasyfork.org/scripts/425624/NoHeisePlus.meta.js
// ==/UserScript==

walkUp = function(element) {
  if (element === null) {
    return element;
  }
  if (element.nodeName === "ARTICLE") {
    return element;
  }
  return walkUp(element.parentElement);
};


// Start from the logos as seeds:
logos = document.getElementsByClassName("heiseplus-logo-small");

// Go up to the blocks.
blocks = new Set();
for (const elm of logos) {
  parent = walkUp(elm);
  if (parent !== null) {
    blocks.add(parent);
  }
}

// Now remove all unique ones.
for (const block of blocks) {
  block.remove();
}

// And lastly that remaining empty stage:
for (const stage of document.getElementsByClassName("stage--heiseplus")) {
  stage.remove();
}
