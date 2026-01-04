// ==UserScript==
// @name         Jotoba Autopaste
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Autopaste copied text into Jotoba
// @author       Gorbit99
// @match        https://*.jotoba.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jotoba.de
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468473/Jotoba%20Autopaste.user.js
// @updateURL https://update.greasyfork.org/scripts/468473/Jotoba%20Autopaste.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  
  let isActive = JSON.parse(window.localStorage.getItem("autoPasteClipboard") ?? "false");

  let prevClipboard = await navigator.clipboard.readText();

  window.addEventListener("focus", async () => {
    const clipboard = await navigator.clipboard.readText();
    if (clipboard !== prevClipboard) {
      if (isActive) {
        const input = document.querySelector("#input");
        const searchButton = document.querySelector("button.search");
        input.value = clipboard;
        searchButton.click();
      }

      prevClipboard = clipboard;
    }
  });

  await new Promise((resolve) => setTimeout(() => resolve(), 300));

  const settingsContainer = document.querySelector(".top-row > div");

  const copyCheckboxContainer = document.createElement("div");
  copyCheckboxContainer.style.display = "flex";
  copyCheckboxContainer.style.alignItems = "center";

  const copyCheckboxLabel = document.createElement("label");
  copyCheckboxLabel.htmlFor = "copyCheckbox";
  copyCheckboxLabel.innerHTML = '<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>';

  copyCheckboxLabel.style.color = "var(--svgColor)";
  copyCheckboxLabel.style.marginLeft = "1rem";
  copyCheckboxLabel.style.fontSize = "2rem";
  copyCheckboxLabel.style.lineHeight = "0";
  copyCheckboxLabel.style.cursor = "pointer";

  const copyCheckboxInput = document.createElement("input");
  copyCheckboxInput.type = "checkbox";
  copyCheckboxInput.id = "copyCheckbox";
  copyCheckboxInput.style.marginLeft = "0.5rem";
  copyCheckboxInput.style.width = "1.25rem";
  copyCheckboxInput.style.height = "1.25rem";
  copyCheckboxInput.checked = isActive;

  copyCheckboxInput.addEventListener("change", () => {
    isActive = copyCheckboxInput.checked;
    window.localStorage.setItem("autoPasteClipboard", JSON.stringify(isActive));
  });

  copyCheckboxContainer.append(copyCheckboxLabel, copyCheckboxInput);

  settingsContainer.append(copyCheckboxContainer);
  settingsContainer.style.display = "flex";
  settingsContainer.style.alignItems = "baseline";
})();