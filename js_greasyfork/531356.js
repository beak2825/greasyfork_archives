// ==UserScript==
// @name        Auto-expanding text input areas
// @match       *://*/*
// @version     1.0
// @license     MIT
// @namespace   https://greasyfork.org/en/users/1436613-gosha305
// @author      gosha305
// @description Makes it so text input areas vertically expand to fit the size of the text you have put inside, making it easier to visualize what you have written in full.
// @downloadURL https://update.greasyfork.org/scripts/531356/Auto-expanding%20text%20input%20areas.user.js
// @updateURL https://update.greasyfork.org/scripts/531356/Auto-expanding%20text%20input%20areas.meta.js
// ==/UserScript==

function autoExpandTextareas() {
  if (document.querySelector("textarea:not(.autoExpandable)")) {
    document.querySelectorAll("textarea:not(.autoExpandable)").forEach((e) => {
      e.classList.add("autoExpandable");
      e.addEventListener("input", function () {
        e.style.height = "auto";
        e.style.height = e.scrollHeight + "px";
      });
    });
  }
}

window.onload = function () {
  autoExpandTextareas();
  new MutationObserver(autoExpandTextareas).observe(document.body, {
    childList: true,
    subtree: true,
  });
};