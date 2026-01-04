// ==UserScript==
// @name         WK Flagger
// @namespace    http://tampermonkey.net/
// @version      2023-12-29
// @description  Add coloured flags to reviews as a memorization aid
// @author       Gorbit99
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483119/WK%20Flagger.user.js
// @updateURL https://update.greasyfork.org/scripts/483119/WK%20Flagger.meta.js
// ==/UserScript==

(function(wkof) {
  'use strict';

  const cacheFilename = "wkFlaggerData";
  let wkFlaggerData = {};
  const availableFlags = {
    red: "#f44",
    green: "#4f4",
    blue: "#44f",
    yellow: "#ff4",
    turqoise: "mediumspringgreen",
  };

  // Stuff I'm sure I'll need to change about 50 times in the future
  const statisticsClass = ".character-header__menu-statistics";
  const characterTextClass = ".character-header__characters";

  if (!window.wkof) {
    alert('WK Flagger requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
    window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
    return;
  }

  if (window.location.pathname === "/subjects/review") {
     createFlagUI();
  }

  wkof.file_cache.load(cacheFilename).then((data) => (wkFlaggerData = data))
    .catch(() => wkof.file_cache.save(cacheFilename, {}))
    .then(() => updateShownFlag());

  function updateShownFlag() {

    const itemId = getCurrentItemId();
    const flagElement = document.querySelector(".wk-flagger__flag--button");

    const color = wkFlaggerData[itemId];
    flagElement.classList.remove(...flagElement.classList);
    flagElement.classList.add("fa-flag", "wk-flagger__flag", "wk-flagger__flag--button");
    if (color === undefined) {
      flagElement.classList.add("fa-regular");
    } else {
      flagElement.classList.add("fa-solid", `wk-flagger__flag--${color}`);
    }
  }

  function createFlagUI() {
    if (window.location.pathname !== "/subjects/review") {
      return;
    }

    if (document.querySelector(".wk-flagger__wrapper")) {
      return;
    }

    const statisticsElement = document.querySelector(statisticsClass);

    const flagElementWrapper = document.createElement("div");
    flagElementWrapper.classList.add("wk-flagger__wrapper");

    const createFlag = (type, className) => {
      const flagElement = document.createElement("i");
      flagElement.classList.add(`fa-${type}`, "fa-flag", "wk-flagger__flag");
      if (className) {
        flagElement.classList.add(`wk-flagger__flag--${className}`);
      }
      return flagElement;
    };

    const flagElement = createFlag("regular", "button");
    flagElement.addEventListener("click", () => toggleDropdown());

    flagElementWrapper.append(flagElement);
    statisticsElement.prepend(flagElementWrapper);

    const dropdownElement = document.createElement("div");
    dropdownElement.classList.add("wk-flagger__dropdown");
    flagElementWrapper.append(dropdownElement);

    const dropdownNoFlag = createFlag("regular", "no-flag");
    dropdownNoFlag.addEventListener("click", () => {
        setItemFlag(undefined);
        toggleDropdown(false);
        updateShownFlag();
    });
    const dropdownColoredFlags = Object.keys(availableFlags).map((color) => {
        const flag = createFlag("solid", color)
        flag.addEventListener("click", () => {
          setItemFlag(color);
          toggleDropdown(false);
          updateShownFlag();
        });

        return flag;
      }
    );

    dropdownElement.append(dropdownNoFlag, ...dropdownColoredFlags);

    insertCss();

    const changeObserver = new MutationObserver(updateShownFlag);
    changeObserver.observe(
      document.querySelector(characterTextClass),
      {characterData: true, childList: true},
    );
  }

  function insertCss() {
    const flagColors = Object.entries(availableFlags)
      .map((value) => `${statisticsClass} .wk-flagger__wrapper .wk-flagger__flag--${value[0]} {
        color: ${value[1]};
      }`)
      .join("\n");

    const css = `
    .wk-flagger__wrapper {
      margin-right: 1em;
    }

    .wk-flagger__wrapper .wk-flagger__flag {
      cursor: pointer;
    }

    .wk-flagger__wrapper .wk-flagger__flag:hover {
      opacity: 0.6;
    }

    .wk-flagger__dropdown {
      position: absolute;
      display: none;
      flex-direction: column;
      gap: 0.5em;
      margin-top: 0.5em;
      padding: 0.5em;
      border-radius: 0.25em;
      z-index:9999;

      left: 50%;
      transform: translateX(-50%);

      background: var(--color-menu, #333);
    }

    .wk-flagger__dropdown.wk-flagger__dropdown--shown {
      display: flex;
    }

    ${flagColors}
    `;

    const styleElement = document.createElement("style");
    styleElement.innerHTML = css;
    document.head.append(styleElement);
  }

  function toggleDropdown(state = undefined) {
    const dropdownElement = document.querySelector(".wk-flagger__dropdown");
    if (!dropdownElement) {
      return;
    }

    dropdownElement.classList.toggle("wk-flagger__dropdown--shown", state);
  }

  function setItemFlag(flagColor) {
    const currentId = getCurrentItemId();
    if (flagColor) {
      wkFlaggerData[currentId] = flagColor;
    } else {
      delete wkFlaggerData[currentId];
    }
    wkof.file_cache.save(cacheFilename, wkFlaggerData);

    updateShownFlag();
  }

  function getCurrentItemId() {
    // Stolen straight from Sinyaven's awesome item info injector script - thx
    const subjects = JSON.parse(document.querySelector(`[data-quiz-queue-target="subjects"]`).textContent);
		const currentId = parseInt(document.querySelector(`[data-subject-id]`)?.dataset.subjectId ?? subjects[0]?.id);

    return currentId;
  }

  document.addEventListener("turbo:load", createFlagUI());
})(window.wkof);