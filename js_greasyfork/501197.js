// ==UserScript==
// @name         Duolingo Text-to-Speech for answers without audio
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Based on https://greasyfork.org/en/scripts/498105-duolingo-hebrew-text-to-speech/code try to do the same thing as the original script but auto detecting the language
// @author       justsomelearner
// @match        https://www.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501197/Duolingo%20Text-to-Speech%20for%20answers%20without%20audio.user.js
// @updateURL https://update.greasyfork.org/scripts/501197/Duolingo%20Text-to-Speech%20for%20answers%20without%20audio.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // https://stackoverflow.com/questions/7089443/restoring-console-log
    // https://stackoverflow.com/questions/46111545/console-log-doesn-t-print-anything-but-returns-undefined
    var i = document.createElement('iframe');
    i.style.display = 'none';
    document.body.appendChild(i);
    window.console = i.contentWindow.console;

    var debug = () => {};
    //var debug = console.log;
    debug("Duolingo SpeakText Text-to-Speech script loaded");

    // Check if the browser supports the Web Speech API for TTS
    if (!('speechSynthesis' in window)) {
        alert("Your browser does not support the Web Speech API for text-to-speech");
        return;
    }

    let lastReadText = ''; // Variable to store the last read text

    // Function to read the SpeakText text aloud
    function readText(text, language) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
        debug("Reading text: ", text);
    }

    // Function to add a TTS button next to SpeakText text
    function addTTSButton() {
        debug("Attempting to add TTS button");

        // Select the SpeakText text element
        const hebrewTextElement = document.querySelector('#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div._2hpO2.UjFh4._3rat3 > div._1RjNT._3v0hd > div > div.rPXvv._44BHt > div > div');
        debug("SpeakText text element: ", hebrewTextElement);

        if (hebrewTextElement && !document.getElementById('ttsButton')) {
            const ttsButton = document.createElement('button');
            const language = hebrewTextElement.getAttribute('lang');
            debug(`Language : ${language}`);

            ttsButton.id = 'ttsButton';
            ttsButton.innerText = '🔊';
            ttsButton.style = 'background-color: #1cb0f6; color: white; border: none; padding: 10px; margin-left: 10px; cursor: pointer; border-radius: 50%; width: 30px; height: 30px;';
            ttsButton.onclick = () => readText(hebrewTextElement.textContent, language);
            hebrewTextElement.parentElement.appendChild(ttsButton);
            debug("TTS button added");
        } else {
            debug("SpeakText text element not found or TTS button already exists");
        }
    }

    // Function to find and read the SpeakText text automatically
    function readSpeakText() {
        debug("Attempting to read SpeakText text");

        // Select the SpeakText text element
        const hebrewTextElement = document.querySelector('#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div._34aEz._1IiFg.f7WE2._3rat3 > div.aMPis._35mGI > span > span > span');
        debug("SpeakText text element: ", hebrewTextElement);

        if (hebrewTextElement) {
            const text = hebrewTextElement.textContent;
            if (text !== lastReadText) {
                readText(text);
                lastReadText = text; // Update the last read text
            } else {
                debug("Text has already been read");
            }
        } else {
            debug("SpeakText text element not found");
        }
    }

    // Observe changes in the Duolingo interface to read the text when it changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                debug("Mutation observed");
                readSpeakText();
                addTTSButton();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial call to read the text if it's already there and add the button
    window.addEventListener('load', () => {
        debug("Page loaded");
        readSpeakText();
        addTTSButton();
    });

})();
