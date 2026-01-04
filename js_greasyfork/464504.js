// ==UserScript==
// @name         WK Level Arrows
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add arrows to the WK level screen
// @author       Gorbit99
// @match        https://www.wanikani.com/level/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464504/WK%20Level%20Arrows.user.js
// @updateURL https://update.greasyfork.org/scripts/464504/WK%20Level%20Arrows.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let arrowLeft;
  let arrowRight;

  function addArrows() {
    arrowLeft = null;
    arrowRight = null;

    if (!location.pathname.startsWith("/level/")) {
       return;
    }

    const siteContainer = document.querySelector(".site-content-container");

    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
    .wk-level-arrows__arrow {
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 0.5em;
      padding: 1em;
      cursor: pointer;
    }

    .wk-level-arrows__arrow--left {
      left: 1em;
    }

    .wk-level-arrows__arrow--right {
      right: 1em;
    }

    .wk-level-arrows__arrow:hover {
      background: hsl(0, 0%, 0%, 0.2);
    }

    .wk-level-arrows__arrow .wk-level-arrows__arrow-icon {
      font-size: 3em;
    }
    `;
    document.head.append(styleElement);

    const level = parseInt(location.pathname.split("/").pop());

    if (level !== 1) {
      arrowLeft = document.createElement("div");
      arrowLeft.classList.add("wk-level-arrows__arrow", "wk-level-arrows__arrow--left");
      const leftIcon = document.createElement("i");
      leftIcon.classList.add("fa", "fa-chevron-left", "wk-level-arrows__arrow-icon");
      arrowLeft.append(leftIcon);

      arrowLeft.addEventListener("click", () => {
        const newLevel = level - 1;
        Turbo.visit(`/level/${newLevel}`);
      });

      siteContainer.append(arrowLeft);
    }

    if (level !== 60) {
      arrowRight = document.createElement("div");
      arrowRight.classList.add("wk-level-arrows__arrow", "wk-level-arrows__arrow--right");
      const rightIcon = document.createElement("i");
      rightIcon.classList.add("fa", "fa-chevron-right", "wk-level-arrows__arrow-icon");
      arrowRight.append(rightIcon);

      arrowRight.addEventListener("click", () => {
        const newLevel = level + 1;
        Turbo.visit(`/level/${newLevel}`);
      });

      siteContainer.append(arrowRight);
    }
  }
  document.addEventListener("turbo:load", () => setTimeout(addArrows, 0));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key == "a") {
      arrowLeft?.click();
    }
    if (e.key === "ArrowRight" || e.key == "d") {
      arrowRight?.click();
    }
  });
})();