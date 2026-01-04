// ==UserScript==
// @name        Quizlet.com Export
// @version     1.0.4
// @author      petracoding
// @namespace   petracoding
// @grant       none
// @license     MIT
// @include     https://quizlet.com/*
// @include     http://quizlet.com/*
// @include     https://www.quizlet.com/*
// @include     http://www.quizlet.com/*
// @description Adds functionality for copying quizlet lists to the clipboard
// @downloadURL https://update.greasyfork.org/scripts/470590/Quizletcom%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/470590/Quizletcom%20Export.meta.js
// ==/UserScript==

// SETTINGS:

const swapTermAndDefinition = false; // true or false
const delimiter = "	"; // Use "\n" for a new line. Default: "	"
const delimiterBetweenTerms = "\n"; // Use "\n" for a new line. Default: "\n"

// DO NOT CHANGE ANYTHING BELOW HERE.

start();

function start() {
  const wrapper = document.querySelector(".SetPageHeader");
  if (!wrapper) return;

  const el = document.createElement("div");

  el.innerHTML = `
    <br/><div class="primary"><a class="action-1 button quizlet-export">Copy to clipboard</a></div>
  `;

  wrapper.appendChild(el);

  const btn = document.querySelector(".quizlet-export");
  btn.addEventListener("click", () => {
    copy();
  });
}

function copy() {
  const list = document.querySelectorAll(".SetPageTerms-termsList .SetPageTerms-term");
  let output = "";

  [...list].forEach((li) => {
    if (li.querySelector(".count")) {
      li.querySelector(".count").remove();
    }

    const lineBreak = " | ";

    //   "> * > * > * > * > *:first-child"
    const term = li.querySelector(":scope > * > * > * > * > *:nth-child(1) .TermText").innerHTML.replaceAll("<br>", lineBreak).trim();
    const definition = li.querySelector(":scope > * > * > * > * > *:nth-child(2) .TermText").innerHTML.replaceAll("<br>", lineBreak).trim();

    if (swapTermAndDefinition) {
      output += definition + delimiter + term + delimiterBetweenTerms;
    } else {
      output += term + delimiter + definition + delimiterBetweenTerms;
    }
  });

  navigator.clipboard.writeText(output);
  alert(
    "Done! All visible terms have been copied to the clipboard, you can now paste them anywhere.\n\nIf you are missing terms make sure to scroll down on your Quizlet list and load all terms before pressing the copy button."
  );
}
