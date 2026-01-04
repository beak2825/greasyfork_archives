// ==UserScript==
// @name         x01 Player Row Rework for Autodarts
// @version      1.1
// @description  Restyling of the player row, displaying the currently active player bigger while the others are in a smaller list to the side
// @author       dotty-dev
// @license      MIT
// @match        *://play.autodarts.io/*
// @namespace    https://greasyfork.org/en/users/913506-dotty-dev
// @downloadURL https://update.greasyfork.org/scripts/487600/x01%20Player%20Row%20Rework%20for%20Autodarts.user.js
// @updateURL https://update.greasyfork.org/scripts/487600/x01%20Player%20Row%20Rework%20for%20Autodarts.meta.js
// ==/UserScript==
/*jshint esversion: 11 */

(function () {
  "use strict";

  const documentObserver = new MutationObserver((mutationRecords) => {
    if (mutationRecords[0]?.target.classList.contains("css-k008qs")) {
      playerRowRework();
    }
  });

  documentObserver.observe(document, {
    childList: true,
    attributes: true,
    subtree: true,
    attributeFilter: ["class"],
  });

  const playerRowRework = () => {
    const gameModeElement = document.querySelector(
      ".css-k008qs .css-a6m3v9 .css-1xbroe7"
    );
    if (gameModeElement && gameModeElement.textContent === "X01") {
      if (document.querySelectorAll("style#player-row-rework").length < 1) {
        document.head.insertAdjacentHTML(
          "beforeend",
          /*html*/ `
            <style id="player-row-rework">
              .css-16cpq6p {
                 max-width: 50%;
              }
               .css-16cpq6p .css-8ga5e0 {
                 margin: 0;
                 line-height: 92pt;
                 overflow: hidden;
                 width: 100%;
              }
               .css-16cpq6p .css-8ga5e0 .css-1xbroe7 {
                 max-width: calc(100% - 10px);
              }
               .css-16cpq6p .css-8ga5e0 .css-1ja72ru {
                 font-size: 30pt;
                 line-height: 38pt;
                 text-overflow: ellipsis;
                 display: block;
                 line-break: unset;
                 overflow: hidden;
                 white-space: nowrap;
              }
               .sub-stack-small {
                 width: 50%;
                 display: grid;
                 -moz-box-align: center;
                 align-items: center;
                 grid-template-columns: 50% 50%;
                 gap: var(--chakra-space-2);
                 color: var(--chakra-colors-whiteAlpha-900);
                 user-select: none;
                 flex: 1 1 0%;
                 height: 100%;
              }
               .sub-stack-small > .css-16cpq6p {
                 width: 100%;
                 max-width: unset;
              }
               .sub-stack-small > .css-16cpq6p .css-1a28glk {
                 width: 100%;
              }
               .sub-stack-small > .css-16cpq6p .css-8ga5e0 {
                 margin: 5px 0;
                 flex-direction: row-reverse;
                 justify-content: space-between;
                 flex: 1 1 0%;
                 padding: 0 5px;
              }
               .sub-stack-small > .css-16cpq6p .css-x3m75h {
                 font-size: 20pt;
                 line-height: 24pt;
              }
               .sub-stack-small > .css-16cpq6p .css-1ja72ru {
                 font-size: var(--chakra-fontSizes-xs);
                 line-height: 1.3;
              }
            </style>
            `
        );
      }

      if (document.querySelectorAll(".sub-stack-small").length === 0) {
        let activeCardEl = document.querySelector(".css-1acvlgt");
        if (!activeCardEl) {
          activeCardEl = document.querySelector(".css-e9w8hh");
        }
        activeCardEl.parentElement.insertAdjacentHTML(
          "afterend",
          /*html*/ `<div class="sub-stack-small"></div>`
        );
      }

      const stack = document.querySelector(".css-1iy3ld1");
      const subStack = stack.querySelector(".sub-stack-small");

      document.querySelectorAll(".css-1a28glk").forEach((node) => {
        subStack.append(node.parentElement);
      });

      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.attributeName == "class" &&
            mutation.target.tagName !== "TR"
          ) {
            if (
              mutation.target.classList.contains("css-1acvlgt") ||
              mutation.target.classList.contains("css-e9w8hh")
            ) {
              stack.prepend(mutation.target.parentElement);
            } else {
              if (mutation.target.parentElement.contains(subStack) === false) {
                subStack.append(mutation.target.parentElement);
              }
            }
          }
        });
      });

      mutationObserver.observe(stack, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }
  };
})();
