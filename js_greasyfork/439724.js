// ==UserScript==
// @name         wordleunlimited Solver
// @namespace    https://www.wordleunlimited.com/
// @version      0.2
// @description  Auto Solve Wordle Unlimited
// @author       Shubanker Chourasia
// @match        https://www.wordleunlimited.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wordleunlimited.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439724/wordleunlimited%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/439724/wordleunlimited%20Solver.meta.js
// ==/UserScript==

const sleep = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));
class WordleSolver {
  static wordsList = [];
  static fetchWords = async () => {
    const localJSON = localStorage.getItem("wordsList");
    if (localJSON) {
      try {
        WordleSolver.wordsList = JSON.parse(localJSON);
        return;
      } catch (error) {}
    }

    const response = await fetch("https://api.npoint.io/3338e6baccc78823690d");
    const words = await response.json();
    WordleSolver.wordsList = words;
    localStorage.setItem("wordsList", JSON.stringify(words));
  };
  static initialised = false;
  /** @type Record<string,HTMLElement> */
  static buttonMap = {};

  /** @type String[] */
  filteredList = [];
  length = document.querySelector(".RowL").childNodes.length;

  blackListChars = new Set();
  /** @type Map<string,Set<Number> */
  incorrectPositionsList = new Map();
  identifiedPositionsMap = new Map();
  identifiedIndexes = new Set();
  checkedWords = new Set();

  solveWordle = async () => {
    await WordleSolver.initialise();
    this.filteredList = WordleSolver.wordsList.filter(
      (word) => word.length === this.length
    );
    this.nextStep();
  };
  nextStep = async () => {
    const word =
      this.filteredList[Math.floor(Math.random() * this.filteredList.length)];
    WordleSolver.inputWord(word);
    this.checkedWords.add(word);
    await sleep();
    const enteredRows = document.querySelectorAll(".RowL-locked-in");
    const enteredRow = enteredRows[enteredRows.length - 1];
    if (!enteredRow) {
      return;
    }
    const enteredChars = enteredRow.childNodes;

    this.processesEnteredWordResults(enteredChars);

    if (
      this.identifiedIndexes.size === this.length ||
      document.querySelectorAll(".RowL-locked-in").length > 5 ||
      this.filteredList.length === 0
    ) {
      return this.done();
    }
    this.filterWordsList();
  };
  static inputWord = (word, pressEnter = true) => {
    if (word) {
      for (let i = 0; i < word.length; i++) {
        WordleSolver.buttonMap[word[i]].click();
      }
    }
    pressEnter && WordleSolver.buttonMap.enter.click();
  };
  static async initialise() {
    if (!WordleSolver.initialised) {
      nextButton.disabled = true;
      await WordleSolver.fetchWords();
      WordleSolver.initialised = true;

      nextButton.disabled = false;
    }
  }

  /**
   *
   * @param {NodeListOf<ChildNode>} enteredChars
   */
  processesEnteredWordResults(enteredChars) {
    enteredChars.forEach((charNode, i) => {
      const classes = [...charNode.classList];
      const char = charNode.innerText.toLowerCase();

      if (classes.includes("letter-elsewhere")) {
        if (!this.incorrectPositionsList.has(char)) {
          this.incorrectPositionsList.set(char, new Set());
        }
        this.incorrectPositionsList.get(char).add(i);
      }
      if (classes.includes("letter-correct")) {
        if (!this.identifiedPositionsMap.has(char)) {
          this.identifiedPositionsMap.set(char, new Set());
        }
        this.identifiedPositionsMap.get(char).add(i);
        this.identifiedIndexes.add(i);
      }
      if (classes.includes("letter-absent")) {
        this.blackListChars.add(char);
      }
    });
    // for repeting chars, 2nd char is marked as absent.
    for (const char of [
      ...this.incorrectPositionsList.keys(),
      ...this.identifiedPositionsMap.keys(),
    ]) {
      this.blackListChars.delete(char);
    }
  }
  filterWordsList() {
    this.filteredList = this.filteredList.filter((word) => {
      if (this.checkedWords.has(word)) {
        return false;
      }
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (this.blackListChars.has(char)) {
          return false;
        }
        if (
          this.identifiedIndexes.has(i) &&
          !this.identifiedPositionsMap.get(char)?.has(i)
        ) {
          return false;
        }
        if (
          this.incorrectPositionsList.has(char) &&
          this.incorrectPositionsList.get(char)?.has(i)
        ) {
          return false;
        }
      }
      const charSet = new Set(word);
      for (const char of this.incorrectPositionsList.keys()) {
        if (!charSet.has(char)) {
          return false;
        }
      }
      return true;
    });
  }
  done() {
    solveButton.hidden = false;
    nextButton.hidden = true;
  }
}

var solveButton = document.createElement("button");
var nextButton = document.createElement("button");
var revealAnswer = document.createElement("button");
(function () {
  "use strict";
  solveButton.innerHTML = "Auto Solve";
  nextButton.innerHTML = "Next Step";
  revealAnswer.innerHTML = "Reveal Answer";
  nextButton.hidden = true;

  document.querySelector(".game-icons.right-icons").appendChild(solveButton);
  document.querySelector(".game-icons.right-icons").appendChild(nextButton);
  document.querySelector(".Game").appendChild(revealAnswer);

  var currentSolverObj = null;
  solveButton.addEventListener("click", () => {
    currentSolverObj = new WordleSolver();
    nextButton.hidden = false;
    solveButton.hidden = true;
    currentSolverObj.solveWordle();
  });
  nextButton.addEventListener("click", () => {
    currentSolverObj.nextStep();
  });

  revealAnswer.addEventListener("click", () => {
    WordleSolver.inputWord(
      atob(document.querySelector(".game-id").childNodes[1].textContent),
      false
    );
  });
  document.querySelectorAll(".Game-keyboard-button").forEach((button) => {
    WordleSolver.buttonMap[button.innerText.toLowerCase()] = button;
  });
})();
