// ==UserScript==
// @name         MWI QoL Profile on avatar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ToolTools for MilkyWayIdle. Open your profile at avatar click
// @author       AlexZaw
// @license      MIT License
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/531374/MWI%20QoL%20Profile%20on%20avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/531374/MWI%20QoL%20Profile%20on%20avatar.meta.js
// ==/UserScript==

(function () {
  "use strict";

  new MutationObserver(onAvatarClick).observe(document, {
    childList: true,
    subtree: true
  });

  function onAvatarClick(changes, observer) {
    if (document.querySelector(".MainPanel_mainPanel__Ex2Ir")) {
      observer.disconnect();
      document
        .querySelector(".Header_avatar__2RQgo")
        .addEventListener("click", () => {
          document
            .querySelector('[aria-label="navigationBar.settings"]')
            .parentNode.click();
          document
            .querySelector(".SettingsPanel_profileTab__214Bj")
            .querySelector(".Button_button__1Fe9z")
            .click();
        });
    }
  }
})();
