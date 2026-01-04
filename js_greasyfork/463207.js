// ==UserScript==
// @name         ChatGPT TTS
// @namespace    https://chat.openai.com/
// @version      0.1
// @description  Speaks the chatGPT responses. Windows only.
// @author       ElectroKnight22
// @match        https://chat.openai.com/*
// @icon         data:image/png;base64,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
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463207/ChatGPT%20TTS.user.js
// @updateURL https://update.greasyfork.org/scripts/463207/ChatGPT%20TTS.meta.js
// ==/UserScript==

// only starts after website has finish loading
window.addEventListener('load', function() {
    'use strict';


    // Select the node that will be observed for mutations
    var target = document;

    // Options for the observer (which mutations to observe)
    const config = {childList: true,
                    subtree: true};

    // Callback function to execute when mutations are observed
    const mutationCallback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            addSpeakButton();
        }
    };

    // Create an observer instance linked to the mutationCallback function
    const observer = new MutationObserver(mutationCallback);

    // Start observing the target node for configured mutations
    observer.observe(target, config);



    // new speech synthesizer
    const synth = window.speechSynthesis;
    var buttonNum = 0;
    var speakButton;
    var utterances = [];
    var utteranceIndex = 0;


    var init = function() {
        addSpeakButton();
    };



    var speaker = function() {
        synth.cancel();
        utterances = [];
        utteranceIndex = 0;

        var lastBox = Array.from(document.querySelectorAll('[class^=markdown]:first-child')).pop();
        if (lastBox) {
            var gptResponses = Array.from(lastBox.querySelectorAll('li, *:not(li) > p')).map(el => el.textContent);         
            gptResponses.forEach(addUtterance);
            synthesizeSpeech(utterances, () => {changeToSpeakBtn()});
        } else {
            //alert('No elements found with the specified class.');
            setTimeout(speaker, 100); //retry every 100 ms
        }
    };


    function synthesizeSpeech(utterances, onEndCallback) {
        function speak() {
            if (utteranceIndex >= utterances.length) {
                onEndCallback();
                return;
            }

            if ('speechSynthesis' in window) {
                var utterance = utterances[utteranceIndex];
                synth.speak(utterance);
                utterance.onend = function() {
                    utteranceIndex++;
                    speak(); // Call the speak function again when the current utterance ends
                };
            } else {
                // Fallback for browsers that do not support Web Speech API
                alert('Sorry, your browser does not support text-to-speech.');
            }
        };
        changeToStopBtn();
        speak();
    };


    var addUtterance = function(item) {
        var utterance = new SpeechSynthesisUtterance(item);
        if (!utterances.includes(utterance)) {
            utterances.push(utterance);
        }
    };

    // changes the speak button to the stop button
    function changeToStopBtn() {
        observer.disconnect();
        speakButton.textContent = "Stop";
        speakButton.removeEventListener('click', speaker);
        speakButton.addEventListener('click', changeToSpeakBtn);
        observer.observe(target, config);
    }

    // changes the stop button to the speak button


    function changeToSpeakBtn() {
        observer.disconnect();
        synth.cancel();
        speakButton.textContent = "Speak";
        speakButton.removeEventListener('click', changeToSpeakBtn);
        speakButton.addEventListener('click', speaker);
        observer.observe(target, config);
    }


    // add a speak button in the element that contains the regenerate response button
    function addSpeakButton() {
        const buttonContainer = document.querySelector('.flex.ml-1.md\\:w-full.md\\:m-auto.md\\:mb-2.gap-0.md\\:gap-2.justify-center');

        if (!buttonContainer) {
            console.error('Button container not found');
            return;
        }

        const buttons = buttonContainer.querySelectorAll('.btn');

        buttonNum = 0;

        buttons.forEach((button) => {
            buttonNum++
        });


        if (!removeSpeakButtons(buttonContainer) && buttonNum >= 1) {
            observer.disconnect();

            speakButton = document.createElement('button');
            speakButton.textContent = 'Speak';
            speakButton.classList.add('btn', 'relative', 'btn-neutral', 'border-0', 'md:border');
            speakButton.addEventListener('click', speaker);
            buttonContainer.appendChild(speakButton);

            observer.observe(target, config);
        }
    };

    function removeSpeakButtons(container) {
        const buttonsToRemove = [];

        for (const child of container.childNodes) {
            if (child.textContent.trim() == "Speak" || child.textContent.trim() == "Stop") {
                buttonsToRemove.push(child);
            }
        }

        for (const node of buttonsToRemove) {
            container.removeChild(node);
        }

        return buttonsToRemove.length > 0;
    };

    init();

}, false);
