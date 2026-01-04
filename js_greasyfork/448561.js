// ==UserScript==
// @name        Remove Recommendations Turn Off Autoplay For Youtube
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch
// @grant       none
// @version     1.4
// @license MIT
// @author      DanielLambert
// @description This removes the recommendations and turns off autoplay when they appear.
// @downloadURL https://update.greasyfork.org/scripts/448561/Remove%20Recommendations%20Turn%20Off%20Autoplay%20For%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/448561/Remove%20Recommendations%20Turn%20Off%20Autoplay%20For%20Youtube.meta.js
// ==/UserScript==

function removeRecommendations(mutationList, observer) {
  const related = document.querySelector("#related");
  const endScreen = document.querySelector(".ytp-endscreen-content");
  const autoPlay = document.querySelector(".ytp-right-controls > button:nth-child(6)");
  
  related?.remove();
  endScreen?.remove();
  if (autoPlay?.title.endsWith("on")) autoPlay.click();
}

const observer = new MutationObserver(removeRecommendations);
observer.observe(document.body, {childList: true, subtree: true});
setTimeout(() => observer.disconnect(), 5000);
