// ==UserScript==
// @name         Make ChatGPT scrollable with keyboard
// @namespace    http://tampermonkey.net/
// @version      2024-09-01
// @description  This app makes it scrollable by setting tabindex to outer div making it focusable
// @author       Alexander Yaremchuk & ChatGPT
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491011/Make%20ChatGPT%20scrollable%20with%20keyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/491011/Make%20ChatGPT%20scrollable%20with%20keyboard.meta.js
// ==/UserScript==

function onNavigation() {
  const style = "div.flex.flex-col.text-sm.md\\:pb-9";
  const elem = document.querySelector(style);
  if (elem) {
    elem.setAttribute("tabindex", "1");
    // console.log("Scroll for ChatGPT completed successfully.");
  } else {
    // console.log(`element with style ${style} not found.`);
  }
}

(function () {
  ("use strict");
  // console.log("Scroll for ChatGPT is starting");
  if (
    typeof document !== "undefined" &&
    typeof MutationObserver !== "undefined"
  ) {
    // console.log("Scroll for ChatGPT setting a mutation listener");

    setTimeout(() => {
      onNavigation();
      initializeObserver();
      // console.log("Mutation observer initialized after delay");
    }, 3000); // 3-second delay, give time to load
  }
})();

function initializeObserver() {
  const callback = function (mutationsList, observer) {
    // console.log("Scroll for ChatGPT mutations: ", mutationsList);
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        // console.log("Scroll for ChatGPT running onNavigation");
        onNavigation();
        break;
      }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(document.body, { childList: true, subtree: true });
}

module.exports = { onNavigation };
