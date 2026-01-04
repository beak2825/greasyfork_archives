// ==UserScript==
// @name         Wanikani: Kana Vocabulary Review Audio
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Plays audio after Kana Vocabulary reviews (ie words that are only Hiragana or Katakana)
// @author       iHiD
// @match        https://www.wanikani.com/subjects/review
// @match        https://www.wanikani.com/recent-mistakes/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @license      MIT
// @updateUURL   https://update.greasyfork.org/scripts/513192/Wanikani%3A%20Kana%20Vocabulary%20Review%20Audio.user.js
// @downloadURL https://update.greasyfork.org/scripts/513192/Wanikani%3A%20Kana%20Vocabulary%20Review%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/513192/Wanikani%3A%20Kana%20Vocabulary%20Review%20Audio.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var hasPlayed = false;

  function handleDidAnswerQuestion() {
    if(hasPlayed) { return }

    let questionType = document.querySelector(".quiz-input__question-type").textContent;
    if(!questionType.includes("meaning")) { return } 

    let wasPrevCorrect = document.querySelector(".quiz-input__input-container[correct='true']");
    if(wasPrevCorrect == null) { return }

    let word = document.querySelector(".character-header__characters").textContent;
    let queueElement = document.body.querySelector(`[id="quiz-queue"]`).firstElementChild;
    let wordData = JSON.parse(queueElement.textContent).find(obj => {
      return obj.type == "KanaVocabulary" && obj.characters == word;
    })
    if(wordData == null) { return }

    let audioUrl = wordData.readings[0].pronunciation.sources[0].url;
    if(audioUrl == null) { return }
    
    let audio = new Audio(audioUrl);
    if(audio == null) { return }

    audio.play();
    hasPlayed = true;

    let audioButton = document.querySelector('[data-action="quiz-audio#play"]');
    audioButton.onclick = function() { 
      if(audio.paused) { 
        audio.play()
        audioButton.classList.remove("additional-content__item--disabled")
      }
    }
    setTimeout(function() { audioButton.classList.remove("additional-content__item--disabled") }, 100);
  }

  // Rest things for the next question
  function handleWillShowNextQuestion() {
    hasPlayed = false;
    let audioButton = document.querySelector('[data-action="quiz-audio#play"]');
    if (audioButton.onclick != null) { audioButton.onclick = null; }
  }

  window.addEventListener("didAnswerQuestion", handleDidAnswerQuestion);
  window.addEventListener("willShowNextQuestion", handleWillShowNextQuestion);
})();