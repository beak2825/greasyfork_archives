// ==UserScript==
// @name         GregMat Cover Answer Choices
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide answer choices on GregMat
// @author       ganeshh123
// @match        https://www.gregmat.com/problems/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469230/GregMat%20Cover%20Answer%20Choices.user.js
// @updateURL https://update.greasyfork.org/scripts/469230/GregMat%20Cover%20Answer%20Choices.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  const hideAnswerButtonText = "Cover Answer Choices";
  const showAnswerButtonText = "Show Answer Choices";

  let answersHidden = false;

  const buildElement = (type, attributes, ...children) => {
    const newElement = document.createElement(type);

    Object.keys(attributes).forEach((key) => {
      newElement.setAttribute(key, attributes[key]);
    });

    children.forEach((child) => {
      if (typeof child === "string") {
        newElement.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        newElement.appendChild(child);
      }
    });

    return newElement;
  };

  const showHideAnswerChoices = (shouldHide) => {
    const labels = [...document.querySelectorAll("label")];

    labels.forEach((label) => {
      label.style.opacity = shouldHide ? 0 : 100;
    });

    const hAB = document.querySelector("#hide-answer-button");

    if (hAB) {
      hAB.firstChild.innerText = shouldHide
        ? showAnswerButtonText
        : hideAnswerButtonText;
    }

    answersHidden = shouldHide;
  };

  const documentChanged = () => {
    const buttons = [...document.querySelectorAll("button")];

    const resetButtons = buttons.filter((btn) => {
      if (btn.firstChild.innerText === "Reset") {
        return true;
      }
    });

    if (resetButtons.length !== 0) {
      // Question popup is opened

      const resetButton = resetButtons[0];
      const hAB = document.querySelector("#hide-answer-button");
      if (hAB) {
        return;
      } else {
        const hideAnswerButton = buildElement(
          "button",
          {
            class:
              "px-3 py-0.5 text-sm border border-gray-600 rounded-full flex flex-row items-center space-x-2",
            id: "hide-answer-button",
          },
          buildElement("span", {}, hideAnswerButtonText)
        );
        hideAnswerButton.onclick = () => showHideAnswerChoices(!answersHidden);

        const buttonRow = resetButton.parentElement;
        buttonRow.prepend(hideAnswerButton);

        // Observe for question change
        const questionChangeObserver = new MutationObserver(() =>
          showHideAnswerChoices(answersHidden)
        );

        questionChangeObserver.observe(buttonRow.nextSibling, {
          subtree: true,
          childList: true,
        });
      }
    }
  };

  // Observe for question modal popping up
  const questionModalObserver = new MutationObserver(documentChanged);
  questionModalObserver.observe(document.body, {
    subtree: true,
    childList: true,
  });
})();
