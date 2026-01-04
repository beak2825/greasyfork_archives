// ==UserScript==
// @grant             none
// @version           1.0.1
// @author            eye-wave
// @icon              https://raw.githubusercontent.com/eye-wave/greasy-fork/main/packages/idrlabs-solver/assets/icon.svg
// @license           GPL-3.0+
// @description:de    Erstellt eine Schaltfläche, um das Quiz mit zufälligen Antworten zu lösen.
// @description:es    Crea un botón para resolver el cuestionario con respuestas aleatorias.
// @description:fr    Crée un bouton pour résoudre le quiz avec des réponses aléatoires.
// @description:jp    ランダムな回答でクイズを解くためのボタンを作成します。
// @description:pl    Tworzy przycisk do rozwiązania quizu z losowymi odpowiedziami.
// @description:ru    Создает кнопку для решения викторины с случайными ответами.
// @name:de           idrlabs.com - Solver
// @name:es           idrlabs.com - Solucionador
// @name:fr           idrlabs.com - Solveur
// @name:jp           idrlabs.com - ソルバー
// @name:pl           idrlabs.com - Solver
// @name:ru           idrlabs.com - Решатель
// @name              idrlabs.com - Solver
// @namespace         idrlabs.com utils
// @match             https://www.idrlabs.com/*.php
// @description       Creates a button to solve the quiz with random answers.
// @downloadURL https://update.greasyfork.org/scripts/493331/idrlabscom%20-%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/493331/idrlabscom%20-%20Solver.meta.js
// ==/UserScript==
// ../../utils/src/index.ts
function $(query) {
  return document.querySelectorAll(query);
}
function $s(query) {
  return document.querySelector(query);
}

// src/index.ts
var randomInt = (max) => Math.floor(Math.random() * max);
var getRandomElement = (array) => array[randomInt(array.length)];
var container = $s(".process");
if (container) {
  const button = document.createElement("span");
  button.textContent = "Solve";
  button.className = "qnav";
  button.addEventListener("click", handleButtonClick, { once: true });
  container.appendChild(button);
}
function handleButtonClick() {
  const agreeButton = $s(".agree");
  const disagreeButton = $s(".disagree");
  const ratingElements = Array.from({ length: 5 }).map((_, index) => $s(`.t${index + 1}`));
  const rangeInput = $s("input[type='range']");
  const finishButton = $s("[data-finish]");
  const minValue = +(rangeInput?.getAttribute("min") ?? 0);
  const maxValue = +(rangeInput?.getAttribute("max") ?? 5) + 1;
  const clickRandomRating = () => {
    if (ratingElements.every((element) => element)) {
      getRandomElement(ratingElements)?.click();
      return;
    }
    if (rangeInput) {
      rangeInput.value = `${randomInt(maxValue - minValue) + minValue}`;
      return;
    }
    if (agreeButton ?? disagreeButton) {
      Math.random() > 0.5 ? agreeButton?.click() : disagreeButton?.click();
      return;
    }
    getRandomElement($(".answer"))?.click();
  };
  clickRandomRating();
  setTimeout(handleButtonClick, 0);
  finishButton?.click();
}
