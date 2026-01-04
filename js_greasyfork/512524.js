// ==UserScript==
// @name         Nitro Monkey | NT Theme
// @version      2024-12-12
// @namespace    https://greasyfork.org/users/1331131-tensorflow-dvorak
// @description  Custom Nitro Type Theme w/ Font-Size, Height Sliders, and Cursor Customization
// @author       TensorFlow - Dvorak
// @match        *://www.nitrotype.com/*
// @require      https://update.greasyfork.org/scripts/501960/1418069/findReact.js
// @require https://update.greasyfork.org/scripts/520085/1499398/Nitro%20Type%20Post%20Race%20Analysis%20NT.js
// @require      https://update.greasyfork.org/scripts/514399/1476019/raceData.js
// @require https://update.greasyfork.org/scripts/515441/1476487/Nitro%20Type%20Theme%20Customizer.js
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/512524/Nitro%20Monkey%20%7C%20NT%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/512524/Nitro%20Monkey%20%7C%20NT%20Theme.meta.js
// ==/UserScript==

(function () {
  const dynamicStyle = document.createElement("style");
  document.head.appendChild(dynamicStyle);

  let currentCursorType = localStorage.getItem("cursorType") || "block";
  let currentCursorSpeed = localStorage.getItem("cursorSpeed") || "medium";
  const bgColor = localStorage.getItem("nt_bgColor") || "#060516";
  const bgImage = localStorage.getItem("nt_bgImage") || "";
  const textColor = localStorage.getItem("nt_textColor") || "#a6a4f7";
  const cursorColor = localStorage.getItem("nt_cursorColor") || "#0075ff";
  const buttonColor = localStorage.getItem("nt_buttonColor") || "#5a67d8";
  const typedTextColor = localStorage.getItem("nt_typedTextColor") || "#23223b";
  const cardColor = localStorage.getItem("nt_cardColor") || "#1a1a2e";
  const typingAreaColor =
    localStorage.getItem("nt_typingAreaColor") || "#0605163d";
  const typingAreaImage = localStorage.getItem("nt_typingAreaImage") || "";

  function updateStyles() {
    dynamicStyle.innerHTML = `
      ${generateCursorStyle(currentCursorType, currentCursorSpeed)}
      ${generateFontSizeStyle(localStorage.getItem("dashFontSize") || "40")}
      ${generateCustomThemeStyle(bgColor, textColor)}
    `;
  }
  function generateCustomThemeStyle(bgColor, textColor) {
    return `
      .dash {
        background: ${typingAreaColor};
        background-image: url(${typingAreaImage});
        background-attachment: fixed;
        background-size: cover;
      }
      .dash-letter {
        color: ${textColor};
      }
      .dash-letter.is-typed {
        color: ${typedTextColor};
      }
      .race-results, .raceResults--default, .raceResults-rewards, .raceResults-dailyChallenges,
      .g-b--7of12, .footer-nav, .nav-list, .nav {
        background-color: ${bgColor};
      }
      .btn--primary {
        background: ${buttonColor};
      }
      .btn--primary:hover {
        background: ${buttonColor}d9;
      }
    `;
  }

  function lightenColor(hex, amount) {
    return `#${hex
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).slice(-2)
      )}`;
  }
  function generateCursorStyle(cursorType, cursorSpeed) {
    let cursorSize = "2px";
    let cursorHeight = "1.2em";
    let animationDuration = "1s";
    let cursorTopOffset = "0.2em";
    let cardColor = localStorage.getItem("nt_cardColor") || "#1a1a2e";
    let cursorColor = localStorage.getItem("nt_cursorColor") || "#0075ff";
    let cursorTransform = "";

    if (cursorType === "block") {
      cursorSize = "0.7em";
      cursorHeight = "1.1em";
      cursorTopOffset = "0";
      cursorColor = `${cursorColor}42`;
      cursorTransform = "translateY(0.3em)";
    } else if (cursorType === "line") {
      cursorSize = "2px";
      cursorHeight = "1.2em";
      cursorColor = cursorColor || "#0075ff";
    } else {
      cursorSize = "0";
    }

    if (cursorSpeed === "slow") {
      animationDuration = "1.5s";
    } else if (cursorSpeed === "fast") {
      animationDuration = "0.5s";
    }

    return `
      .dash-letter {
        color: #acaaff;
      }
      .dash-letter.is-waiting {
        position: relative;
        color: ${lightenColor(textColor, 60)};
        background-color: #1c99f400;
      }
      .dash-letter.is-waiting::after {
        content: '';
        display: inline-block;
        color: ${textColor};
        width: ${cursorSize};
        height: ${cursorHeight};
        background-color: ${cursorColor};
        animation: blink ${animationDuration} step-end infinite;
        position: absolute;
        top: ${cursorTopOffset};
        left: 0;
        transform: ${cursorTransform};
      }
      .season--xmaxx-2024 .racev3-ui .dash {
        background: ${typingAreaColor};
      }
      .dash-letter.is-incorrect {
        color: red;
        background: #ffffff00;
        position: relative;
      }
      .dash-letter.is-incorrect::after {
        content: '';
        display: inline-block;
        width: ${cursorSize};
        height: ${cursorHeight};
        background-color: rgba(255, 0, 0, 0.5);
        animation: blink ${animationDuration} step-end infinite;
        position: absolute;
        top: ${cursorTopOffset};
        left: 0;
        transform: ${cursorTransform};
      }
      @keyframes blink {
        50% { opacity: 0; }
      }
    `;
  }

  function generateFontSizeStyle(fontSize) {
    return `
      #root {
        background-color: ${bgColor} !important;
        background-image: url(${bgImage});
        background-attachment: fixed;
        background-size: cover;
      }
      .dash-copy {
        font-size: ${fontSize}px !important;
      }
      #raceContainer {
        background-color: ${typingAreaColor} !important;
      }
      .dash-copyContainer {
        background: ${typingAreaColor};
        background-image: url(${typingAreaImage});
        background-size: cover;
        background-attachment: fixed;
        flex: 1;
        overflow: hidden;
        padding:0px;
        padding-left:10px;
        border-radius: 0px;
        box-shadow: none;
        width: 100%;
        display: flex;
      }
      .dash-side, .dash-actions, .dash-nitros {
        display: none;
      }
      .dash:before {
        height: min-content;
      }
      .structure-footer {
        display: flex;
        padding-top: 2rem;
      }
      .race-results {
        background-color: #060516;
      }
      .raceResults--default {
        background: #060516;
      }
      .raceResults-rewards {
        background: #0c0b18;
      }
      .raceResults-dailyChallenges {
        background: #0c0b18;
      }
      .g-b--7of12 {
        background: #060516;
      }
      .footer-nav {
        background: #0c0b18;
      }
      .nav-list {
        background: #0c0b18;
      }
      .nav {
        background: #0c0b18;
        border-bottom: 1px solid #14141b;
      }
      .btn--primary {
        background: #403dae;
      }
      .btn--primary:hover {
        background: #8a1bdf;
      }
      .btn--secondary {
        background: #5b048a;
      }
      .btn--secondary:hover {
        background: #8d11d0;
      }
      .gridTable--raceResults .gridTable-cell {
        background: #0c0b18;
      }
      .gridTable-cell {
        background: #0c0b18;
      }
      .dashShield-layer {
        display: none;
      }
      .dash-center {
        padding: 0px;
        //background: #06051687;
      }
      .nt-stats-right-section {
        background: #060516;
      }
      .nt-stats-daily-challenges {
        background: #060516;
      }
      .nt-stats-body {
        background: #0c0b18;
      }
      .experiment {
        background: ${cardColor} !important;
        color: ${textColor} !important;
      }
    `;
  }

  const dashElement = document.querySelector(".dash");
  const container = document.querySelector(".structure-content div");
  if (dashElement) {
    const displayContainer = document.createElement("div");
    displayContainer.classList.add("nitro-monkey__settings-container");
    displayContainer.style.display = "flex";
    displayContainer.style.marginTop = "4rem";
    displayContainer.style.padding = "1rem";
    displayContainer.style.fontSize = "20px";
    displayContainer.style.flexWrap = "wrap";
    displayContainer.style.color = textColor;
    displayContainer.style.background = bgColor;
    displayContainer.style.borderRadius = "5px";
    displayContainer.style.borderRadius = "5px";
    displayContainer.style.borderBottom = "2px solid #0c0b18";
    displayContainer.style.justifyContent = "space-between";
    displayContainer.innerHTML = `
<div class="nt-monkey__cursor-container" style="height: fit-content; padding: 1rem; background-color: ${cardColor}; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); width: auto; color: #e0e0e0; font-size: 0.9rem; margin-bottom: 1rem;">
  <span id="targetWPMValue" style="display: none;">Target WPM: 100</span>

  <div style="margin-bottom: 0.8rem;">
    <label for="targetWPM" style="margin-right: 0.5rem; color: #a0a0a0;">Target WPM:</label>
    <button id="decreaseWPM" class="animate--iconSlam btn btn--fw btn--gloss btn--primary dhf" style="margin-right: 0.5rem; width: 1.5rem; height: 1.5rem; font-size: 1rem; border: none; border-radius: 4px; cursor: pointer;">-</button>
    <input style="background: #060608; border: 1px solid #0c0b18; border-radius: 4px; color: #e0e0e0; text-align: center; width: 3rem;" type="number" id="targetWPM" min="10" max="300" value="100" readonly>
    <button id="increaseWPM" class="animate--iconSlam btn btn--fw btn--gloss btn--primary dhf" style="margin-left: 0.5rem; width: 1.5rem; height: 1.5rem; font-size: 1rem; border: none; border-radius: 4px; cursor: pointer;">+</button>
  </div>

  <div style="margin-bottom: 0.8rem;">
    <label for="cursorType" style="margin-right: 0.5rem; color: #a0a0a0;">Cursor Type:</label>
    <button id="cursorTypeButton" class="animate--iconSlam btn btn--fw btn--gloss btn--primary dhf" style="height: 2rem; width: 5rem; font-size: 0.9rem; border: none; border-radius: 4px; cursor: pointer;">
      ${currentCursorType.charAt(0).toUpperCase() + currentCursorType.slice(1)}
    </button>
  </div>

  <div>
    <label for="cursorSpeed" style="margin-right: 0.5rem; color: #a0a0a0;">Cursor Speed:</label>
    <button id="cursorSpeedButton" class="animate--iconSlam btn btn--fw btn--gloss btn--primary dhf" style="height: 2rem; width: 5rem; font-size: 0.9rem; border: none; border-radius: 4px; cursor: pointer;">
      ${
        currentCursorSpeed.charAt(0).toUpperCase() + currentCursorSpeed.slice(1)
      }
    </button>
  </div>
</div>

    `;

    container.appendChild(displayContainer);

    const wpmDisplay = displayContainer.querySelector("div:nth-child(1)");
    const targetWPMValueDisplay =
      displayContainer.querySelector("#targetWPMValue");
    const accuracyDisplay = displayContainer.querySelector("div:nth-child(3)");
    const targetWPMInput = displayContainer.querySelector("#targetWPM");
    const increaseWPMButton = displayContainer.querySelector("#increaseWPM");
    const decreaseWPMButton = displayContainer.querySelector("#decreaseWPM");
    const cursorTypeButton =
      displayContainer.querySelector("#cursorTypeButton");
    const cursorSpeedButton =
      displayContainer.querySelector("#cursorSpeedButton");

    const savedTargetWPM = localStorage.getItem("targetWPM") || "100";
    targetWPMInput.value = savedTargetWPM;
    targetWPMValueDisplay.textContent = `Target WPM: ${savedTargetWPM}`;

    function updateTargetWPM(value) {
      const targetWPM = Math.max(50, Math.min(200, parseInt(value, 10)));
      targetWPMInput.value = targetWPM;
      targetWPMValueDisplay.textContent = `Target WPM: ${targetWPM}`;
      localStorage.setItem("targetWPM", targetWPM);
    }

    increaseWPMButton.addEventListener("click", function () {
      updateTargetWPM(parseInt(targetWPMInput.value, 10) + 5);
    });

    decreaseWPMButton.addEventListener("click", function () {
      updateTargetWPM(parseInt(targetWPMInput.value, 10) - 5);
    });

    const cursorTypes = ["none", "block", "line"];
    const cursorSpeeds = ["slow", "medium", "fast"];

    cursorTypeButton.addEventListener("click", function () {
      let currentIndex = cursorTypes.indexOf(currentCursorType);
      currentCursorType = cursorTypes[(currentIndex + 1) % cursorTypes.length];
      cursorTypeButton.textContent =
        currentCursorType.charAt(0).toUpperCase() + currentCursorType.slice(1);
      localStorage.setItem("cursorType", currentCursorType);
      updateStyles();
    });

    cursorSpeedButton.addEventListener("click", function () {
      let currentIndex = cursorSpeeds.indexOf(currentCursorSpeed);
      currentCursorSpeed =
        cursorSpeeds[(currentIndex + 1) % cursorSpeeds.length];
      cursorSpeedButton.textContent =
        currentCursorSpeed.charAt(0).toUpperCase() +
        currentCursorSpeed.slice(1);
      localStorage.setItem("cursorSpeed", currentCursorSpeed);
      updateStyles();
    });

    const sliderContainer = document.createElement("div");
    sliderContainer.className = "sliderContainer";
    sliderContainer.style.padding = "10px";
    sliderContainer.style.backgroundColor = cardColor;
    sliderContainer.style.borderRadius = "8px";
    sliderContainer.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
    sliderContainer.style.marginBottom = "1rem";
    sliderContainer.style.color = "#e0e0e0";
    sliderContainer.style.fontSize = "0.9rem";
    sliderContainer.style.width = "20rem";
    sliderContainer.style.height = "fit-content";

    // Height slider
    const heightContainer = document.createElement("div");
    heightContainer.style.marginBottom = "10px";

    const heightLabel = document.createElement("label");
    heightLabel.textContent = "Adjust Height:";
    heightLabel.style.color = "#5d5aec";
    heightLabel.style.display = "block";
    heightLabel.style.marginBottom = "5px";

    const heightSlider = document.createElement("input");
    heightSlider.type = "range";
    heightSlider.min = "100";
    heightSlider.max = "1000";
    const savedHeight = localStorage.getItem("dashHeight") || "500";
    dashElement.style.height = `${savedHeight}px`;
    heightSlider.value = savedHeight;

    heightSlider.style.width = "100%";
    heightSlider.style.cursor = "pointer";

    heightContainer.appendChild(heightLabel);
    heightContainer.appendChild(heightSlider);
    sliderContainer.appendChild(heightContainer);

    heightSlider.addEventListener("input", function () {
      const heightValue = heightSlider.value;
      dashElement.style.height = `${heightValue}px`;
      localStorage.setItem("dashHeight", heightValue);
    });

    // Font size slider
    const fontSizeContainer = document.createElement("div");
    fontSizeContainer.style.marginBottom = "10px";

    const fontSizeLabel = document.createElement("label");
    fontSizeLabel.textContent = "Adjust Font Size:";
    fontSizeLabel.style.color = "#5d5aec";
    fontSizeLabel.style.display = "block";
    fontSizeLabel.style.marginBottom = "5px";

    const fontSizeSlider = document.createElement("input");
    fontSizeSlider.type = "range";
    fontSizeSlider.min = "20";
    fontSizeSlider.max = "80";
    fontSizeSlider.value = localStorage.getItem("dashFontSize") || "40";

    fontSizeSlider.style.width = "100%";
    fontSizeSlider.style.cursor = "pointer";

    fontSizeContainer.appendChild(fontSizeLabel);
    fontSizeContainer.appendChild(fontSizeSlider);
    sliderContainer.appendChild(fontSizeContainer);

    displayContainer.appendChild(sliderContainer);

    fontSizeSlider.addEventListener("input", function () {
      const newFontSize = fontSizeSlider.value;
      localStorage.setItem("dashFontSize", newFontSize);
      updateStyles();
    });

    updateStyles();
  }

  setInterval(() => {
    const experimentDiv = document.querySelector(".experiment");
    if (experimentDiv && container) {
      const experimentParent = experimentDiv.parentElement;
      container.parentElement.appendChild(experimentDiv);
    }
  }, 500);

  // Retain scroll position
  window.addEventListener("beforeunload", () => {
    localStorage.setItem("scrollPosition", window.scrollY);
  });

  window.addEventListener("load", () => {
    setTimeout(() => {
      const scrollPosition = localStorage.getItem("scrollPosition");
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10));
      }
    }, 1000);
  });

  // Fix stickers?
  setInterval(() => {
    const raceChatElement = document.querySelector(".raceChat");
    const heightValue = localStorage.getItem("dashHeight") || "500";
    if (raceChatElement) {
      raceChatElement.style.bottom = `calc(${parseInt(
        heightValue
      )}px + 2.5rem)`;
    }
  }, 500);
})();

(function () {
  let startTime = null;
  let intervalId = null;
  let peakWPM = 0;
  let skippedChars = 0;
  let totalIncorrectTypedCharacters = 0;
  const trackedIncorrectLetters = new Set();
  let totalCharactersInRace = 0;
  let errorsAllowed = 0;

  function addWPMDrawer() {
    const bgColor = localStorage.getItem("nt_bgColor") || "#060516";
    const textColor = localStorage.getItem("nt_textColor") || "#6864f6";
    const dashElement = document.querySelector(".dash");
    const cardColor = localStorage.getItem("nt_cardColor") || "#1a1a2e";

    if (dashElement) {
      const displayContainer = document.createElement("div");
      displayContainer.classList.add("nitro-monkey__wpm-container");
      displayContainer.style.display = "flex";
      displayContainer.style.gap = "2rem";
      displayContainer.style.fontSize = "25px";
      displayContainer.style.width = "100%";
      displayContainer.style.color = textColor;
      displayContainer.style.height = "2.5rem";
      displayContainer.style.background = bgColor;
      displayContainer.style.justifyContent = "space-between";
      displayContainer.style.borderBottom = "2px solid #0c0b18";
      displayContainer.innerHTML = `
      <div>WPM: <span id="wpmValue">0</span></div>
      <div>Accuracy: <span id="accuracyValue">100%</span></div>
      <div>Peak WPM: <span id="peakWpmValue">0</span></div>
      <div>Errors Allowed: <span id="errorsAllowedValue">0</span></div>
    `;
      dashElement.parentNode.insertBefore(displayContainer, dashElement);
    }
  }

  function calculateWPM(totalCharacters, timeInSeconds) {
    const wordsTyped = totalCharacters / 5;
    const WPM = (wordsTyped * 60) / timeInSeconds;
    return WPM;
  }

  function calculateErrorsAllowed(totalCharacters) {
    return Math.floor(0.04 * (totalCharacters - skippedChars));
  }

  function getCorrectlyTypedCharacterCount() {
    let correctLetters = document.querySelectorAll(
      ".dash-letter.is-correct.is-typed"
    )?.length;
    const skippedWord = Array.from(
      document.querySelectorAll(".dash-letter.is-correct.is-typed")
    );
    const nitorUsed = document.querySelector(".dash-nitro.is-used");
    if (nitorUsed && skippedWord) {
      correctLetters =
        correctLetters - skippedWord.pop().parentNode.children.length;
      if (skippedChars === 0) {
        skippedChars = skippedWord.pop().parentNode.children.length;
      }
    }
    return correctLetters - skippedChars;
  }

  function detectMistakes() {
    const incorrectLetters = document.querySelectorAll(
      ".dash-letter.is-incorrect"
    );
    incorrectLetters.forEach((letter) => {
      if (!trackedIncorrectLetters.has(letter)) {
        totalIncorrectTypedCharacters += 1;
        trackedIncorrectLetters.add(letter);

        errorsAllowed = Math.max(0, errorsAllowed - 1);
        document.getElementById("errorsAllowedValue").textContent =
          errorsAllowed;
      }
    });
  }

  function getTotalTypedCharacterCount() {
    const typedLetters = document.querySelectorAll(".dash-letter.is-typed");
    return typedLetters.length - skippedChars;
  }

  function getTotalCharacters() {
    const totalLetters = document.querySelectorAll(".dash-letter").length;
    return totalLetters - 1;
  }

  function calculateAccuracy(totalCharacters, incorrectCharacters) {
    const totalTyped = totalCharacters - incorrectCharacters;
    const total = totalCharacters;
    return (totalTyped / total) * 100;
  }

  const getTypedCharacterCount = () => {
    return document.querySelectorAll(".dash-letter.is-correct.is-typed")
      ?.length;
  };

  function updateWPM() {
    //if (!startTime) return;
    // const currentTime = new Date();
    // const elapsedTime = (currentTime - startTime) / 1000;

    const typedCharacters = getTypedCharacterCount();
    // const correctlyTypedCharacters = getCorrectlyTypedCharacterCount();

    detectMistakes();

    // const wpm = calculateWPM(correctlyTypedCharacters, elapsedTime);

    const wpm = document.querySelector(
      ".dash-metrics .list-item:nth-child(1) .g-b--8of12 .h4"
    );
    const accuracy = document.querySelector(
      ".dash-metrics .list-item:nth-child(2) .g-b--8of12 .h4"
    );

    document.getElementById("wpmValue").textContent = wpm.textContent;
    if (wpm.textContent > parseInt(peakWPM)) {
      peakWPM = wpm.textContent;
      document.getElementById("peakWpmValue").textContent = Math.round(peakWPM);
    }

    // const accuracy = calculateAccuracy(
    //   correctlyTypedCharacters,
    //   totalIncorrectTypedCharacters
    // );
    document.getElementById("accuracyValue").textContent = `${
      accuracy?.textContent || 100
    }%`;
    // if (typedCharacters >= totalCharactersInRace) {
    //   createPostRaceInfo();
    //   stopWPMTimer();
    // }
    fetchStats();
  }

  function createPostRaceInfo() {
    const wpmContainer = document.querySelector(".nitro-monkey__wpm-container");
    if (wpmContainer) {
      wpmContainer.style.bottom = "-3rem";
      wpmContainer.style.position = "absolute";
    }
  }

  function startWPMTimer() {
    if (!startTime) {
      startTime = new Date();
      peakWPM = 0;
      totalIncorrectTypedCharacters = 0;
      trackedIncorrectLetters.clear();

      totalCharactersInRace = getTotalCharacters();

      errorsAllowed = calculateErrorsAllowed(totalCharactersInRace);
      document.getElementById("errorsAllowedValue").textContent = errorsAllowed;

      intervalId = setInterval(updateWPM, 100);
    }
  }

  function stopWPMTimer() {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }

  const fetchStats = () => {
    const wpmUI = document.querySelector("#wpmValue");
    const accuracyUI = document.querySelector("#accuracyValue");
    const wpmElement = document.querySelector(
      ".dash-metrics .list-item:nth-child(1) .g-b--8of12 .h4"
    );
    const accuracyElement = document.querySelector(
      ".dash-metrics .list-item:nth-child(2) .g-b--8of12 .h4"
    );
    const targetWPM = parseInt(localStorage.getItem("targetWPM"), 10) || 100;

    const green = "#00FF7F";
    const yellow = "#FFD700";
    const red = "red";

    if (wpmElement) {
      const wpmValue = parseInt(wpmElement.textContent, 10) || 0;

      if (wpmValue >= targetWPM - 5 && wpmValue <= targetWPM + 5) {
        wpmUI.style.color = green;
      } else if (wpmValue < targetWPM - 10) {
        wpmUI.style.color = red;
      } else if (wpmValue < targetWPM - 5) {
        wpmUI.style.color = yellow;
      } else if (wpmValue > targetWPM + 5) {
        wpmUI.style.color = "blue";
      }
    }

    if (accuracyElement) {
      const accuracyValue = parseFloat(accuracyElement.textContent) || 0;

      if (accuracyValue < 94) {
        accuracyUI.style.color = red;
      } else if (accuracyValue >= 94 && accuracyValue < 96) {
        accuracyUI.style.color = yellow;
      } else {
        accuracyUI.style.color = green;
      }
    }
  };

  function monitorServerEvents() {
    const raceContainer = document.getElementById("raceContainer");
    const reactObj = raceContainer ? findReact(raceContainer) : null;
    const server = reactObj.server;

    if (!reactObj) {
      return;
    }

    if (!server) {
      setTimeout(monitorServerEvents, 1000);
      return;
    }

    server.on("status", (e) => {
      if (e.status === "racing") {
        startWPMTimer();
      }
    });

   server.on("update", (e) => {
      if (reactObj.state.raceStatus === "finished") {
          createPostRaceInfo();
      }
    });
  }

  function initializeScript() {
    addWPMDrawer();
    monitorServerEvents();
  }

  window.addEventListener("load", () => {
    setTimeout(() => {
      initializeScript();
    }, 1000);
  });
})();
