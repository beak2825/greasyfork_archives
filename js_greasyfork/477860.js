// ==UserScript==
// @name         YCS Minimize
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  minimize the YCS add on
// @author       JuliSharow
// @match        https://www.youtube.com/watch?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477860/YCS%20Minimize.user.js
// @updateURL https://update.greasyfork.org/scripts/477860/YCS%20Minimize.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const waitTime = 1000;
  const buttonId = "ycs_minimize";

  function addMinimizeButton() {
    const ycs_app = document.querySelector(".ycs-app");

    if (!ycs_app) {
      setTimeout(addMinimizeButton, waitTime);
      console.debug(
        `can not find ycs_app, trying again in ${waitTime} miliseconds`
      );
      return;
    }

    const button = document.getElementById("ycs_load_stop")?.cloneNode(true);
    const newButton = document.getElementById(buttonId);

    if (ycs_app === null || button === null || newButton !== null) {
      return;
    }
    button.id = buttonId;
    button.textContent = "minimize app";
    button.style = "position: relative";
    button.addEventListener("click", () => {
      const main = ycs_app.querySelector(".ycs-app-main");
      if (main.style.display !== "none") {
        main.style = "display: none";
      } else {
        main.style = "display: block";
      }
    });
    ycs_app.insertBefore(button, ycs_app.firstChild);
  }
  addMinimizeButton();
})();
