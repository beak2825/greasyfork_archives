// ==UserScript==
// @name         WPM Library for Nitro Type
// @namespace    https://greasyfork.org/users/1331131-tensorflow-dvorak
// @version      2024-10-22
// @description  Library that calculates WPM, accuracy, and errors allowed for Nitro Type races
// @author       TensorFlow - Dvorak
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @require      https://update.greasyfork.org/scripts/501960/1418069/findReact.js
// @license      MIT
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let startTime = null;
  let peakWPM = 0;
  let totalTypedCharacters = 0;
  let totalCorrectlyTypedCharacters = 0;
  let totalIncorrectTypedCharacters = 0;
  const trackedIncorrectLetters = new Set();
  let totalCharactersInRace = 0;
  let errorsAllowed = 0;

  function calculateWPM(totalCharacters, timeInSeconds) {
    const wordsTyped = totalCharacters / 5;
    const WPM = (wordsTyped * 60) / timeInSeconds;
    return WPM;
  }

  function calculateErrorsAllowed(totalCharacters) {
    return Math.floor(0.04 * totalCharacters);
  }

  function getCorrectlyTypedCharacterCount() {
    const correctLetters = document.querySelectorAll(
      ".dash-letter.is-correct.is-typed"
    );
    return correctLetters.length;
  }

  function detectMistakes() {
    const incorrectLetters = document.querySelectorAll(
      ".dash-letter.is-incorrect"
    );
    incorrectLetters.forEach((letter) => {
      if (!trackedIncorrectLetters.has(letter)) {
        totalIncorrectTypedCharacters += 1;
        trackedIncorrectLetters.add(letter);
        errorsAllowed = Math.max(0, errorsAllowed - 1);
      }
    });
  }

  function getTotalTypedCharacterCount() {
    const typedLetters = document.querySelectorAll(".dash-letter.is-typed");
    return typedLetters.length;
  }

  function getTotalCharacters() {
    const totalLetters = document.querySelectorAll(".dash-letter").length;
    return totalLetters;
  }

  function calculateAccuracy(correctCharacters, incorrectCharacters) {
    const totalTyped = correctCharacters + incorrectCharacters;
    return (correctCharacters / totalTyped) * 100;
  }

  function startTracking() {
    startTime = new Date();
    peakWPM = 0;
    totalTypedCharacters = 0;
    totalCorrectlyTypedCharacters = 0;
    totalIncorrectTypedCharacters = 0;
    trackedIncorrectLetters.clear();

    totalCharactersInRace = getTotalCharacters();
    errorsAllowed = calculateErrorsAllowed(totalCharactersInRace);
  }

  function updateTracking() {
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTime) / 1000;

    const correctlyTypedCharacters = getCorrectlyTypedCharacterCount();
    totalTypedCharacters = getTotalTypedCharacterCount();
    detectMistakes();

    const wpm = calculateWPM(correctlyTypedCharacters, elapsedTime);
    const accuracy = calculateAccuracy(
      correctlyTypedCharacters,
      totalIncorrectTypedCharacters
    );

    if (wpm > peakWPM) {
      peakWPM = wpm;
    }

    return {
      wpm: Math.round(wpm),
      accuracy: accuracy.toFixed(2),
      errorsAllowed: errorsAllowed,
    };
  }

  window.WPMLibrary = {
    start: startTracking,
    update: updateTracking,
  };
})();
