// ==UserScript==
// @name        Sort Fish by Energy per Heat
// @namespace   finally.idle-pixel.energyheat
// @match       https://idle-pixel.com/login/play/*
// @grant       none
// @version     1.0
// @author      finally
// @description Sorts Fish by Energy per Heat
// @downloadURL https://update.greasyfork.org/scripts/515373/Sort%20Fish%20by%20Energy%20per%20Heat.user.js
// @updateURL https://update.greasyfork.org/scripts/515373/Sort%20Fish%20by%20Energy%20per%20Heat.meta.js
// ==/UserScript==

(() => {
  return new Promise((resolve) => {
    function check() {
      if (document.querySelector("#panel-fishing > itembox")) {
        resolve();
        return;
      }
      setTimeout(check, 200);
    }
    check();
  });
})().then(() => {
  let ENERGY_HEAT_MAP = Object.fromEntries(Object.keys(Cooking.FOOD_HEAT_REQ_MAP).map(f => [f, Cooking.ENERGY_MAP[f] / Cooking.FOOD_HEAT_REQ_MAP[f]]));

  let fish = document.querySelectorAll("#panel-fishing > itembox[data-item^='raw_']:not(.fishing-unique)");
  let parent = fish[0].parentNode;
  let next = fish[0].nextElementSibling;
  Array.from(fish).sort((a,b) => {
    return ENERGY_HEAT_MAP[a.getAttribute("data-item")] - ENERGY_HEAT_MAP[b.getAttribute("data-item")];
  }).forEach(e => {
    parent.insertBefore(e, next);
    parent.insertBefore(document.createTextNode(" "), next);
    next = e;
  });
});

