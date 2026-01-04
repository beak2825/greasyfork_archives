// ==UserScript==
// @name         DUOLINGO-AUTO-SAVER-LESSON
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto hack your lesson
// @author       Crazy tiger
// @match        http://www.duolingo.com/lesson
// @match        http://www.duolingo.com/learn
// @icon         2wCEAAkGBxAQEA8QDw8PDxAWFRIVDw8QDw8OEBAQFRUWFhUVFRUYHSggGBolGxUXITEhJSkrLi8uFyEzODMtNygtLisBCgoKDg0OGhAQGislHSUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542116/DUOLINGO-AUTO-SAVER-LESSON.user.js
// @updateURL https://update.greasyfork.org/scripts/542116/DUOLINGO-AUTO-SAVER-LESSON.meta.js
// ==/UserScript==

// WARNING/DISCLAIMER: Cheating can lead to account ban. The script is research-oriented in programming.
// Enjoy learning new languages. Thank you!
// Update 2023-Aug-07: Fix bug, add new challenge types


const DEBUG = true;
// let AUTO_PRACTICE = localStorage.getItem('AUTO_PRACTICE') === 'true' ? true : false; // earn exp by practice
let AUTO_PRACTICE = false;
let mainInterval;
let practiceInterval;

const dataTestComponentClassName = 'e4VJZ';

const TIME_OUT = 1000;

// Challenge types
const CHARACTER_SELECT_TYPE = 'characterSelect';
const CHARACTER_MATCH_TYPE = 'characterMatch';
const MATCH_TYPE = 'match';
const TRANSLATE_TYPE = 'translate';
const LISTEN_TAP_TYPE = 'listenTap';
const NAME_TYPE = 'name';
const COMPLETE_REVERSE_TRANSLATION_TYPE = 'completeReverseTranslation';
const LISTEN_TYPE = 'listen';
const SELECT_TYPE = 'select';
const JUDGE_TYPE = 'judge';
const FORM_TYPE = 'form';
const LISTEN_COMPREHENSION_TYPE = 'listenComprehension';
const READ_COMPREHENSION_TYPE = 'readComprehension';
const CHARACTER_INTRO_TYPE = 'characterIntro';
const DIALOGUE_TYPE = 'dialogue';
const SELECT_TRANSCRIPTION_TYPE = 'selectTranscription';
const SPEAK_TYPE = 'speak';
const SELECT_PRONUNCIATION_TYPE = 'selectPronunciation';
const ASSIST_TYPE = 'assist';
const LISTEN_MATCH_TYPE = 'listenMatch';
const LISTEN_COMPLETE_TYPE = 'listenComplete';

// Query DOM keys
const CHALLENGE_CHOICE_CARD = '[data-test="challenge-choice"]';
const CHALLENGE_CHOICE = '[data-test="challenge-choice"]';
const CHALLENGE_TRANSLATE_INPUT = '[data-test="challenge-translate-input"]';
const CHALLENGE_LISTEN_TAP = '[data-test="challenge-listenTap"]';
const CHALLENGE_JUDGE_TEXT = '[data-test="challenge-judge-text"]';
const CHALLENGE_TEXT_INPUT = '[data-test="challenge-text-input"]';
const CHALLENGE_TAP_TOKEN = '[data-test*="-challenge-tap-token"]';
const PLAYER_NEXT = '[data-test="player-next"]';
const PLAYER_SKIP = '[data-test="player-skip"]';
const BLAME_INCORRECT = '[data-test="blame blame-incorrect"]';
const CHARACTER_MATCH = '[data-test="challenge challenge-characterMatch"]';
const PRACTICE_BTN = '[data-test="global-practice"]';

const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
});

function getChallengeObj(theObject) {
    let result = null;
    if (theObject instanceof Array) {
        for (let i = 0; i < theObject.length; i++) {
            result = getChallengeObj(theObject[i]);
            if (result) {
                break;
            }
        }
    }
    else {
        for (let prop in theObject) {
            if (prop == 'challenge') {
                if (typeof theObject[prop] == 'object') {
                    return theObject;
                }
            }
            if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                result = getChallengeObj(theObject[prop]);
                if (result) {
                    break;
                }
            }
        }
    }
    return result;
}

function getChallenge() {
    // const dataTestComponentClassName = 'e4VJZ';
    const dataTestDOM = document.getElementsByClassName(dataTestComponentClassName)[0];

    if (!dataTestDOM) {
        document.querySelectorAll(PLAYER_NEXT)[0].dispatchEvent(clickEvent);
        return null;
    } else {
        const dataTestAtrr = Object.keys(dataTestDOM).filter(att => /^__reactProps/g.test(att))[0];
        const childDataTestProps = dataTestDOM[dataTestAtrr];
        const { challenge } = getChallengeObj(childDataTestProps);
        if (DEBUG) console.log('challenge', challenge);
        return challenge;
    }
}

function nextQuestion() {
    // document.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 13, 'which': 13 }));
    document.querySelectorAll(PLAYER_NEXT)[0].dispatchEvent(clickEvent);
}

function dynamicInput(element, msg) {
    let input = element;
    let lastValue = input.value;
    input.value = msg;
    let event = new Event('input', { bubbles: true });
    // hack React15
    event.simulated = true;
    // hack React16 内部定义了descriptor拦截value，此处重置状态
    let tracker = input._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    input.dispatchEvent(event);
}

function classify() {
    const challenge = getChallenge();
    if (!challenge) return;
    if (DEBUG) console.log(`${challenge.type}`, challenge);
    switch (challenge.type) {
        case SELECT_PRONUNCIATION_TYPE:
        case READ_COMPREHENSION_TYPE:
        case LISTEN_COMPREHENSION_TYPE:
        case ASSIST_TYPE:
        case FORM_TYPE: { // trắc nghiệm 1 đáp án
            const { choices, correctIndex } = challenge;
            if (DEBUG) console.log('READ_COMPREHENSION LISTEN_COMPREHENSION FORM ASSIST', { choices, correctIndex });
            document.querySelectorAll(CHALLENGE_CHOICE)[correctIndex].dispatchEvent(clickEvent);
            return { choices, correctIndex };
        }

        case SELECT_TYPE:
        case CHARACTER_SELECT_TYPE: { // trắc nghiệm 1 đáp án
            const { choices, correctIndex } = challenge;
            if (DEBUG) console.log('SELECT CHARACTER_SELECT', { choices, correctIndex });
            document.querySelectorAll(CHALLENGE_CHOICE_CARD)[correctIndex].dispatchEvent(clickEvent);
            return { choices, correctIndex };
        }

        case MATCH_TYPE: {
            const { pairs } = challenge;
            // remove all span tag element
            const tokens = Array.from(document.querySelectorAll(CHALLENGE_TAP_TOKEN)).filter(token => token.tagName !== 'SPAN');
            pairs.forEach((pair) => {
                for (let i = 0; i < tokens.length; i++) {
                    const _innerText = tokens[i].innerText.split('\n')[1];
                    if (_innerText === pair.fromToken || _innerText === pair.learningToken) {
                        tokens[i].dispatchEvent(clickEvent);
                    }
                }
            })
            return { pairs };
        }

        case LISTEN_MATCH_TYPE: {
            const { pairs } = challenge;
            const tokens = Array.from(document.querySelectorAll(CHALLENGE_TAP_TOKEN));
            // click 2 token has same attribute 'data-test'
            for (let i = 0; i < tokens.length; i++) {
                const firstToken = tokens[i];
                for (let j = i + 1; j < tokens.length; j++) {
                    const secondToken = tokens[j];
                    if (firstToken.getAttribute('data-test') === secondToken.getAttribute('data-test')) {
                        firstToken.dispatchEvent(clickEvent);
                        secondToken.dispatchEvent(clickEvent);
                    }
                }
            }
            return { pairs };
        }



        case CHARACTER_MATCH_TYPE: { // tập hợp các cặp thẻ
            const { pairs } = challenge;
            const tokens = document.querySelectorAll(CHALLENGE_TAP_TOKEN);
            pairs.forEach((pair) => {
                for (let i = 0; i < tokens.length; i++) {
                    const _innerText = tokens[i].innerText.split('\n')[1];
                    if (_innerText === pair.transliteration || _innerText === pair.character) {
                        tokens[i].dispatchEvent(clickEvent);
                    }
                }
            })
            return { pairs };
        }

        case TRANSLATE_TYPE: {
            const { correctTokens, correctSolutions } = challenge;
            if (correctTokens) {
                if (DEBUG) console.log('TRANSLATE_correctTokens', { correctTokens });
                const tokens = document.querySelectorAll(CHALLENGE_TAP_TOKEN);
                let ignoreTokeIndexes = [];
                for (let correctTokenIndex in correctTokens) {
                    for (let tokenIndex in tokens) {
                        const token = tokens[tokenIndex];
                        if (ignoreTokeIndexes.includes(tokenIndex)) continue;
                        if (token.innerText === correctTokens[correctTokenIndex]) {
                            token.dispatchEvent(clickEvent);
                            ignoreTokeIndexes.push(tokenIndex);
                            if (DEBUG) console.log(`correctTokenIndex [${correctTokens[correctTokenIndex]}] - tokenIndex [${token.innerText}]`);
                            break;
                        };
                    }
                }
            } else if (!!correctSolutions) {
                if (DEBUG) console.log('TRANSLATE_correctSolutions', { correctSolutions });
                let textInputElement = document.querySelectorAll(CHALLENGE_TRANSLATE_INPUT)[0];
                dynamicInput(textInputElement, correctSolutions[0]);
            }

            return { correctTokens };
        }

        case NAME_TYPE: { // nhập đán án
            const { correctSolutions } = challenge;
            if (DEBUG) console.log('NAME', { correctSolutions });
            let textInputElement = document.querySelectorAll(CHALLENGE_TEXT_INPUT)[0];
            let correctSolution = correctSolutions[0];
            dynamicInput(textInputElement, correctSolution);
            return { correctSolutions };
        }

        case COMPLETE_REVERSE_TRANSLATION_TYPE: { // điền vào từ còn thiếu
            const { displayTokens } = challenge;
            if (DEBUG) console.log('COMPLETE_REVERSE_TRANLATION', { displayTokens });
            const { text } = displayTokens.filter(token => token.isBlank)[0];
            let textInputElement = document.querySelectorAll(CHALLENGE_TEXT_INPUT)[0];
            dynamicInput(textInputElement, text);
            return { displayTokens };
        }

        case LISTEN_TAP_TYPE: {
            const { correctTokens } = challenge;
            if (DEBUG) console.log('LISTEN_TAP', { correctTokens });
            const tokens = document.querySelectorAll(CHALLENGE_TAP_TOKEN);
            const ignoreTokens = [];
            for (let i = 0; i < correctTokens.length; i++) {
                for (let j = 0; j < tokens.length; j++) {
                    if (tokens[j].innerText === correctTokens[i] && !ignoreTokens.includes(j)) {
                        ignoreTokens.push(j);
                        tokens[j].dispatchEvent(clickEvent);
                        break;
                    }
                }
            }
            return { correctTokens };
        }

        case LISTEN_COMPLETE_TYPE: {
            const { displayTokens } = challenge;
            if (DEBUG) console.log('LISTEN_COMPLETE', { displayTokens });
            let textInputElement = document.querySelectorAll(CHALLENGE_TEXT_INPUT)[0];
            const correctAnswer = displayTokens.find(token => token.isBlank).text;
            dynamicInput(textInputElement, correctAnswer);
            return { displayTokens };
        }

        case LISTEN_TYPE: { // nghe và điền vào ô input
            const { prompt } = challenge;
            if (DEBUG) console.log('LISTEN', { prompt });
            let textInputElement = document.querySelectorAll(CHALLENGE_TRANSLATE_INPUT)[0];
            dynamicInput(textInputElement, prompt);
            return { prompt };
        }

        case JUDGE_TYPE: { // trắc nghiệm 1 đáp án
            const { correctIndices } = challenge;
            if (DEBUG) console.log('JUDGE', { correctIndices });
            document.querySelectorAll(CHALLENGE_JUDGE_TEXT)[correctIndices[0]].dispatchEvent(clickEvent);
            return { correctIndices };
        }

        case DIALOGUE_TYPE:
        case CHARACTER_INTRO_TYPE: { // trắc nghiệm 1 đáp án
            const { choices, correctIndex } = challenge;
            if (DEBUG) console.log('DIALOGUE CHARACTER_INTRO', { choices, correctIndex });
            document.querySelectorAll(CHALLENGE_JUDGE_TEXT)[correctIndex].dispatchEvent(clickEvent);
            return { choices, correctIndex };
        }

        case SELECT_TRANSCRIPTION_TYPE: {
            const { choices, correctIndex } = challenge;
            if (DEBUG) console.log('DIALOGUE CHARACTER_INTRO', { choices, correctIndex });
            document.querySelectorAll(CHALLENGE_JUDGE_TEXT)[correctIndex].dispatchEvent(clickEvent);
            return { choices, correctIndex };
        }

        case SPEAK_TYPE: {
            const { prompt } = challenge;
            if (DEBUG) console.log('SPEAK', { prompt });
            document.querySelectorAll(PLAYER_SKIP)[0].dispatchEvent(clickEvent);
            return { prompt };
        }

        default:
            break;
    }
}

function breakWhenIncorrect() {
    const isBreak = document.querySelectorAll(BLAME_INCORRECT).length > 0;
    if (isBreak) {
        console.log('Incorrect, stopped');
        clearInterval(mainInterval);
    };
}

function clickPracticeButton() {
    try {
        document.querySelectorAll(PRACTICE_BTN)[0].dispatchEvent(clickEvent);
    } catch (e) {
        console.log(e);
    }
}

function main() {
    try {
        let isPlayerNext = document.querySelectorAll(PLAYER_NEXT)[0].textContent.toUpperCase();
        if (isPlayerNext.valueOf() !== 'CONTINUE') {
            classify();
            breakWhenIncorrect()
            nextQuestion();
        }
        setTimeout(nextQuestion, 150);

    } catch (e) {
        console.log(e);
    }
}

function solveChallenge() {
    AUTO_PRACTICE = localStorage.getItem('AUTO_PRACTICE') || false; // earn exp by practice
    if (AUTO_PRACTICE && window.location.href.endsWith('/learn')) {
        // click practice button
        practiceInterval = setTimeout(clickPracticeButton, 5000);
    }
    mainInterval = setInterval(main, TIME_OUT);
    console.log(`to stop run this command clearInterval(${mainInterval})`);
}

// solveChallenge();
(solveChallenge)();

(function() {
    'use strict';

    // Your code here...
})();