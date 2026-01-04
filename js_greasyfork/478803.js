// ==UserScript==
// @name         MelvorIdleAutoHeal
// @namespace    http://shenhaisu.cc/
// @version      1.0
// @description  自动吃食物来回血
// @author       Daoluolts
// @match        https://melvoridle.com/index_game.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=melvoridle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478803/MelvorIdleAutoHeal.user.js
// @updateURL https://update.greasyfork.org/scripts/478803/MelvorIdleAutoHeal.meta.js
// ==/UserScript==

(function () {
  let maxHealth = 0;
  let nowHealth = 0;
  setInterval(() => {
    let successNode = document.querySelector("span > small.text-success#nav-hitpoints-current");
    let dangerNode = document.querySelector("span > small.text-danger#nav-hitpoints-current");
    let foodNode = document.querySelector("button > img.combat-food");
    if (successNode) {
      maxHealth = parseInt(successNode.innerHTML.replaceAll(/\(|\)/g, ""));
    } else if (dangerNode) {
      nowHealth = parseInt(dangerNode.innerHTML.replaceAll(/\(|\)/g, ""));
    }
    console.log(maxHealth, nowHealth, maxHealth - nowHealth >= 30);
    if (maxHealth == 0 && nowHealth == 0) return;
    if (maxHealth - nowHealth >= 30 || maxHealth == 0) foodNode.click();
  }, 1000);
})();
