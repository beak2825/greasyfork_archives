// ==UserScript==
// @name         Audio Tweak 4.0
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Plays review audios on meaning answers as long as the reading has been got correctly beforehand
// @author       Hubbit200
// @match        https://www.wanikani.com/subjects/review
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463132/Audio%20Tweak%2040.user.js
// @updateURL https://update.greasyfork.org/scripts/463132/Audio%20Tweak%2040.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialize an empty array to store the words and their information
    var wordList = [];
    var hasPlayedAlready = false;
    var queueElement = document.body.querySelector(`[id="quiz-queue"]`).firstElementChild;

    // Listen for the Turbo event "didAnswerQuestion"
    function handleDidAnswerQuestion() {
        // Get the word from the div with class "character-header__characters"
        let word = document.querySelector(".character-header__characters").textContent;
        // Get the question type from the span with class "quiz-input__question-type"
        let questionType = document.querySelector(".quiz-input__question-type").textContent;
        // Get item type
        let itemType = document.querySelector(".quiz-input__question-category").textContent;

        // Check if the word is already in the list
        let index = wordList.findIndex(function(item) {
            return item.word === word;
        });

        // If the word is not in the list
        if (index === -1 && itemType == "Vocabulary") {
            // Create a new object with the word, audio link and isReadingComplete properties
            let newItem = {
                word: word,
                audioLink: null,
                isReadingComplete: false
            };
            // Add the new item to the list
            wordList.push(newItem);
        }
        // If the word is already in the list
        else if (index !== -1) {
            if(hasPlayedAlready) return;
            // Get the existing item from the list
            let existingItem = wordList[index];

            // If isReadingComplete is true
            if (existingItem.isReadingComplete) {
                // Play the audio link
                if(existingItem.audioLink == null) return;
                let audio = new Audio(existingItem.audioLink);
                if(audio == null) console.log("Invalid Audio");
                else {
                    audio.play();
                    hasPlayedAlready = true;
                    let audioButton = document.querySelector('[data-action="quiz-audio#play"]');
                    let audioIcon = audioButton.querySelector('i');
                    audioButton.onclick = function() { if(audio.paused) { audio.play(); audioIcon.classList.remove("fa-volume-off"); audioIcon.classList.add("fa-volume-high"); audioButton.classList.remove("additional-content__item--disabled");} }
                    audio.onended = function() { audioIcon.classList.remove("fa-volume-high"); audioIcon.classList.add("fa-volume-off"); }
                    setTimeout(function() { audioButton.classList.remove("additional-content__item--disabled"); }, 100);
                }
            }
        }
    }

    // Listen for the Turbo event "didCompleteSubject"
    function handleDidCompleteSubject() {
        // Get the word from the div with class "character-header__characters"
        let word = document.querySelector(".character-header__characters").textContent;

        // Check if the word is in the list
        let index = wordList.findIndex(function(item) {
            return item.word === word;
        });

        // If the word is in the list
        if (index !== -1) {
            // Remove it from the list
            wordList.splice(index, 1);
        }
    }

    function handleWillShowNextQuestion() {
        hasPlayedAlready = false;
        // Get the question type from the span with class "quiz-input__question-type"
        let questionType = document.querySelector(".quiz-input__question-type").textContent;
        // Get item type
        let itemType = document.querySelector(".quiz-input__question-category").textContent;
        // Check if previous item was correct
        let wasPrevCorrect = document.querySelector(".quiz-input__input-container[correct='true']");

        let audioButton = document.querySelector('[data-action="quiz-audio#play"]');
        if (audioButton.onclick != null) audioButton.onclick = null;

        if (questionType.includes("reading") && itemType.includes("Vocabulary") && wasPrevCorrect != undefined) {
            // Get the word from the div with class "character-header__characters"
            let word = document.querySelector(".character-header__characters").textContent;
            // Check if the word is already in the list
            let listItem = wordList[wordList.findIndex(function(item) {
                return item.word === word;
            })];

            // If listItem is null, break
            if (listItem == null) return;

            // Get the audio link from the queue
            let audioObj = JSON.parse(queueElement.textContent).find(obj => {
                return obj.type == "Vocabulary" && obj.characters == word;
            });
            // Set the audio link and isReadingComplete to true
            listItem.audioLink = audioObj.readings[0].pronunciations[0].sources[0].url;
            listItem.isReadingComplete = true;
        }
    }

    // Add event listeners for both events using addEventListener
    window.addEventListener("didAnswerQuestion", handleDidAnswerQuestion);
    window.addEventListener("didCompleteSubject", handleDidCompleteSubject);
    window.addEventListener("willShowNextQuestion", handleWillShowNextQuestion);
})();