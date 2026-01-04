// ==UserScript==
// @name        Idle Pixel Breeding Timer
// @namespace   finally.idle-pixel.breeding
// @match       https://idle-pixel.com/login/play/*
// @grant       none
// @version     1.1
// @author      finally
// @description Adds a timer when you can purchase your next animal
// @downloadURL https://update.greasyfork.org/scripts/507266/Idle%20Pixel%20Breeding%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/507266/Idle%20Pixel%20Breeding%20Timer.meta.js
// ==/UserScript==

(() => {
  return new Promise((resolve) => {
    function check() {
      if (document.getElementById("notifications-area")) {
        resolve();
        return;
      }
      setTimeout(check, 200);
    }
    check();
  });
})().then(() => {
  let container = document.createElement("div");
  container.className = "notification-beehive hover";
  container.onclick = () => switch_panels('panel-breeding');
  container.innerHTML = `<img src="https://cdn.idle-pixel.com/images/breeding_animal_farmer.png" class="w20">`;

  let timer = document.createElement("span");
  timer.className = "color-white";

  container.appendChild(timer);
  document.getElementById("notifications-area").appendChild(container);

  setInterval(() => {
    if (var_buy_animal_timer <= 0) {
      timer.innerHTML = " READY";
    }
    else {
      let m = Math.floor(var_buy_animal_timer / 60);
      let s = var_buy_animal_timer % 60;
      timer.innerHTML = ` ${m}:${s.toString().padStart(2, "0")}`;
    }
  }, 1000);
});