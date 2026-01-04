// ==UserScript==
// @name        Remove streak warning glow
// @namespace   https://github.com/luigiMinardi
// @match       https://www.boot.dev/lessons/*
// @grant       none
// @version     0.0.1
// @author      luigiMinardi
// @license     MIT
// @description Remove the red glow on your streak when you're with less than 8 hours from expiring it
// @homepageURL https://greasyfork.org/en/scripts/522018-remove-streak-warning-glow
// @downloadURL https://update.greasyfork.org/scripts/522018/Remove%20streak%20warning%20glow.user.js
// @updateURL https://update.greasyfork.org/scripts/522018/Remove%20streak%20warning%20glow.meta.js
// ==/UserScript==

function removeGlow() {
  // Grab element
  // If the selector breaks, right click the element > Developer Tools > Inspect, find the div on the HTML
  // right click it > Copy > Copy Selector, go to the Console
  // do a document.querySelector("paste here the selector you just copied")
  // remove all ":nth-child(1)", ".xl\:flex.xl\:flex-row" or any ":" css selectors that breaks the querySelector
  // when you are able to select the div correctly update here and you should have it working again after refresh
  let glowDiv = document.querySelector("#__nuxt > div > div.static-bgimage.bg-image-blue > div.h-full-minus-bar.flex > div.relative.h-full.flex-1.overflow-auto.align-top > div > div > div > div > div.flex.flex-none.items-center.justify-start.gap-2 > div.hidden.items-center.justify-start.gap-x-2 > div.flex.gap-1.rounded.bg-gray-750.px-2.py-1.box-shadow-glow-red");
  // Remove red from element.
  glowDiv.classList.remove("box-shadow-glow-red");
};

// Timeout of 2s to assert page is loaded
setTimeout(async () => {
  removeGlow();
},2000);

// Code to call function on page change
// This seem to refresh the page every time you move to a new one, so you may want to remove this part of the script
// Source: https://itsopensource.com/how-to-call-a-function-on-URL-change-in-javascript/#:~:text=Solution
(function(history){
    let pushState = history.pushState;
    history.pushState = function(state) {
      removeGlow();
      return pushState.apply(history, arguments);
    };
})(window.history);