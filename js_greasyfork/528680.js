// ==UserScript==
// @name         torn.com No dark text in forum
// @namespace    xentac
// @version      20251216.2
// @description  torn.com No Dark Text - Removes all dark text in the forum, so it's readable in dark mode
// @author       xentac [3354782]
// @match        *.torn.com/forums.php*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528680/torncom%20No%20dark%20text%20in%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/528680/torncom%20No%20dark%20text%20in%20forum.meta.js
// ==/UserScript==

"use strict";

function removeDarkStyling(node) {
  //console.log(node);
  if (node.querySelectorAll) {
    var spans = node.querySelectorAll(".post span");

    for (var i = 0; i < spans.length; i++) {
      const elem = spans[i];
      // TODO: Write a better color parser. Everything below a certain RGB value should be nulled
      if (elem.style.color == "rgb(51, 51, 51)") {
        elem.style.color = null;
      } else if (elem.style.color == "rgb(34, 34, 34)") {
        elem.style.color = null;
      } else if (elem.style.color == "var(--te-text-color-gray5)") {
        elem.style.color = null;
      } else if (elem.style.color == "rgb(0, 0, 0)") {
        elem.style.color = null;
      } else if (elem.style.color == "black") {
        elem.style.color = null;
      }
    }
  }
}

function react(mutation) {
  mutation.addedNodes.forEach(removeDarkStyling);
}

function reactAll(mutations) {
  mutations.forEach(react);
}

(function () {
  const target = document.querySelector("#forums-page-wrap");
  removeDarkStyling(target);
  const observer = new MutationObserver(reactAll);
  observer.observe(target, { childList: true, subtree: true });
  //observer.disconnect();
})();
