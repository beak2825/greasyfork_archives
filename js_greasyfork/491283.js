// ==UserScript==
// @name YouTube Usability
// @description Disable frequently mistyped shortcuts (e.g. 0-9 number keys) and auto-looping on shorts.
// @license MIT
// @icon https://m.youtube.com/static/apple-touch-icon-114x114-precomposed.png
// @namespace michaelsande.rs
// @version 2024.05.17
// @match https://www.youtube.com/*
// @match https://m.youtube.com/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/491283/YouTube%20Usability.user.js
// @updateURL https://update.greasyfork.org/scripts/491283/YouTube%20Usability.meta.js
// ==/UserScript==

// Tested on Firefox Greasemonkey and Violentmonkey, and Safari Userscripts.
(() => {
  "use strict";
  const IS_MOBILE = document.location.hostname.startsWith("m.");
  const beforeLoad = () => {
    const ALLOWED_MODIFIER_KEYS = ["Alt", "Control", "Meta", "OS"];
    const DISABLED_KEYS = new Set([
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "k",
      "j",
      "l",
      "Home",
      "End",
    ]);
    window.addEventListener(
      "keydown",
      event => {
        if (
          DISABLED_KEYS.has(event.key) &&
          !ALLOWED_MODIFIER_KEYS.some(event.getModifierState.bind(event)) &&
          !event.isComposing
        ) {
          event.stopImmediatePropagation();
        }
      },
      true
    );

    window.addEventListener("load", afterLoad);
  };

  const afterLoad = () => {
    const container = document.getElementById(
      IS_MOBILE ? "player-shorts-container" : "page-manager"
    );
    if (container !== null) {
      const disableShortLooping = () => {
        container
          .querySelector(IS_MOBILE ? "video" : "#shorts-player video")
          ?.removeAttribute("loop");
      };

      disableShortLooping();

      // Shorts video element gets inserted dynamically by YouTube when
      // navigating, so can't be used as target.
      new MutationObserver(disableShortLooping).observe(container, {
        attributeFilter: ["loop"],
        childList: true,
        subtree: true,
      });
    }
  };

  beforeLoad();
})();