// ==UserScript==
// @name         BWA Search Enhancer
// @namespace    https://github.com/micahbf
// @version      1.0
// @description  Save progress and other improvements to the BWA search page
// @author       Micah Buckley-Farlee
// @license      MIT
// @match        https://learnedleague.com/bwasearch.php*
// @match        https://www.learnedleague.com/bwasearch.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480959/BWA%20Search%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/480959/BWA%20Search%20Enhancer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /*
   * Displaying picked answers
   */

  function getPickedAnswers() {
    const checkboxes = document.querySelectorAll("input[type='checkbox'][name='bwasuggest[]']");

    const checked = Array.from(checkboxes).filter((cb) => cb.checked);

    // for each checked checkbox, get the text contents of its label (the answer)
    return checked.map((checkbox) => document.querySelector(`label[for=${checkbox.id}]`).innerText);
  }

  function createPickedAnswerDiv() {
    // create our new div
    const pickedAnswerDiv = document.createElement("div");
    pickedAnswerDiv.id = "picked-answers";
    pickedAnswerDiv.style =
      "position: sticky;float: right;z-index: 10;top: 10em;font-weight: bold;font-size: 1.15em;min-width: 20em;";

    // this is the container for the whole thing
    const parentDiv = document.querySelector("form[name='bwa']").parentNode;

    // we want to insert after the question div, which comes first
    const questionDiv = parentDiv.firstElementChild;

    questionDiv.after(pickedAnswerDiv);
  }

  function updatePickedAnswers() {
    const answers = getPickedAnswers();
    const answerHtml = answers.map((a) => a.toUpperCase()).join("<br>");
    document.getElementById("picked-answers").innerHTML = answerHtml;
  }

  /*
   * Saving progress
   */

  // get the match day ID from the url
  // e.g. bwaprogress?99&7&5 from https://www.learnedleague.com/bwasearch.php?99&7&5
  const matchDayId = `bwaprogress${window.location.search}`;

  // get checkbox elements for bwa answers
  const checkboxes = document.querySelectorAll("input[type='checkbox'][name='bwasuggest[]']");

  // in local storage, a given match day key holds an array of checked checkbox IDs
  const updateMatchDay = (checkboxId, checked) => {
    let mdChecked = JSON.parse(localStorage.getItem(matchDayId) || "[]");

    if (checked) {
      mdChecked.push(checkboxId);
    } else {
      mdChecked = mdChecked.filter((v) => v !== checkboxId);
    }

    localStorage.setItem(matchDayId, JSON.stringify(mdChecked));
  };

  // restore any saved checks we already have
  function restoreSavedChecks() {
    const matchDayState = localStorage.getItem(matchDayId);
    if (!matchDayState) {
      return;
    }

    const checkedIds = JSON.parse(matchDayState);
    for (const checkboxId of checkedIds) {
      const checkbox = document.getElementById(checkboxId);
      checkbox.checked = true;
    }
  }

  /*
   * Add handlers for everything
   */

  // add handlers for the checkboxes
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      updatePickedAnswers();
      updateMatchDay(checkbox.id, checkbox.checked);
    });
  });

  // add confirmation for submission and clear out saved state from local storage
  const form = document.querySelector("form[name='bwa']");
  form.addEventListener("submit", (event) => {
    const numAnswers = getPickedAnswers().length;
    const msg = `Are you ready to submit ${numAnswers} BWA suggestions?`;

    if (!confirm(msg)) {
      event.preventDefault();
    } else {
      localStorage.removeItem(matchDayId);
    }
  });

  /*
   * Other initialization
   */

  createPickedAnswerDiv();
  restoreSavedChecks();
  updatePickedAnswers();
})();