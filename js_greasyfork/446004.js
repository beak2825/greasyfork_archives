// ==UserScript==
// @name         Udemy - Copy from Section Quiz
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Easily copy questions and answers from Udemy section quizzes
// @author       John Farrell (https://www.johnfarrell.dev/)
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @downloadURL https://update.greasyfork.org/scripts/446004/Udemy%20-%20Copy%20from%20Section%20Quiz.user.js
// @updateURL https://update.greasyfork.org/scripts/446004/Udemy%20-%20Copy%20from%20Section%20Quiz.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Select the node that will be observed for mutations
  const targetNode = document.querySelector("body");

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  const copyQuestionId = "userscript-added-button-copy-question";
  const copyAnswerOptionsId = "userscript-added-button-copy-answer-options";
  const copyAnswerId = "userscript-added-button-copy-answer";
  const copyAdditionalInformationId =
    "userscript-added-button-copy-additional-information";
  const sharedContainerId = "userscript-shared-button-container";

  const ourButtonIds = [
    copyQuestionId,
    copyAnswerOptionsId,
    copyAnswerId,
    copyAdditionalInformationId,
    sharedContainerId,
  ];

  const selectors = {
    quizPage: 'div[class^="compact-quiz-container--compact-quiz-container--"]',
    nextQuestionButton: 'button[data-purpose="next-question-button"]',
    quizFooter: 'div[class^="quiz-view--container--"] footer',
    questionContainer: "#question-prompt",
    answersContainer: "form ul",
    possibleAnswersContainer: 'ul[aria-labelledby="question-prompt"]',
  };

  const udemyText = {
    nextQuestion: {
      check: "Check answer",
      next: "Next",
      results: "See results",
    },
  };

  const appliedText = {
    copyQuestion: "Copy Question",
    copyPossibleAnswerTexts: "Copy Possible Options",
    copyAnswer: "Copy Answer",
    copyAdditionalInformation: "Copy explanation",
  };

  function ensureContainer() {
    const quizFooter = document.querySelector(selectors.quizFooter);

    let container = document.getElementById(sharedContainerId);
    if (!container) {
      container = document.createElement("div");
      container.setAttribute("id", sharedContainerId);
      container.style.display = "flex";
      container.style.gap = "8px";
      container.style.flexWrap = "wrap";
      quizFooter?.append(container);
    }
    return container;
  }

  const callback = function (mutationsList) {
    const addedNodes = mutationsList
      .map((element) => {
        return element.addedNodes;
      })
      .filter((nodeList) => nodeList.length > 0 && nodeList[0].id)
      .map((node) => node[0].id);

    const isOurMutation = addedNodes.reduce((prev, curr) => {
      if (prev) return prev;

      return ourButtonIds.includes(curr);
    }, false);
    if (isOurMutation) return;

    const isQuizPage = document.querySelector(selectors.quizPage);
    if (!isQuizPage) return;

    const nextQuestionButton = document.querySelector(
      selectors.nextQuestionButton
    );
    if (!nextQuestionButton) return;

    const isQuestionStep =
      nextQuestionButton.textContent === udemyText.nextQuestion.check;

    const isAnswerStep =
      nextQuestionButton.textContent === udemyText.nextQuestion.next ||
      nextQuestionButton.textContent === udemyText.nextQuestion.results;

    if (isQuestionStep) {
      const container = ensureContainer();

      if (document.getElementById(copyQuestionId)) return;
      if (document.getElementById(copyAnswerOptionsId)) return;

      // remove the copy answer button added from isAnswerStep
      document.getElementById(copyAnswerId)?.remove();

      // remove the copy additional information button added from isAnswerStep
      document.getElementById(copyAdditionalInformationId)?.remove();

      const questionContainer = document.querySelector(
        selectors.questionContainer
      );
      const question = questionContainer.innerText;

      const possibleAnswersContainer = document.querySelector(
        selectors.possibleAnswersContainer
      );
      const possibleAnswers = Array.from(
        possibleAnswersContainer.querySelectorAll("li")
      )
        .map((el) => el.innerText)
        .join("\n\n");

      const copyQuestionButton = document.createElement("button");
      copyQuestionButton.setAttribute("id", copyQuestionId);
      copyQuestionButton.innerHTML = appliedText.copyQuestion;
      copyQuestionButton.addEventListener("click", () => {
        navigator.clipboard.writeText(question);
      });

      const copyAnswerOptionsButton = document.createElement("button");
      copyAnswerOptionsButton.setAttribute("id", copyAnswerOptionsId);
      copyAnswerOptionsButton.innerHTML = appliedText.copyPossibleAnswerTexts;
      copyAnswerOptionsButton.addEventListener("click", () => {
        navigator.clipboard.writeText(possibleAnswers);
      });

      container.append(copyQuestionButton);
      container.append(copyAnswerOptionsButton);

      return;
    }

    if (isAnswerStep) {
      const container = ensureContainer();

      if (document.getElementById(copyAnswerId)) return;
      if (document.getElementById(copyAdditionalInformationId)) return;

      // remove the copy question button added from isAnswerStep
      document.getElementById(copyQuestionId)?.remove();

      // remove the copy possible options button added from isAnswerStep
      document.getElementById(copyAnswerOptionsId)?.remove();

      const answersContainer = document.querySelector(
        selectors.answersContainer
      );
      if (!answersContainer) return;

      const allAnswerContainers = answersContainer.querySelectorAll("li");
      const correctAnswerContainers = Array.from(allAnswerContainers).filter(
        (element) => {
          const radioInput = element.querySelector("input[type=radio]");

          return radioInput.checked;
        }
      );

      const correctAnswers = correctAnswerContainers
        .map((element) => element.querySelector("p").textContent)
        .join("\n\n");

      const copyAnswerButton = document.createElement("button");
      copyAnswerButton.setAttribute("id", copyAnswerId);
      copyAnswerButton.innerHTML = appliedText.copyAnswer;
      copyAnswerButton.addEventListener("click", () => {
        navigator.clipboard.writeText(correctAnswers);
      });

      container.append(copyAnswerButton);

      const additionalInfo = correctAnswerContainers
        .map(
          (element) =>
            element.querySelector(".ud-text-sm > div > div").textContent
        )
        .join("\n\n");

      if (additionalInfo) {
        const additionalInfoButton = document.createElement("button");
        additionalInfoButton.setAttribute("id", copyAdditionalInformationId);
        additionalInfoButton.innerHTML = appliedText.copyAdditionalInformation;
        additionalInfoButton.addEventListener("click", () => {
          navigator.clipboard.writeText(additionalInfo);
        });

        container.append(additionalInfoButton);
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
})();
