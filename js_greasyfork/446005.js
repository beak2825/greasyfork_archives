// ==UserScript==
// @name         Udemy - Copy from Practice Test
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Copy questions and answers from Udemy practice exams with ease
// @author       John Farrell (https://www.johnfarrell.dev/)
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @downloadURL https://update.greasyfork.org/scripts/446005/Udemy%20-%20Copy%20from%20Practice%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/446005/Udemy%20-%20Copy%20from%20Practice%20Test.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Select the node that will be observed for mutations
  const targetNode = document.querySelector("body");

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  const callback = function (mutationsList, observer) {
    // if mutation is caused by our added button elements return to avoid infinite recursion
    if (
      mutationsList.find(
        (el) => el.addedNodes[0]?.id === "userscript-added-button"
      )
    ) {
      return;
    }

    const questionSections = Array.from(
      document.querySelectorAll(
        'div[class^="result-pane--question-result-pane-wrapper"]'
      )
    );
    questionSections.forEach((el) => {
      // if button already added to the question/answer form return
      if (el.querySelector("#userscript-added-button")) return;

      const question = el.querySelector("#question-prompt").textContent.trim();

      const answerSection = el.querySelector(
        'div[class^="result-pane--question-result-pane-expanded-content"]'
      );

      const allAnswers = Array.from(
        answerSection.querySelectorAll(
          'div[class^="answer-result-pane--answer-body"]'
        )
      )
        .map((el) => el.textContent.trim())
        .join("\n\n");

      const correctAnswers = Array.from(
        answerSection.querySelectorAll(
          'div[class^="answer-result-pane--answer-correct"]'
        )
      )
        .map((el) => {
          return el
            .querySelector('div[class^="answer-result-pane--answer-body"]')
            .textContent.trim();
        })
        .join("\n\n");

      const explanation = el
        .querySelector("#overall-explanation")
        ?.textContent.trim();

      const copyQuestionButton = document.createElement("button");
      copyQuestionButton.setAttribute("id", "userscript-added-button");
      copyQuestionButton.innerHTML = "Copy Question";

      copyQuestionButton.addEventListener("click", () => {
        navigator.clipboard.writeText(question + "\n\n" + allAnswers);
      });

      const copyAnswerButton = document.createElement("button");
      copyAnswerButton.setAttribute("id", "userscript-added-button");
      copyAnswerButton.innerHTML = "Copy Answer";

      copyAnswerButton.addEventListener("click", () => {
        navigator.clipboard.writeText(correctAnswers + "\n\n" + explanation);
      });

      el.append(copyQuestionButton);
      el.append(copyAnswerButton);
    });
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
})();
