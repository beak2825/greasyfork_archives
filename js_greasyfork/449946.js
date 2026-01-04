// ==UserScript==
// @name         Geoguessr Faster Map
// @namespace    geoguessr user scripts
// @version      1.2
// @description  Open and close the map on mouseover in a more reactive way.
// @author       Edit from HugoBarjot / Base work from echandler
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449946/Geoguessr%20Faster%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/449946/Geoguessr%20Faster%20Map.meta.js
// ==/UserScript==



setInterval(() => {
  const url = location.href;
  if (url.startsWith("https://www.geoguessr.com/") && (url.includes("/game/") || url.includes("/multiplayer"))) {
      (function () {
  "use strict";

  let int = setInterval(() => {
    let sticky_element = document.querySelector('[data-qa="guess-map__control--sticky-active"]');
    let map = document.querySelectorAll('[data-qa="guess-map"]');

    clearInterval(int);
    map.forEach((canvas) => {
      canvas.addEventListener("mouseleave", function (e) {
        if (
           sticky_element.matches(".guess-map_controlStickyActive__0Sauu") === true
        ) {
            //dont'remove class for active map on mouseleave event whent the sticky button is enabled
        } else {
          document.querySelector('[data-qa="guess-map"]').classList.remove("guess-map_active__MH5FE");
        }
      });
    });
    map.forEach((canvas) => {
      canvas.addEventListener("mouseover", function (e) {
        document.querySelector('[data-qa="guess-map"]').classList.add("guess-map_active__MH5FE");
      });
    });
  }, 1000);
})();
  }
}, 250);
