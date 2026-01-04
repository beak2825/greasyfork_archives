// ==UserScript==
// @name         AlwaysOn-WazeEditor
// @namespace    http://tampermonkey.net/
// @version      2024-11-11
// @description  Keep your visibility always on
// @author       RayanChemin
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516887/AlwaysOn-WazeEditor.user.js
// @updateURL https://update.greasyfork.org/scripts/516887/AlwaysOn-WazeEditor.meta.js
// ==/UserScript==
var intervalControl;
(function () {
  "use strict";
  const clickAction = () => {
    if (document.querySelector(".online-editors-bubble") == null) {
      console.log("WME AlwaysON: Waiting to execute");
      return;
    }
    clearInterval(intervalControl);
    document.querySelector(".online-editors-bubble").click();
    const btn = document
      .querySelector(".online-editors-list")
      .querySelector("wz-list-item.special-item")
      .querySelector("wz-button");
    const isIconInvisible = btn
      .querySelector("i")
      .classList.contains("w-icon-invisible");
    if (isIconInvisible) {
      btn.click();
    }
    document.querySelector(".online-editors-bubble").click();
  };

  const execAlwaysOn = () => {
    if (!window.W.map) {
      window.console.warn("WME AlwaysON: waiting for WME...");
      setTimeout(execAlwaysOn, 789);
      return;
    }

    // check if sidebar is hidden
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.display == "none") {
      console.warn(
        "WME AlwaysON: not logged in yet - will initialise at login"
      );
      W.loginManager.events.register("login", null, execAlwaysOn);
      return;
    }

    intervalControl = setInterval(() => clickAction(), 3500);
  };

  setTimeout(execAlwaysOn, 789);
})();
