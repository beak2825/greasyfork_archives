// ==UserScript==
// @name        Vocabulary.com Export
// @version     1.1.1
// @author      petracoding
// @namespace   petracoding
// @grant       none
// @license     MIT
// @include     https://vocabulary.com/*
// @include     http://vocabulary.com/*
// @include     https://www.vocabulary.com/*
// @include     http://www.vocabulary.com/*
// @description Adds functionality for copying vocabulary lists to the clipboard
// @downloadURL https://update.greasyfork.org/scripts/470272/Vocabularycom%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/470272/Vocabularycom%20Export.meta.js
// ==/UserScript==

// SETTINGS:

const delimiter = "\n"; // Use "\n" for a new line. Default: "\n"
const delimiterBetweenWords = "\n\n"; // Use "\n" for a new line. Default: "\n\n"

// DO NOT CHANGE ANYTHING BELOW HERE.

start();
let isOkay = true;

function start() {
  const wrapper = document.querySelector(".stats");
  if (!wrapper) return;

  wrapper.innerHTML =
    wrapper.innerHTML +
    `
	<h3 style="margin-top:1em;font-size: 1.4em;">Copy to Clipboard:</h3>
	<div class="actions" style="margin:0">
	    <div><a class="button edit vocab-export-copy" data-type="wordDefintion">Word + Definition</a></div>
		<p style="margin: -0.5em 0 0.5em;font-size: 0.7em;"><b>Example:</b> amend | make revisions to</p>
	    <div><a class="button edit vocab-export-copy" data-type="sentenceWithGaps">Sentence with gaps + Word</a></div>
		<p style="margin: -0.5em 0 0.5em;font-size: 0.7em;"><b>Example:</b> "We will ___ the error." | amend</p>
	    <div><a class="button edit vocab-export-copy" data-type="sentenceWithGapsAndDefinition">Sentence with gaps <br>+ Word with definition</a></div>
		<p style="margin: -0.5em 0 0.5em;font-size: 0.7em;"><b>Example:</b> "We will ___ the error." | amend (make revisions to)</p>
	    <div><a class="button edit vocab-export-copy" data-type="sentenceWithGapsWithDefinition">Sentence with gaps and definition <br>+ Word</a></div>
		<p style="margin: -0.5em 0 0.5em;font-size: 0.7em;"><b>Example:</b> "We will ___ the error." (make revisions to) | amend</p>
	</div>
	<div class="vocab-export-done" style="display:none;"></div>
	<style>.vocab-export-copy::before { display: none !important; }</style>
	<style>.vocab-export-copy { padding: 0.3em 0.6em 0.2em !important; }</style>
  `;

  const btns = document.querySelectorAll(".vocab-export-copy");
  [...btns].forEach((btn) => {
    btn.addEventListener("click", () => {
      copy(btn.getAttribute("data-type"));
    });
  });
}

function copy(type) {
  const doneEl = document.querySelector(".vocab-export-done");
  const list = document.querySelectorAll(".wordlist .entry");
  let output = "";
  isOkay = true;

  [...list].forEach((li) => {
    if (li.querySelector(".count")) {
      li.querySelector(".count").remove();
    }

    output += buildStr(type, li);
  });

  navigator.clipboard.writeText(output);
  doneEl.innerHTML = isOkay
    ? "Copied successfully!"
    : "<span style='color:red'>Copied with errors:</span> Some words are missing example sentences! These will be missing from the output. To fix this, add example sentences when editing your list on vocabulary.com.";
  doneEl.style.display = "block";

  setTimeout(function () {
    if (isOkay) doneEl.style.display = "none";
  }, 1000);
}

function buildStr(type, li) {
  const wordStr = li.querySelector(".word").innerHTML.trim();
  const definitionStr = li.querySelector(".definition").innerHTML;
  let exampleStr = false;

  if (li.querySelector(".example")) {
    [...li.querySelectorAll(".example strong")].forEach((e) => e.remove());
    if (li.querySelector(".example .source")) {
      li.querySelector(".example .source").remove();
    }
    exampleStr = li.querySelector(".example").innerHTML.replaceAll("\n", "___").replaceAll("&nbsp;", " ");
  }

  if (type == "wordDefintion") return wordStr + delimiter + definitionStr + delimiterBetweenWords;

  if (exampleStr) {
    if (type == "sentenceWithGaps") return exampleStr + delimiter + wordStr + delimiterBetweenWords;
    if (type == "sentenceWithGapsAndDefinition") return exampleStr + delimiter + wordStr + " (" + definitionStr + ")" + delimiterBetweenWords;
    if (type == "sentenceWithGapsWithDefinition") return exampleStr + " (" + definitionStr + ")" + delimiter + wordStr + delimiterBetweenWords;
  }

  isOkay = false;
  return "";
}
