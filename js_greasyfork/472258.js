// ==UserScript==
// @name         Geni Auto Expand Bio
// @namespace    4525639+rautava@users.noreply.github.com
// @version      1.5
// @description  Expand Bio sections automatically.
// @author       Tommi Rautava
// @license      CC0-1.0
// @match        https://www.geni.com/people/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geni.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472258/Geni%20Auto%20Expand%20Bio.user.js
// @updateURL https://update.greasyfork.org/scripts/472258/Geni%20Auto%20Expand%20Bio.meta.js
// ==/UserScript==

let LOOP_INTERVAL = 300;
let MAX_LOOP_COUNT = 20;
let loopCount = 0;

function clickBioAnchor() {
  "use strict";

  let readMoreElem = document.querySelector('a.toggle_link[id^="bio_"]');

  if (readMoreElem) {
    readMoreElem.click();
  }
}

function clickToShowMoreChildren() {
  let moreChildrenXpath = '//tr[@id="family_handprint"]//span[@style="display: inline;" or not(@style)]/a[@href="#"]';
  let moreChildrenResult = document.evaluate(moreChildrenXpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
  let node;

  while (node = moreChildrenResult.iterateNext()) {
    node.click();
  }
}

function waitForBioAnchor(selector) {
  if (document.querySelector('a.toggle_link[id^="bio_"]')) {
    clickBioAnchor();
  } else {
    loopCount++;

    if (loopCount <= MAX_LOOP_COUNT) {
      setTimeout(waitForBioAnchor, LOOP_INTERVAL);
    } else {
      console.warn("Timeout");
    }
  }
}

(function () {
  waitForBioAnchor();
  clickToShowMoreChildren();
})();
