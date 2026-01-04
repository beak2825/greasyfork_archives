// ==UserScript==
// @name        restore scramble puzzle
// @namespace   Violentmonkey Scripts
// @match       https://www.edu-games.org/word-games/word-scramble-maker.php
// @grant       none
// @version     1.0
// @author      Vitalij Nykyforenko
// @description 8/30/2022, 8:47:19 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/450482/restore%20scramble%20puzzle.user.js
// @updateURL https://update.greasyfork.org/scripts/450482/restore%20scramble%20puzzle.meta.js
// ==/UserScript==
const wordlistIds = Array.from({ length: 25 }, (_, index) => `WordList_${index}_0`);

const currentValues = new Array(25).fill("");
const wordListContainer = document.getElementById("WordList");

const elements = wordlistIds.map((id, index) => {
  const element = document.getElementById(id);

  element.addEventListener("change", (event) => {
    currentValues[index] = event.target.value;
  });
  
  return element;
});

function fireOnChange(element) {
  if ("createEvent" in document) {
    const evt = new Event("change", { "bubbles": false, "cancelable": true });
    element.dispatchEvent(evt);
  } else {
    element.fireEvent("onchange");
  }
}

const button = document.createElement("button");
button.innerText = "restore";
button.onclick = () => {
  elements.forEach((element, index) => {
    element.value = currentValues[index];
    fireOnChange(element);
  });
};
wordListContainer.appendChild(button);