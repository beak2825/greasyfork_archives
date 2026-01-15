// ==UserScript==
// @name        PUP Survey Helper
// @namespace   Violentmonkey Scripts
// @match       https://survey.pup.edu.ph/apps/evaluation/survey/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @version     4.0
// @author      intMeinVoid
// @icon        https://www.pup.edu.ph/about/images/PUPLogo.png
// @description Adds a button to help fill out PUP faculty evaluation surveys with organic randomization
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/525058/PUP%20Survey%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/525058/PUP%20Survey%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const CONFIG = {
    DEFAULT_AVERAGE: 2.5,
    PRESETS: [2.0, 2.5, 3.0, 3.5, 4.0, 5.0],
    STORAGE_KEY: "pupSurveyLastUsedRating",
    COMMENT_TEXT: "No further comments. satisfied with the performance.",
  };

  // --- State Management ---
  const state = {
    isMinimized: false,
    lastRating: parseFloat(
      GM_getValue(CONFIG.STORAGE_KEY, CONFIG.DEFAULT_AVERAGE),
    ),
  };

  // --- UI Construction ---
  const container = document.createElement("div");
  container.id = "pup-survey-helper";
  container.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        font-family: 'Segoe UI', Arial, sans-serif;
        background: rgba(255, 255, 255, 0.98);
        padding: 0; border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        border: 1px solid #e0e0e0;
        overflow: hidden;
        transition: height 0.3s ease;
    `;

  // Header with Minimize Button
  const header = document.createElement("div");
  header.style.cssText = `
        padding: 10px; background: #880000; color: white;
        display: flex; justify-content: space-between; align-items: center;
        font-weight: bold; font-size: 13px; cursor: pointer;
    `;
  header.innerHTML = `<span>🎓 PUP Eval Helper</span> <span id="toggle-icon">▼</span>`;

  const contentArea = document.createElement("div");
  contentArea.style.cssText = `padding: 12px; display: flex; flex-direction: column; gap: 8px;`;

  // Toggle Logic
  header.onclick = () => {
    state.isMinimized = !state.isMinimized;
    contentArea.style.display = state.isMinimized ? "none" : "flex";
    header.querySelector("#toggle-icon").textContent = state.isMinimized
      ? "▲"
      : "▼";
  };

  const createButton = (text, onClick, isPrimary = false, title = "") => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.title = title;
    btn.style.cssText = `
            padding: 8px 12px;
            background-color: ${isPrimary ? "#900000" : "#f8f9fa"};
            color: ${isPrimary ? "white" : "#333"};
            border: 1px solid ${isPrimary ? "#900000" : "#ddd"};
            border-radius: 4px; cursor: pointer; font-size: 13px;
            transition: all 0.2s; flex: 1;
        `;
    btn.onmouseenter = () => (btn.style.filter = "brightness(0.95)");
    btn.onmouseleave = () => (btn.style.filter = "brightness(1)");
    btn.onclick = onClick;
    return btn;
  };

  // Preset Grid
  const presetsContainer = document.createElement("div");
  presetsContainer.style.cssText = `display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;`;

  CONFIG.PRESETS.forEach((preset) => {
    presetsContainer.appendChild(
      createButton(preset, () => setEvaluation(preset)),
    );
  });

  // Action Buttons
  const mainButton = createButton(
    `Apply (${state.lastRating})`,
    () => setEvaluation(),
    true,
  );

  const commentButton = createButton(
    "✍️ Auto Comment",
    () => {
      const textAreas = document.querySelectorAll("textarea");
      if (textAreas.length === 0)
        return showToast("No comment boxes found", true);
      textAreas.forEach((area) => {
        if (!area.value) area.value = CONFIG.COMMENT_TEXT;
      });
      showToast(`Filled ${textAreas.length} comment boxes`);
    },
    false,
    "Fill empty comment boxes",
  );

  contentArea.append(presetsContainer, mainButton, commentButton);
  container.append(header, contentArea);
  document.body.appendChild(container);

  // --- Logic Utilities ---

  // Fisher-Yates Shuffle Algorithm
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const showToast = (message, isError = false) => {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: ${isError ? "#dc3545" : "#28a745"};
            color: white; padding: 10px 20px; border-radius: 4px;
            z-index: 10001; font-size: 14px; box-shadow: 0 3px 6px rgba(0,0,0,0.2);
            animation: fadeIn 0.3s ease-in-out;
        `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // --- Main Logic ---
  const setEvaluation = async (targetAvg) => {
    try {
      if (targetAvg === undefined) {
        const input = prompt(
          "Enter target average (1.0 - 5.0):",
          state.lastRating,
        );
        if (input === null) return;
        targetAvg = parseFloat(input);
      }

      if (isNaN(targetAvg) || targetAvg < 1 || targetAvg > 5) {
        throw new Error("Please enter a number between 1 and 5");
      }

      // Save preference
      state.lastRating = targetAvg;
      GM_setValue(CONFIG.STORAGE_KEY, targetAvg);
      mainButton.textContent = `Apply (${targetAvg})`;

      // Identify Questions
      // Heuristic: Input names usually follow 'q1', 'q2' pattern in PUP SIS
      // We count unique names starting with 'q' followed by a number
      const allRadios = Array.from(
        document.querySelectorAll('input[type="radio"]'),
      );
      const questionNames = [
        ...new Set(allRadios.map((r) => r.name).filter((n) => /^q\d+/.test(n))),
      ]; // Filter ensures we only get question inputs

      const totalQuestions = questionNames.length;

      if (totalQuestions === 0)
        throw new Error("No evaluation questions detected.");

      // Calculate Math
      const exactTotal = targetAvg * totalQuestions;
      const roundedTotal = Math.round(exactTotal);
      const lowerValue = Math.floor(targetAvg);
      const higherValue = Math.ceil(targetAvg);
      const numberOfHigher = roundedTotal - lowerValue * totalQuestions;

      // Create Score Distribution Array
      let scoreDistribution = [];
      for (let i = 0; i < numberOfHigher; i++)
        scoreDistribution.push(higherValue);
      for (let i = 0; i < totalQuestions - numberOfHigher; i++)
        scoreDistribution.push(lowerValue);

      // SHUFFLE the scores to make it look organic
      scoreDistribution = shuffleArray(scoreDistribution);

      // Execute
      mainButton.textContent = "Processing...";
      mainButton.disabled = true;

      await new Promise((resolve) =>
        requestAnimationFrame(() => {
          let successCount = 0;

          // Iterate through the identified question names (q1, q2, etc.)
          questionNames.forEach((qName, index) => {
            const scoreToSet = scoreDistribution[index];

            // Extract the question number from the name (e.g. "q15" -> "15")
            const targetRadio = document.querySelector(
              `input[name="${qName}"][value="${scoreToSet}"]`,
            );

            if (targetRadio) {
              targetRadio.checked = true;
              successCount++;
            }
          });

          showToast(
            `Filled ${successCount}/${totalQuestions} items (Avg: ~${targetAvg})`,
          );
          mainButton.textContent = `Apply (${targetAvg})`;
          mainButton.disabled = false;
          resolve();
        }),
      );
    } catch (error) {
      showToast(error.message, true);
      mainButton.disabled = false;
    }
  };

  // Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyE") {
      e.preventDefault();
      setEvaluation();
    }
  });

  // Style Injection
  const style = document.createElement("style");
  style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`;
  document.head.appendChild(style);
})();
