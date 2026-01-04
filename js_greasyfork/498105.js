// ==UserScript==
// @name         Duolingo Hebrew Text-to-Speech
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically reads Hebrew text aloud in Duolingo's Hebrew course with a slower TTS rate and an optional button for manual playback, ensuring only one automatic playback per text change.
// @author       justsomelearner
// @match        https://www.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498105/Duolingo%20Hebrew%20Text-to-Speech.user.js
// @updateURL https://update.greasyfork.org/scripts/498105/Duolingo%20Hebrew%20Text-to-Speech.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Duolingo Hebrew Text-to-Speech script loaded");

    // Check if the browser supports the Web Speech API for TTS
    if (!('speechSynthesis' in window)) {
        alert("Your browser does not support the Web Speech API for text-to-speech");
        return;
    }

    let lastReadText = ''; // Variable to store the last read text

    // Function to read the Hebrew text aloud
    function readText(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'he-IL'; // Set the language to Hebrew
        utterance.rate = 0.8; // Set the rate to be slower than the default
        speechSynthesis.speak(utterance);
        console.log("Reading text: ", text);
    }

    // Function to add a TTS button next to Hebrew text
    function addTTSButton() {
        console.log("Attempting to add TTS button");

        // Select the Hebrew text element
        const hebrewTextElement = document.querySelector('#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div._34aEz._1IiFg.f7WE2._3rat3 > div.aMPis._35mGI > span > span > span');
        console.log("Hebrew text element: ", hebrewTextElement);

        if (hebrewTextElement && !document.getElementById('ttsButton')) {
            const ttsButton = document.createElement('button');
            ttsButton.id = 'ttsButton';
            ttsButton.innerText = '🔊';
            ttsButton.style = 'background-color: #1cb0f6; color: white; border: none; padding: 10px; margin-left: 10px; cursor: pointer; border-radius: 50%; width: 40px; height: 40px;';
            ttsButton.onclick = () => readText(hebrewTextElement.textContent);
            hebrewTextElement.parentElement.appendChild(ttsButton);
            console.log("TTS button added");
        } else {
            console.log("Hebrew text element not found or TTS button already exists");
        }
    }

    // Function to find and read the Hebrew text automatically
    function readHebrewText() {
        console.log("Attempting to read Hebrew text");

        // Select the Hebrew text element
        const hebrewTextElement = document.querySelector('#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div._34aEz._1IiFg.f7WE2._3rat3 > div.aMPis._35mGI > span > span > span');
        console.log("Hebrew text element: ", hebrewTextElement);

        if (hebrewTextElement) {
            const text = hebrewTextElement.textContent;
            if (text !== lastReadText) {
                readText(text);
                lastReadText = text; // Update the last read text
            } else {
                console.log("Text has already been read");
            }
        } else {
            console.log("Hebrew text element not found");
        }
    }

    // Observe changes in the Duolingo interface to read the text when it changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                console.log("Mutation observed");
                readHebrewText();
                addTTSButton();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial call to read the text if it's already there and add the button
    window.addEventListener('load', () => {
        console.log("Page loaded");
        readHebrewText();
        addTTSButton();
    });

})();
