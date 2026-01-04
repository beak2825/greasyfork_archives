// ==UserScript==
// @name         WaniKani Speech Input
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Helps you answer WaniKani prompts using speech recognition
// @author       Anonymous
// @match        https://www.wanikani.com/subjects/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472281/WaniKani%20Speech%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/472281/WaniKani%20Speech%20Input.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let language = null;
    let quizData = null;
    let currentSubject = null;

    const footer = document.createElement('div');
    footer.style.position = 'fixed';
    footer.style.left = '0';
    footer.style.bottom = '0';
    footer.style.width = '100%';
    footer.style.background = 'rgba(0, 0, 0, 0.5)';
    footer.style.color = 'white';
    footer.style.padding = '10px';
    footer.style.fontSize = '36px';
    footer.style.textAlign = 'center';
    document.body.appendChild(footer);

    const quizObserver = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                checkAll();
            }
        }
    });

    async function checkAll() {
        const questionTypeSpan = document.querySelector('.quiz-input__question-type');
        if (questionTypeSpan) {
            const questionType = questionTypeSpan.textContent.trim();
            const newLanguage = questionType === 'reading' ? 'ja' : 'en';
            if (newLanguage !== language) {
                language = newLanguage;
                console.log('Detected language: ', language);
                recognition.stop(); // stop recognition before changing the language
            }
        }
        const scriptTags = Array.from(document.getElementsByTagName('script'));
        const quizScript = scriptTags.find(tag => tag.getAttribute('type') === 'application/json' && tag.getAttribute('data-quiz-queue-target') === 'subjects');
        if (quizScript) {
            quizData = JSON.parse(quizScript.textContent);
        }

        const characterDiv = document.querySelector('.character-header__characters');
        if (characterDiv && quizData) {
            const characters = characterDiv.textContent.trim();
            currentSubject = quizData.find(subject => subject.characters === characters);
        }
    }

    let lastCallTimestamp = 0;

    // Function to fetch Kanji data from API
    async function fetchKanjiData(kanji) {
        const response = await fetch(`https://kanjiapi.dev/v1/kanji/${kanji}`);
        const data = await response.json();
        return data;
    }

    // Function to split text into individual Kanji
    function splitIntoKanji(text) {
        return Array.from(text).filter(char => (char.charCodeAt(0) >= 0x4E00 && char.charCodeAt(0) <= 0x9FFF));
    }


    async function enterAnswerAndNext(answer) {
        const now = Date.now();
        const minimumDelay = 3000; // Minimum delay between calls in milliseconds

        if (now - lastCallTimestamp < minimumDelay) {
            console.log('Function called too soon, ignoring.');
            return;
        }

        lastCallTimestamp = now;

        const inputBox = document.querySelector('input.quiz-input__input[data-quiz-input-target="input"]');
        inputBox.value = answer;
        console.log(`Answer entered: ${answer}`);

        const submitButton = document.querySelector('button.quiz-input__submit-button[data-quiz-input-target="button"]');
        if (submitButton) {
            submitButton.click();
            console.log('Submit button clicked');

            await new Promise(resolve => {
                const inputContainer = document.querySelector('div[data-quiz-input-target="inputContainer"]');
                let checkCount = 0;

                const intervalId = setInterval(() => {
                    const correctValue = inputContainer.getAttribute('correct');
                    if (correctValue === 'true') {
                        submitButton.click();
                        console.log('Submit button clicked again because answer was correct');
                        clearInterval(intervalId);
                        resolve();
                    } else if (checkCount > 3) { // stop checking after ~2 seconds
                        clearInterval(intervalId);
                        resolve();
                    }

                    checkCount++;
                }, 500);
            });
        } else {
            console.log('Submit button not found');
        }
    }

    function convertKana(input) {
        let hiraganaOutput = '';
        let katakanaOutput = '';

        for (let i = 0; i < input.length; i++) {
            let charCode = input.charCodeAt(i);

            // If the character is Hiragana, convert it to Katakana and vice versa.
            if (charCode >= 0x3041 && charCode <= 0x3096) {
                // Hiragana to Katakana: Add 96 to the charCode.
                katakanaOutput += String.fromCharCode(charCode + 96);
                hiraganaOutput += input[i];
            } else if (charCode >= 0x30A1 && charCode <= 0x30F6) {
                // Katakana to Hiragana: Subtract 96 from the charCode.
                hiraganaOutput += String.fromCharCode(charCode - 96);
                katakanaOutput += input[i];
            } else {
                // If the character is not Kana, just append it.
                hiraganaOutput += input[i];
                katakanaOutput += input[i];
            }
        }

        return [hiraganaOutput, katakanaOutput];
    }

    function enterWrongAnswer(language) {
        const now = Date.now();
        const minimumDelay = 3000; // Minimum delay between calls in milliseconds

        if (now - lastCallTimestamp < minimumDelay) {
            console.log('Function called too soon, ignoring.');
            return;
        }

        lastCallTimestamp = now;

        var answer = "this is a wrong answer";
        if (language === 'ja') {
            answer = "これはだめです"
        }

        const inputBox = document.querySelector('input.quiz-input__input[data-quiz-input-target="input"]');
        inputBox.value = answer;
        console.log(`Answer entered: ${answer}`);

        const submitButton = document.querySelector('button.quiz-input__submit-button[data-quiz-input-target="button"]');
        if (submitButton) {
            submitButton.click();
            console.log('Submit button clicked for wrong answer');
        } else {
            console.log('Submit button not found');
        }


    }

    recognition.onresult = event => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                const transcript = event.results[i][0].transcript.trim().toLowerCase();
                footer.textContent = `${transcript}`;
                console.log(`Transcript: ${transcript}`);

                // override to let user mark something wrong manually
                if(transcript === "wrong" || transcript === "ダメ") {
                    enterWrongAnswer(language);

                    // show the expected answer by clicking div with class additional-content__item--item-info
                    setTimeout(() => {
                        var infoItem = document.querySelector('.additional-content__item--item-info');
                        if (infoItem) {
                            infoItem.click();
                            console.log('Item info clicked to show expected answer');
                        } else {
                            console.log('Item info not found');
                        }
                    }, 500);

                }

                // override to let user manually go to next question
                if(transcript === "next" || transcript === "次") {
                    const submitButton = document.querySelector('button.quiz-input__submit-button[data-quiz-input-target="button"]');
                    if (submitButton) {
                        submitButton.click();
                        console.log('Submit button clicked for wrong answer');
                    } else {
                        console.log('Submit button not found');
                    }
                }

                // override to let user mark something correct manually
                if(transcript === "correct" || transcript === "正しい") {
                    // get the proper answer depending on the language and quiz type
                    // Assuming 'currentSubject' holds the correct answer
                    var answer;
                    if (language === 'en') {
                        // If the language is English, we'll assume the correct answer is in 'meanings' array.
                        // This is just an example and might need to be adjusted based on your 'currentSubject' structure
                        answer = currentSubject.meanings[0].text; // or whichever index holds the correct answer
                    } else if (language === 'ja') {
                        // If the language is Japanese, we'll assume the correct answer is in 'readings' array.
                        // This is just an example and might need to be adjusted based on your 'currentSubject' structure
                        answer = currentSubject.readings[0].text; // or whichever index holds the correct answer
                    }
                    enterAnswerAndNext(answer);
                    return;
                }

                if (!currentSubject) {
                    console.log('Quiz subject not found. Waiting for the next question...');
                    return;
                }

                if (language === 'en') {
                    const allMeanings = [
                        ...currentSubject.meanings.map(m => m.text.toLowerCase())
                    ];
                    console.log(`Meanings: ${allMeanings}`);
                    for (const meaning of allMeanings) {
                        // TODO: if meaning includes "to", make sure that we dont just match "to", make sure we match "to x" verbatim within the transcript
                        if (transcript.includes(meaning)) {
                            console.log(`Match found for "${transcript}" with "${meaning}"`);
                            enterAnswerAndNext(meaning);
                            return;
                        }
                    }
                } else if (language === 'ja') {
                    let allReadings = [];
                    // if it's vocab, we can just check vs the actual kanji
                    if (currentSubject.type === 'Vocabulary') {
                        allReadings = [...currentSubject.readings.map(r => r.text), currentSubject.characters];
                        console.log(`Readings: ${allReadings}`);
                        for(const reading of allReadings){
                            if (transcript.includes(reading)) {
                                console.log(`Match found for "${transcript}" with "${reading}"`);
                                enterAnswerAndNext(allReadings[0]);
                                return;
                            }
                        }

                    // if its kanji, we need the phonetic options for all kanji in the sentance
                    } else if (currentSubject.type === 'Kanji') {
                        var desiredReadingType = currentSubject.primary_reading_type;

                        const validReadings = currentSubject.readings
                        .filter(r => r.type === desiredReadingType)
                        .map(r => r.text);

                        allReadings = [...validReadings];

                        console.log(`Readings: ${allReadings}`);

                        for(const reading of allReadings){
                            if (transcript.includes(reading)) {
                                console.log(`Match found for "${transcript}" with "${reading}"`);
                                enterAnswerAndNext(reading);
                                return;
                            }
                        }

                        // Get individual Kanji from the transcript
                        const kanjisInTranscript = splitIntoKanji(transcript);

                        // Fetch data for each Kanji and check if the reading matches
                        const kanjiDataPromises = kanjisInTranscript.map(kanji => fetchKanjiData(kanji));
                        Promise.all(kanjiDataPromises).then(kanjiDataArray => {

                            for (const reading of allReadings) {
                                for (const kanjiData of kanjiDataArray) {
                                    // Get both 'kun' and 'on' readings from the kanjiData
                                    const onKanjiReadings = kanjiData['on_readings'];
                                    const kunKanjiReadings = kanjiData['kun_readings'];

                                    // Concatenate the 'kun' and 'on' readings into one array
                                    // and convert each reading to both katakana and hiragana
                                    const kanjiReadings = [
                                        ...onKanjiReadings.flatMap(convertKana),
                                        ...kunKanjiReadings.flatMap(convertKana)
                                    ];

                                    for (const kanjiReading of kanjiReadings) {
                                        // Since convertKana returns an array, we should compare with kanjiReading[0] or kanjiReading[1]
                                        if (allReadings.includes(kanjiReading)) {
                                            console.log(`Match found for "${transcript}" with "${kanjiReading}"`);
                                            enterAnswerAndNext(kanjiReading);
                                            return;
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
    };

    checkAll();
    const targetNode = document.querySelector('body');
    quizObserver.observe(targetNode, { childList: true, subtree: true });

    recognition.continuous = true;

    recognition.onend = function () {
        recognition.lang = language === 'ja' ? 'ja-JP' : 'en-US';
        recognition.start();
        console.log("rec language: " + recognition.lang);
    }

    console.log("Starting language recognition");
    recognition.lang = language === 'ja' ? 'ja-JP' : 'en-US';
    recognition.start();
    console.log("rec language: " + recognition.lang);

})();
