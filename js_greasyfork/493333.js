// ==UserScript==
// @grant             none
// @version           2.1.1
// @author            eye-wave
// @icon              https://raw.githubusercontent.com/eye-wave/greasy-fork/main/packages/samequizy-solver/assets/icon.svg
// @license           GPL-3.0+
// @name:pl           samequizy.pl - Quiz solver
// @description:pl    Tworzy przycisk do natychmiastowego rozwiązania quizu.
// @name              samequizy.pl - Quiz solver
// @namespace         samequizy.pl utils
// @match             https://samequizy.pl/*
// @description       Creates a button for solving the quiz instantly.
// @downloadURL https://update.greasyfork.org/scripts/493333/samequizypl%20-%20Quiz%20solver.user.js
// @updateURL https://update.greasyfork.org/scripts/493333/samequizypl%20-%20Quiz%20solver.meta.js
// ==/UserScript==
// unplugin-icons:~icons/material-symbols/close-small-outline-rounded
var close_small_outline_rounded_default = '<svg viewBox="0 0 24 24" width="1.2em" height="1.2em" ><path fill="currentColor" d="m12 13.4l-2.9 2.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l2.9-2.9l-2.9-2.875q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l2.9 2.9l2.875-2.9q.275-.275.7-.275t.7.275q.3.3.3.713t-.3.687L13.375 12l2.9 2.9q.275.275.275.7t-.275.7q-.3.3-.712.3t-.688-.3z"/></svg>';

// unplugin-icons:~icons/game-icons/perspective-dice-six-faces-random
var perspective_dice_six_faces_random_default = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="currentColor" d="M255.76 44.764c-6.176 0-12.353 1.384-17.137 4.152L85.87 137.276c-9.57 5.536-9.57 14.29 0 19.826l152.753 88.36c9.57 5.536 24.703 5.536 34.272 0l152.753-88.36c9.57-5.535 9.57-14.29 0-19.825l-152.753-88.36c-4.785-2.77-10.96-4.153-17.135-4.153m-.824 53.11q13.52.146 24.31 6.192q7.38 4.136 9.666 9.438q2.21 5.261.26 13.865l-1.6 5.706q-1.59 6.125-.66 8.81q.854 2.645 4.242 4.544l3.39 1.898l-33.235 18.62l-3.693-2.067q-6.176-3.459-7.883-7.82q-1.782-4.402.594-14.005l1.524-5.748q1.33-5.135.26-8.418q-.98-3.336-4.444-5.277q-5.273-2.954-12.63-2.123q-7.433.79-15.35 5.225q-7.457 4.178-13.55 10.46q-6.167 6.243-10.587 14.288L171.9 138.21q7.977-8.01 15.676-14.013q7.7-6 16.262-10.8q22.464-12.586 41.78-14.967a69 69 0 0 1 9.32-.557zm50.757 56.7l26.815 15.024l-33.235 18.62l-26.816-15.023l33.236-18.62zM75.67 173.84c-5.753-.155-9.664 4.336-9.664 12.28v157.696c0 11.052 7.57 24.163 17.14 29.69l146.93 84.848c9.57 5.526 17.14 1.156 17.14-9.895V290.76c0-11.052-7.57-24.16-17.14-29.688l-146.93-84.847c-2.69-1.555-5.225-2.327-7.476-2.387zm360.773.002c-2.25.06-4.783.83-7.474 2.385l-146.935 84.847c-9.57 5.527-17.14 18.638-17.14 29.69v157.7c0 11.05 7.57 15.418 17.14 9.89L428.97 373.51c9.57-5.527 17.137-18.636 17.137-29.688v-157.7c0-7.942-3.91-12.432-9.664-12.278zm-321.545 63.752q9.83 2.05 17.954 5.013a99.6 99.6 0 0 1 15.68 7.325q19.82 11.445 30.218 26.082q10.398 14.55 10.398 31.04q0 8.46-3.168 13.364q-3.169 4.818-10.804 8.094l-5.2 1.92q-5.524 2.163-7.23 4.46q-1.705 2.207-1.705 6.092v3.885l-29.325-16.933v-4.23q-.001-7.08 2.68-10.97q2.681-3.977 11.292-7.467l5.2-2.006q4.63-1.815 6.742-4.567q2.191-2.704 2.192-6.676q0-6.041-3.9-11.66q-3.899-5.705-10.885-9.74q-6.58-3.798-14.217-5.272q-7.636-1.56-15.922-.645v-27.11zm269.54 8.607q2.282 0 4.232.493q10.398 2.543 10.398 19.034q0 8.46-3.168 17.023q-3.168 8.476-10.804 20.568l-5.2 7.924q-5.524 8.542-7.23 12.807q-1.705 4.178-1.705 8.063v3.885l-29.325 16.932v-4.23q0-7.08 2.68-14.067q2.683-7.073 11.292-20.504l5.2-8.01q4.63-7.164 6.742-12.354q2.191-5.238 2.192-9.21q0-6.042-3.898-7.158q-3.9-1.201-10.887 2.83q-6.58 3.801-14.215 11.145q-7.635 7.259-15.922 17.74v-27.11q9.83-9.3 17.95-15.718q8.126-6.417 15.68-10.777q16.106-9.3 25.99-9.307zm-252.723 94.515l29.326 16.93v30.736l-29.325-16.93v-30.735zm239.246 8.06v30.735l-29.325 16.93v-30.733l29.326-16.932z"/></svg>';

// src/index.js
var IMAGE_HEIGHT = 96;
function createButton() {
  const button = document.createElement("button");
  button.textContent = "Rozwi\u0105\u017C";
  button.className = "follow-btn user-action";
  const [parentElement] = document.getElementsByClassName("pull-right") ?? [document.body];
  const [insertBeforeElement] = document.getElementsByClassName("fav-btn") ?? [];
  if (!insertBeforeElement) {
    parentElement.append(button);
    return;
  }
  parentElement.insertBefore(button, insertBeforeElement);
  button.addEventListener("click", handleButtonClick);
  function handleButtonClick() {
    try {
      const quizdata = getQuizData();
      const modal = createModal(quizdata);
      modal.onclose = (id) => {
        if (typeof id !== "string")
          return;
        if (id === "act__quit")
          return;
        if (id === "ans__random")
          return answerRandomly();
        try {
          solve(quizdata, id);
        } catch {
        }
        button.remove();
      };
    } catch {
    }
  }
  return button;
}
function createModal(quizdata) {
  const dialog = document.createElement("dialog");
  const dialogStyles = [
    "padding: 2rem",
    "display: flex",
    "flex-wrap: wrap",
    "justify-content: center",
    "align-items: center",
    "gap: 2rem",
    "background: #b3b3b3",
    "border:0"
  ];
  dialog.setAttribute("style", dialogStyles.join(";"));
  function createAnswerElement(img, id, title) {
    const div = document.createElement("div");
    div.className = "answer-inner";
    div.dataset.id = id;
    div.style.width = "fit-content";
    if (title.length > 18)
      title = `${title.substring(0, 17)}...`;
    div.innerHTML += `<div class="text">${title}</div>`;
    if (img)
      div.innerHTML += img;
    return div;
  }
  const elements = quizdata.results.map((result, i) => {
    const imgSrc = result.description.match(/https?:\/\/.+\.jpe?g/)?.[0]?.replace(/https?/, "https");
    const { id, title = `Opcja ${i}` } = result;
    const img = `<img src="${imgSrc}" height="${IMAGE_HEIGHT}px">`;
    return createAnswerElement(img, id, title);
  });
  elements.push(
    createAnswerElement(perspective_dice_six_faces_random_default.replace(/height="\d+"/, `height="${IMAGE_HEIGHT}"`), "ans__random", "Losowa")
  );
  elements.push(createAnswerElement(close_small_outline_rounded_default.replace(/height="\d+"/, `height="${IMAGE_HEIGHT}"`), "act__quit", ""));
  elements.forEach((element) => {
    dialog.append(element);
    element.addEventListener("click", () => {
      dialog.onclose(element.dataset.id);
      dialog.close();
      dialog.remove();
    });
  });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "Escape")
      e.preventDefault();
  });
  document.body.append(dialog);
  dialog.showModal();
  return dialog;
}
function getQuizData() {
  const [script] = [...document.querySelectorAll("script")].filter((script2) => script2.innerHTML.includes("var quizData"));
  if (!script)
    throw Error();
  const [quizData] = script.innerHTML.match(/var quizData = .+;$/m) ?? [];
  if (!quizData)
    throw Error();
  return JSON.parse(quizData.slice(15, -1));
}
function solve(quizdata, resultId) {
  document.querySelectorAll(".question-answers").forEach((question, i) => {
    const questionData = quizdata.questions[i];
    if (!questionData)
      return;
    const answer = questionData.answers.map((answer2) => {
      const ids = answer2.result.split(",");
      let score = 0;
      for (const id of ids) {
        if (id === resultId)
          score++;
      }
      return { score, answer: answer2 };
    }).sort((a, b) => a.score - b.score).at(-1)?.answer;
    if (!answer)
      throw Error();
    const answerElements = [...question.querySelectorAll(".answer")];
    const [pickedAnswer] = answerElements.filter((el) => el.textContent === answer.text) ?? [];
    pickedAnswer?.click();
  });
}
function answerRandomly() {
  document.querySelectorAll(".question-answers").forEach((question) => {
    const answerElements = question.querySelectorAll(".answer");
    const randomAnswer = answerElements[Math.floor(Math.random() * answerElements.length)];
    randomAnswer?.click();
  });
}
createButton();
