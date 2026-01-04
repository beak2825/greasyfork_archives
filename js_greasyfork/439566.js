// ==UserScript==
// @name         Wordle-Kani
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Play wordle with the words you've learned on wanikani!
// @author       Gorbit99
// @include      /^https?:\/\/(www\.)?wanikani\.com\/?(?:dashboard)?$/
// @include      /^https?:\/\/(preview\.)?wanikani\.com\/?(?:dashboard)?$/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439566/Wordle-Kani.user.js
// @updateURL https://update.greasyfork.org/scripts/439566/Wordle-Kani.meta.js
// ==/UserScript==

let active = false;

let currentWord = [];
let currentGuess = [];
let currentChar = "";
let gameOver = false;
let possibleWords = [];
let selectedWord = "";

let minWordLength = 0;
let maxWordLength = 0;

let characterCombinations = [
  ["a", "あ"], ["i", "い"], ["u", "う"], ["e", "え"], ["o", "お"],
  ["ka", "か"], ["ki", "き"], ["ku", "く"], ["ke", "け"], ["ko", "こ"],
  ["kya", "きゃ"], ["kyu", "きゅ"], ["kyo", "きょ"],
  ["ga", "が"], ["gi", "ぎ"], ["gu", "ぐ"], ["ge", "げ"], ["go", "ご"],
  ["gya", "ぎゃ"], ["gyu", "ぎゅ"], ["gyo", "ぎょ"],
  ["sa", "さ"], ["shi", "し"], ["su", "す"], ["se", "せ"], ["so", "そ"],
  ["sha", "しゃ"], ["shu", "しゅ"], ["sho", "しょ"],
  ["za", "ざ"], ["ji", "じ"], ["zu", "ず"], ["ze", "ぜ"], ["zo", "ぞ"],
  ["ja", "じゃ"], ["ju", "じゅ"], ["jo", "じょ"],
  ["ta", "た"], ["chi", "ち"], ["tsu", "つ"], ["te", "て"], ["to", "と"],
  ["cha", "ちゃ"], ["chu", "ちゅ"], ["cho", "ちょ"],
  ["da", "だ"], ["di", "ぢ"], ["du", "づ"], ["de", "で"], ["do", "ど"],
  ["na", "な"], ["ni", "に"], ["nu", "ぬ"], ["ne", "ね"], ["no", "の"],
  ["nya", "にゃ"], ["nyu", "にゅ"], ["nyo", "にょ"],
  ["ha", "は"], ["hi", "ひ"], ["fu", "ふ"], ["he", "へ"], ["ho", "ほ"],
  ["hya", "ひゃ"], ["hyu", "ひゅ"], ["hyo", "ひょ"],
  ["ba", "ば"], ["bi", "び"], ["bu", "ぶ"], ["be", "べ"], ["bo", "ぼ"],
  ["bya", "びゃ"], ["byu", "びゅ"], ["byo", "びょ"],
  ["pa", "ぱ"], ["pi", "ぴ"], ["pu", "ぷ"], ["pe", "ぺ"], ["po", "ぽ"],
  ["pya", "ぴゃ"], ["pyu", "ぴゅ"], ["pyo", "ぴょ"],
  ["ma", "ま"], ["mi", "み"], ["mu", "む"], ["me", "め"], ["mo", "も"],
  ["mya", "みゃ"], ["myu", "みゅ"], ["myo", "みょ"],
  ["ya", "や"], ["yu", "ゆ"], ["yo", "よ"],
  ["xya", "ゃ"], ["xyu", "ゅ"], ["xyo", "ょ"],
  ["ra", "ら"], ["ri", "り"], ["ru", "る"], ["re", "れ"], ["ro", "ろ"],
  ["rya", "りゃ"], ["ryu", "りゅ"], ["ryo", "りょ"],
  ["wa", "わ"], ["wo", "を"],
  ["nn", "ん"],
  ["-", "ー"],
];

let settings = {
  onlyLearned: true,
  minWordLen: 4,
  maxWordLen: 12,
  maxGuessNumber: 10,
};

(function() {
  'use strict';

  if (!window.wkof) {
    alert('Wordle-Kani requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
    window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
    return;
  }

  wkof.include('ItemData');

  if (!window.localStorage.getItem("wordle-settings")) {
    window.localStorage.setItem("wordle-settings", JSON.stringify(settings));
  }
  settings = JSON.parse(window.localStorage.getItem("wordle-settings"));

  injectCSS();
  injectSitemap();

  addInDoubleConsonants();

  injectModal();

  window.addEventListener("keydown", handleKeyPress);

  wkof.ready('ItemData').then(wkofReady);
})();

function wkofReady() {
  loadWords();
}

function itemsReady() {
  setIsLoading(false);

  rollNewWord();
}

function checkGuess() {
  const guessLength = currentGuess.length;
  const wordLength = currentWord.length;

  const wordCopy = [...currentWord];

  if (guessLength !== wordLength) {
    return;
  }

  const currentRow = document.querySelector(".wordle-row-empty");
  const cells = [...currentRow.querySelectorAll(".wordle-cell")];

  let correctNumber = 0;
  for (let i = 0; i < wordLength; i++) {
    if (wordCopy[i] !== currentGuess[i]) {
      continue;
    }

    const correspondingIndicator = document.querySelector(`[data-character=${currentGuess[i]}]`);
    if (correspondingIndicator) {
      correspondingIndicator.classList.remove("wordle-cell-none");
      correspondingIndicator.classList.remove("wordle-cell-wrong-place");
      correspondingIndicator.classList.add("wordle-cell-correct");
    }

    cells[i].classList.replace("wordle-cell-none", "wordle-cell-correct");
    wordCopy[i] = "";
    currentGuess[i] = "";
    correctNumber++;
  }

  if (correctNumber == wordLength) {
    handleGameOver(true);
    return;
  }

  for (let i = 0; i < wordLength; i++) {
    if (currentGuess[i] === "") {
      continue;
    }

    const indexInWord = wordCopy.indexOf(currentGuess[i]);
    if (indexInWord == -1) {
      continue;
    }

    const correspondingIndicator = document.querySelector(`[data-character=${currentGuess[i]}]`);
    if (correspondingIndicator && !correspondingIndicator.classList.contains("wordle-cell-correct")) {
      correspondingIndicator.classList.remove("wordle-cell-none");
      correspondingIndicator.classList.add("wordle-cell-wrong-place");
    }

    cells[i].classList.replace("wordle-cell-none", "wordle-cell-wrong-place");

    wordCopy[indexInWord] = "";
    currentGuess[i] = "";

  }

  for (let i = 0; i < wordLength; i++) {
    if (currentGuess[i] !== "") {
      cells[i].classList.replace("wordle-cell-none", "wordle-cell-wrong");
      const correspondingIndicator = document.querySelector(`.wordle-cell-none[data-character=${currentGuess[i]}]`);
      if (correspondingIndicator) {
        correspondingIndicator.classList.replace("wordle-cell-none", "wordle-cell-wrong");
      }
    }
  }

  currentRow.classList.remove("wordle-row-empty");

  const nextRow = document.querySelector(".wordle-row-empty");
  if (!nextRow) {
    handleGameOver(false);
  }

  currentGuess = [];
}

function showSolution() {
  const solutionCells = [...document.querySelectorAll(".wordle-solution-cell")];

  const wordLength = currentWord.length;
  for (let i = 0; i < wordLength; i++) {
    solutionCells[i].innerHTML = `<span class="wordle-character">${currentWord[i]}</span>`;
    solutionCells[i].classList.add("solved");
  }
}

function handleGameOver(_) {
  gameOver = true;

  showSolution();
}

function handleKeyPress(event) {
  if (!active) {
    return;
  }

  if (event.isComposing) {
    return;
  }

  const key = event.key;

  const englishRegex = /^[a-zA-Z]$/;

  if (key === "Enter") {
    if (!gameOver) {
      checkGuess();
      return;
    }

    rollNewWord();
    currentGuess = [];
    gameOver = false;
    return;
  }

  if (gameOver) {
    return;
  }

  if (key === "Backspace") {
    if (currentGuess === [] && currentChar === "") {
      return;
    }

    if (currentChar !== "") {
      currentChar = "";
    } else {
      currentGuess.pop();
    }

    updateGuessDisplay();
    return;
  }

  if (!key.match(englishRegex)) {
    return;
  }

  const currentGuessLength = currentGuess.length;
  const wordLength = currentWord.length;

  if (!characterCombinations.some((pair) =>
    pair[0].startsWith(currentChar + key))) {
    if (currentChar !== 'n' || currentGuessLength - wordLength == 1) {
      return;
    }
    if (!characterCombinations.some((pair) =>
      pair[0].startsWith(key))) {
      return;
    }
    currentGuess.push('ん');
    currentChar = '';
    updateGuessDisplay();
  }

  if (currentGuessLength == wordLength) {
    return;
  }

  currentChar += key;
  const matchedCombination = characterCombinations.find((pair) => pair[0] === currentChar);

  if (matchedCombination) {
    currentChar = "";

    const matchLength = matchedCombination[1].length;

    if (currentGuessLength + matchLength > wordLength) {
      return;
    }
    currentGuess.push(...matchedCombination[1]);
  }

  updateGuessDisplay();
}

function updateGuessDisplay() {
  const currentRow = document.querySelector(".wordle-row-empty");
  const cells = [...currentRow.querySelectorAll(".wordle-cell")];

  const wordLength = currentWord.length;

  for (let i = 0; i < wordLength; i++) {
    if (i == currentGuess.length) {
      cells[i].innerHTML = `<span class="wordle-character">${currentChar}</span>`;
      continue;
    }
    if (i < currentGuess.length) {
      cells[i].innerHTML = `<span class="wordle-character">${currentGuess[i]}</span>`;
      continue;
    }
    cells[i].innerHTML = "";
  }
}

function addInDoubleConsonants() {
  const doubleable = "ckstp";

  let extras = [];
  for (let combination of characterCombinations) {
    if (doubleable.includes(combination[0][0])) {
      extras.push([combination[0][0] + combination[0], "っ" + combination[1]]);
    }
  }

  characterCombinations.push(...extras);
}

function loadWords() {
  const config = {
    wk_items: {
      filters: {
        item_type: "voc",
      }
    }
  };

  if (settings.onlyLearned) {
    config.wk_items.filters.level = "1..+0";
  }

  wkof.ItemData.get_items(config).then(items => {
    minWordLength = Infinity;
    maxWordLength = 0;
    items.forEach(item => {
      const length = item
        .data
        .readings
        .find(reading => reading.primary)
        .reading
        .length;
      if (length < minWordLength) {
        minWordLength = length;
      }
      if (length > maxWordLength) {
        maxWordLength = length;
      }
    });

    updateSettings();

    possibleWords = items.
      filter(word =>
        word
          .data
          .readings
          .find(y => y.primary)
          .reading
          .length >= settings.minWordLen
      );
    possibleWords = possibleWords.
      filter(word =>
        word
          .data
          .readings
          .find(y => y.primary)
          .reading
          .length <= settings.maxWordLen
      );

    possibleWords = possibleWords
      .filter((x, i) => possibleWords.indexOf(x) === i);

    itemsReady();
  });
}

function updateSettings() {
  const minWordLengthSelect = document.querySelector(".wordle-min-word-length");
  const maxWordLengthSelect = document.querySelector(".wordle-max-word-length");

  let currentMin = settings.minWordLen;
  let currentMax = settings.maxWordLen;

  currentMin = Math.min(maxWordLength, Math.max(minWordLength, currentMin));
  currentMax = Math.min(maxWordLength, Math.max(minWordLength, currentMax));

  minWordLengthSelect.innerHTML = "";
  for (let i = minWordLength; i <= currentMax; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    minWordLengthSelect.appendChild(option);
  }
  minWordLengthSelect.value = currentMin;
  maxWordLengthSelect.innerHTML = "";
  for (let i = currentMin; i <= maxWordLength; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    maxWordLengthSelect.appendChild(option);
  }
  maxWordLengthSelect.value = currentMax;

  settings.minWordLen = currentMin;
  settings.maxWordLen = currentMax;
  saveSettings();
}

function saveSettings() {
  window.localStorage.setItem("wordle-settings", JSON.stringify(settings));
}

function rollNewWord() {
  selectedWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];
  let reading = selectedWord.data.readings.find(x => x.primary).reading;
  currentWord = [...reading];

  const table = document.querySelector(".wordle-table tbody");

  table.innerHTML = "";

  const firstRow = document.createElement("tr");
  for (let _ of currentWord) {
    firstRow.innerHTML += `<td class="wordle-solution-cell"></td>`;
  }
  table.append(firstRow);

  const rows = [];
  for (let i = 0; i < settings.maxGuessNumber; i++) {
    const row = document.createElement("tr");
    rows.push(row);

    for (let _ of currentWord) {
      row.innerHTML += `<td class="wordle-cell wordle-cell-none"></td>`;
    }

    row.classList.add("wordle-row-empty");

    table.append(row);
  }

  [...document.querySelectorAll(".wordle-characters .wordle-cell")].forEach(cell => {
    cell.classList.remove("wordle-cell-wrong", "wordle-cell-wrong-place", "wordle-cell-correct");
    cell.classList.add("wordle-cell-none");
  });
}

function injectModal() {
  const body = document.querySelector("body");
  const modal = document.createElement("div");
  body.append(modal);

  modal.classList.add("wordle-modal");
  modal.classList.add("hidden");

  modal.innerHTML = `
        <div class="wordle-menu-items">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Font_Awesome_5_solid_cog.svg/512px-Font_Awesome_5_solid_cog.svg.png"
            class="wordle-options"></img>
          <span class="wordle-close-button">⨯</span>
        </div>
        <div class="wordle-settings-container closed">
          <h3>Settings</h3>
          <div class="wordle-option-container">
            <span class="wordle-option-description">
              Only include learned words
            </span>
            <select class="wordle-option wordle-only-learned">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div class="wordle-option-container">
            <span class="wordle-option-description">
              Minimum word length
            </span>
            <select class="wordle-option wordle-min-word-length">
            </select>
          </div>
          <div class="wordle-option-container">
            <span class="wordle-option-description">
              Maximum word length
            </span>
            <select class="wordle-option wordle-max-word-length">
            </select>
          </div>
          <div class="wordle-option-container">
            <span class="wordle-option-description">
              Maximum number of guesses
            </span>
            <select class="wordle-option wordle-max-guess-number">
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
            </select>
          </div>
        </div>
        <table class="wordle-table">
          <tbody></tbody>
        </table>
        <table class="wordle-characters">
          <tbody></tbody>
        </table>
        <div class="wordle-loading-background">
          <div class="indicator"></div>
        </div>
    `;

  const characters = characterCombinations.flatMap(x => [...x[1]]).filter((x, i, a) => a.indexOf(x) === i).sort();

  const characterTable = document.querySelector(".wordle-characters tbody");
  for (let row = 0; row < 4; row++) {
    const tableRow = document.createElement("tr");
    characterTable.append(tableRow);
    for (let col = 0; col < 19; col++) {
      const character = characters[row * 19 + col];
      tableRow.innerHTML += `<td class="wordle-cell wordle-cell-none" data-character="${character}">
                              <span class="wordle-possibilities">${character}</span>
                            </td>`
    }
  }

  document.querySelector(".wordle-close-button").addEventListener("click", toggleModal);

  document.querySelector(".wordle-options").addEventListener("click", () => {
    document.querySelector(".wordle-settings-container")
      .classList.toggle("closed");
  });

  const onlyLearnedSelect = document.querySelector(".wordle-only-learned");

  onlyLearnedSelect.value = settings.onlyLearned;
  onlyLearnedSelect.addEventListener("change", (e) => {
    settings.onlyLearned = e.target.value === "true";
    setIsLoading(true);
    loadWords();
  });

  document.querySelector(".wordle-min-word-length")
    .addEventListener("change", (e) => {
      settings.minWordLen = parseInt(e.target.value);
      setIsLoading(true);
      loadWords();
    });

  document.querySelector(".wordle-max-word-length")
    .addEventListener("change", (e) => {
      settings.minWordLen = parseInt(e.target.value);
      setIsLoading(true);
      loadWords();
    });

  const maxGuessNumberSelect =
    document.querySelector(".wordle-max-guess-number");
  maxGuessNumberSelect.value = settings.maxGuessNumber;
  maxGuessNumberSelect
    .addEventListener("change", (e) => {
      settings.maxGuessNumber = parseInt(e.target.value);
      rollNewWord();
    });
}

function setIsLoading(loading) {
  const loadingBackground =
    document.querySelector(".wordle-loading-background");
  if (loading) {
    loadingBackground.classList.remove("hidden");
  } else {
    loadingBackground.classList.add("hidden");
  }
}

function toggleModal() {
  const modal = document.querySelector(".wordle-modal");
  active = !modal.classList.toggle("hidden");

  if (!active) {
    return;
  }

  document.querySelector(".sitemap__section-header--wordle").blur();
}

function injectSitemap() {
  const sitemapIcon = document.createElement("li");
  sitemapIcon.innerHTML = `
        <li class="sitemap__section">
            <button class="sitemap__section-header sitemap__section-header--wordle" data-expanded="false" aria-expanded="false" aria-controls="sitemap__wordle" type="button" tabindex="0">
                <span lang="en" class="font-sans">Wordle</span>
            </button>
        </li>
    `;

  const sitemapList = document.querySelector("#sitemap");
  sitemapList.insertBefore(sitemapIcon, sitemapList.firstChild);

  sitemapIcon.querySelector("button").addEventListener("click", toggleModal);
}

function injectCSS() {
  const head = document.querySelector("head");

  const styleElement = document.createElement("style");
  head.append(styleElement);

  styleElement.innerHTML = `
        @media only screen and (min-width: 1024px) {
            .sitemap__section-header--wordle:hover {
                border-color: rgba(74,140,43,0.25);
                color: rgba(74,140,43,1);
            }

            .sitemap__section-header--wordle:focus {
                border-color: rgba(74,140,43,1);
                color: rgba(74,140,43,1);
            }
        }

        .wordle-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            filter: drop-shadow(2px 4px 6px #ddd);
            border-radius: 0.5rem;
            background: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1rem;
            max-height: 80%;
            overflow-y: auto;
        }

        .wordle-modal.hidden {
            display: none;
        }

        .wordle-table {
            border-spacing: 0.5rem;
            border-collapse: separate;
        }

        .wordle-cell {
            width: 2rem;
            height: 2rem;
            background: #ddd;
            border-radius: 0.25rem;
        }

        .wordle-solution-cell {
            width: 2rem;
            height: 2rem;
            background: #000;
            border-radius: 0.25rem;
        }

        .wordle-solution-cell.solved {
            background: #ddd;
            border: 2px solid black;
        }

        .wordle-cell-correct {
            background: #37bf19;
        }

        .wordle-cell-wrong-place {
            background: #fff23d;
        }

        .wordle-cell-wrong {
            background: #999;
        }

        .wordle-character {
            font-weight: bold;
            width: 100%;
            text-align: center;
            display: inline-block;
        }

        .wordle-loading-background {
            display: block;
            height: 100%;
            width: 100%;
            background: #55555566;
            backdrop-filter: blur(0.25rem);
            position: absolute;
            border-radius: 0.25rem;
            display: flex;
            align-items: center;
            justify-content: space-around;
            top: 0;
            left: 0;
        }

        .wordle-loading-background.hidden {
            display: none;
        }

        .wordle-characters {
            border-spacing: 0.25rem;
            border-collapse: separate;
        }

        .wordle-possibilities {
            width: 100%;
            text-align: center;
            display: inline-block;
        }

        .wordle-menu-items {
            box-sizing: border-box;
            padding-right: 1em;
            padding-bottom: 0.5em;
            display: flex;
            flex-direction: row;
            justify-content: end;
            width: 100%;
        }

        .wordle-close-button {
            background: red;
            width: 1.5em;
            height: 1.5em;
            display: inline-block;
            border-radius: 50%;
            text-align: center;
            color: white;
            font-weight: bolder;
            cursor: pointer;
        }

        .wordle-options {
          width: 1.5em;
          height: 1.5em;
          margin-right: 1em;
          cursor: pointer;
        }

        .wordle-settings-container {
          display: flex;
          flex-direction: column;
          width: 80%;
          padding: 1em;
          border-radius: 0.25rem;
          border: 1px solid #aaa;
        }

        .wordle-settings-container.closed {
          display: none;
        }

        .wordle-option-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
    `;
}