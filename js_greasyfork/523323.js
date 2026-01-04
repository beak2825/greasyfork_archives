// ==UserScript==
// @name         SENSE Crossword Auto Solver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically solves crossword puzzles on specified pages
// @author       HmTici
// @match        https://arche.univ-lorraine.fr/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523323/SENSE%20Crossword%20Auto%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/523323/SENSE%20Crossword%20Auto%20Solver.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function waitForIframe() {
    return new Promise((resolve) => {
      const check = () => {
        const iframe = document.querySelector(".h5p-iframe");
        if (iframe) {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc.querySelector(".h5p-crossword-cell-content")) {
              resolve(iframe);
              return;
            }
          } catch (e) {
            console.error("Error accessing iframe:", e);
          }
        }
        setTimeout(check, 50);
      };
      check();
    });
  }

  async function solveCrossword() {
    console.log("Solve function started");

    const iframe = await waitForIframe();
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    const inputs = iframeDoc.querySelectorAll(".h5p-crossword-cell-content");
    console.log("Found inputs:", inputs.length);

    if (inputs.length === 0) {
      console.error("No crossword cells found!");
      return;
    }

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZéèêïîùô'";

    for (const input of inputs) {
      const td = input.closest("td");
      if (!td || td.classList.contains("h5p-crossword-cell-empty")) continue;

      if (!input.disabled) {
        for (const letter of letters) {
          try {
            input.value = letter;

            const inputEvent = new InputEvent("input", {
              bubbles: true,
              cancelable: true,
              inputType: "insertText",
              data: letter,
            });
            input.dispatchEvent(inputEvent);

            const changeEvent = new Event("change", {
              bubbles: true,
            });
            input.dispatchEvent(changeEvent);

            // il sert à rien mais c'est satisfaisant
            await new Promise((resolve) => setTimeout(resolve, 10));

            if (td.classList.contains("h5p-crossword-solution-correct")) {
              console.log(`Found correct letter: ${letter}`);
              break;
            }
          } catch (error) {
            console.error("Error testing letter:", error);
          }
        }
      }
    }
  }

  async function init() {
    await waitForIframe();
    const solveButton = document.createElement("button");
    solveButton.textContent = "Résoudre";
    solveButton.style.position = "fixed";
    solveButton.style.top = "10px";
    solveButton.style.right = "10px";
    solveButton.style.zIndex = "9999";
    solveButton.onclick = solveCrossword;
    document.body.appendChild(solveButton);
  }

  init().catch(console.error);
})();
