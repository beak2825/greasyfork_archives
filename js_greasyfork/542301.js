// ==UserScript==
// @name         RMRG checkboxes
// @namespace    http://tampermonkey.net/
// @version      2025-07-11
// @description  RMRG checkboxes and important metas buttons
// @author       You
// @match        https://rmrg.me/turkey/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rmrg.me
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542301/RMRG%20checkboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/542301/RMRG%20checkboxes.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const CHECKBOX_STORAGE_KEY = "custom-checkbox";
  const IMPORTANT_STORAGE_KEY = "custom-important";

  const ICON_SIZE = 16;

  const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>`;
  const X_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

  const BUTTON_STYLES = `
      display: inline-flex;
      place-content: center;
      padding: 12px;
      cursor: pointer;
      line-height: 1;
      border-radius: 12px;
      margin-inline: 1rem;
      border: 1px solid rgb(113 113 122);
      background: rgba(82, 82, 91, 0.15);
      color: white;
      outline: 0;
      z-index: 999;
    `;

  const PROGRESSION_BOX_STYLES = `
      position: fixed;
      background: black;
      color: white;
      top: 0;
      left: 0;
      z-index: 5000;
      font-family: monospace;
      font-size: 10px;
  `;


  const sections = document.querySelectorAll(".meta-item");
  const url = new URL(window.location.href);

  function getStorage(storageName) {
    const storage = JSON.parse(localStorage.getItem(storageName))?.[url.pathname];
    if (storage === undefined) {
      const newStorageValue = [];
      setStorage(storageName, newStorageValue);
      return newStorageValue;
    }
    /* if (localStorage.getItem(storageName) === undefined) {
          const newStorage = {[url.pathname]: []};
          localStorage.setItem(storageName, JSON.stringify(newStorage));

          return newStorage;
        }*/
    return JSON.parse(localStorage.getItem(storageName))?.[url.pathname];
  }

  function setStorage(storageName, array) {
    const allPagesStorage = JSON.parse(localStorage.getItem(storageName)) ?? {};
    localStorage.setItem(
      storageName,
      JSON.stringify({ ...allPagesStorage, [url.pathname]: array })
    );
  }

  function toggleCheckedStyles(elements, force) {
    elements.forEach(element => {
       element.style.opacity = force ? 0.2 : "";
    });
  }

  function toggleImportantStyles(section, force) {
    section.style.background = force ? "#f7e04a55" : "";
    section.style.borderRadius = force ? "0.75rem" : "";
  }

  // Progression box
  const progressionBox = document.createElement("div");
  progressionBox.style = PROGRESSION_BOX_STYLES;
  updateProgressionText();
  document.body.append(progressionBox);

  function updateProgressionText() {
    const checked = getStorage(CHECKBOX_STORAGE_KEY);
    progressionBox.innerText = `${checked.length}/${sections.length}`;
  }


  const checkboxStorage = getStorage(CHECKBOX_STORAGE_KEY);
  const importantStorage = getStorage(IMPORTANT_STORAGE_KEY);

  // if no storage, set an existing but empty one
  if (!checkboxStorage) setStorage(CHECKBOX_STORAGE_KEY, []);
  if (!importantStorage) setStorage(IMPORTANT_STORAGE_KEY, []);

  // on load, loop on each section & add listener
  sections.forEach((section, i) => {
    section.style.paddingBlock = "1rem";
    section.style.paddingRight = "1rem";
      console.log(i);

    const id = section.querySelector("img")?.getAttribute("src");

    if (!id) return;

    const isDefaultChecked = checkboxStorage.includes(id);
    const isDefaultImportant = importantStorage.includes(id);

    // get the section content (it excludes the buttons)
    const targettedContent = section.querySelectorAll("*:not([data-actions])");
    // const targettedContent = section.querySelectorAll("a, .meta-content");

    // create the checkbox button
    const checkboxButton = document.createElement("button");
    checkboxButton.style = BUTTON_STYLES;
    checkboxButton.innerHTML = isDefaultChecked ? CHECK_SVG : X_SVG;
    toggleCheckedStyles(targettedContent, isDefaultChecked);

    // create the important button
    const importantButton = document.createElement("button");
    importantButton.style = BUTTON_STYLES;
    importantButton.innerHTML = "!";
    toggleImportantStyles(section, isDefaultImportant);

    // create the wrapper div for the buttons
    const wrapperDiv = document.createElement("div");
    wrapperDiv.style = `
       display: flex;
       flex-direction: column;
       gap: 0.5rem;
      `;
    wrapperDiv.dataset.actions = true;
    wrapperDiv.append(checkboxButton);
    wrapperDiv.append(importantButton);

    function checkboxToggle() {
      // get all the checked sections from the current page
      const checkboxStorage = getStorage("custom-checkbox");
      const isChecked = checkboxStorage.includes(id);
      checkboxButton.innerHTML = isChecked ? X_SVG : CHECK_SVG;
      const newStorageValue = isChecked
        ? checkboxStorage.filter(sectionId => sectionId !== id)
        : [...checkboxStorage, id];

      setStorage(CHECKBOX_STORAGE_KEY, newStorageValue);
      toggleCheckedStyles(targettedContent, !isChecked);
      updateProgressionText();
    }

    function importantToggle() {
      // get all the sections marked as important from the current page
      const importantStorage = getStorage(IMPORTANT_STORAGE_KEY);
      const isImportant = importantStorage.includes(id);
      const newStorageValue = isImportant
        ? importantStorage.filter(sectionId => sectionId !== id)
        : [...importantStorage, id];

      setStorage(IMPORTANT_STORAGE_KEY, newStorageValue);
      toggleImportantStyles(section, !isImportant);
    }

    checkboxButton.addEventListener("click", checkboxToggle);
    importantButton.addEventListener("click", importantToggle);

    section.prepend(wrapperDiv);
  });
})();
