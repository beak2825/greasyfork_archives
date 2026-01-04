// ==UserScript==
// @name         Page reloader for Plants vs. Undead
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reloads the page every 600 seconds (10 minutes)
// @author       You
// @match        https://marketplace.plantvsundead.com/*
// @icon         https://plantvsundead.com/assets/img/logo-2.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432239/Page%20reloader%20for%20Plants%20vs%20Undead.user.js
// @updateURL https://update.greasyfork.org/scripts/432239/Page%20reloader%20for%20Plants%20vs%20Undead.meta.js
// ==/UserScript==
(function() {
  window.addEventListener("load", vkmyRun);
})();

function vkmyRun() {
    let secs = 600;
    const intervalId = setInterval(function () {
      const msg = "Reloads in " + secs + "s";

      const a = document.getElementsByClassName("button-menu");
      if (!a || !a[0]) {
        console.warn('Element not found!!!');
        console.info(msg);
        return;
      }

      let p = document.getElementById("vmky-reload-countdown");
      if (!p) {
        p = document.createElement("p");
        p.setAttribute("id", "vmky-reload-countdown");
        p.innerText = "Reloads in ???s";
        p.classList.add("tw-text-center");
        p.classList.add("tw-mt-auto");
 
        a[0].appendChild(p);
      }

      p.innerText = msg;
      secs--;
      if (secs <= 0) {
        clearInterval(intervalId);
        location.reload();
      }
    }, 1000);
}
