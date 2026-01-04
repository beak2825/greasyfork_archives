// ==UserScript==
// @name         kaniwani.com Info Button Hotkey
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Press F to click the info button
// @author       pckv
// @license      MIT
// @match        https://kaniwani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kaniwani.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482924/kaniwanicom%20Info%20Button%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/482924/kaniwanicom%20Info%20Button%20Hotkey.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const INFO_BUTTON_HOTKEY = "f";

  const getInfoButton = () => {
    const buttons = Array.from(document.querySelectorAll("button"));
    return buttons.find((b) => b.innerText.includes("INFO")) || null;
  };

  const getSubmitButton = () => {
    return document.querySelector("button[type='submit']") || null;
  };

  let infoButton = null;
  let submitButton = null;

  const onInfoKeyPress = (e) => {
    if (e.key === "Enter") {
      submitButton.click();
    }
  };

  const addInfoButton = () => {
    if (infoButton) {
      infoButton.removeEventListener("keypress", onInfoKeyPress);
    }

    infoButton = getInfoButton();

    if (infoButton) {
      infoButton.addEventListener("keypress", onInfoKeyPress);
    }
  };

  const addSubmitButton = () => {
    submitButton = getSubmitButton();
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        addInfoButton();
        addSubmitButton();
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener("keyup", (e) => {
    if (document.activeElement.tagName.toLowerCase() === "input") {
      return;
    }

    if (infoButton && e.key === INFO_BUTTON_HOTKEY) {
      infoButton.click();
    }
  });
})();
