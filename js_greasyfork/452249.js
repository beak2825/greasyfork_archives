// ==UserScript==
// @name         Duolingo-Cheat-Tool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto answer Duolingo script!
// @author       Tran Quy <tranphuquy19@gmail.com>
// @match        https://www.duolingo.com/skill*
// @icon         https://www.google.com/s2/favicons?domain=duolingo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452249/Duolingo-Cheat-Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/452249/Duolingo-Cheat-Tool.meta.js
// ==/UserScript==

const DEBUG = true;
let mainInterval;

const dataTestComponentClassName = 'e4VJZ';

const TIME_OUT = 1000;

// Challenge types
const CHARACTER_SELECT_TYPE = 'characterSelect';
const CHARACTER_MATCH_TYPE = 'characterMatch'; // not yet
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

// Query DOM keys
const CHALLENGE_CHOICE_CARD = '[data-test="challenge-choice-card"]';
const CHALLENGE_CHOICE = '[data-test="challenge-choice"]';
const CHALLENGE_TRANSLATE_INPUT = '[data-test="challenge-translate-input"]';
const CHALLENGE_LISTEN_TAP = '[data-test="challenge-listenTap"]';
const CHALLENGE_JUDGE_TEXT = '[data-test="challenge-judge-text"]';
const CHALLENGE_TEXT_INPUT = '[data-test="challenge-text-input"]';
const CHALLENGE_TAP_TOKEN = '[data-test="challenge-tap-token"]';
const PLAYER_NEXT = '[data-test="player-next"]';
const PLAYER_SKIP = '[data-test="player-skip"]';
const BLAME_INCORRECT = '[data-test="blame blame-incorrect"]';
const CHARACTER_MATCH = '[data-test="challenge challenge-characterMatch"]';

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
        return challenge;
    }
}

function pressEnter() {
    document.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 13, 'which': 13 }));
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
        case FORM_TYPE: { // trắc nghiệm 1 đáp án
            const { choices, correctIndex } = challenge;
            if (DEBUG) console.log('READ_COMPREHENSION LISTEN_COMPREHENSION FORM', { choices, correctIndex });
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

        case CHARACTER_MATCH_TYPE: { // tập hợp các cặp thẻ
            const { pairs } = challenge;
            const tokens = document.querySelectorAll(CHALLENGE_TAP_TOKEN);
            pairs.forEach((pair) => {
                for(let i = 0; i < tokens.length; i++) {
                    if(tokens[i].innerText === pair.transliteration || tokens[i].innerText === pair.character) {
                        tokens[i].dispatchEvent(clickEvent);
                    }
                }
            })
            return { pairs };
        }

        case TRANSLATE_TYPE: {
            const { correctTokens, correctSolutions } = challenge;
            if (DEBUG) console.log('TRANSLATE', { correctTokens });
            if (correctTokens) {
                const tokens = document.querySelectorAll(CHALLENGE_TAP_TOKEN);
                let ignoreTokeIndexes = [];
                for (let correctTokenIndex in correctTokens) {
                    for (let tokenIndex in tokens) {
                        const token = tokens[tokenIndex];
                        if (ignoreTokeIndexes.includes(tokenIndex)) continue;
                        if (token.innerText === correctTokens[correctTokenIndex]) {
                            token.dispatchEvent(clickEvent);
                            ignoreTokeIndexes.push(tokenIndex);
                            if(DEBUG) console.log(`correctTokenIndex [${correctTokens[correctTokenIndex]}] - tokenIndex [${token.innerText}]`);
                            break;
                        };
                    }
                }
            } else if (correctSolutions) {
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
            for (let wordIndex in correctTokens) {
                tokens.forEach((token) => {
                    if (token.innerText === correctTokens[wordIndex]) {
                        token.dispatchEvent(clickEvent);
                    };
                });
            }
            return { correctTokens };
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

function main() {
    try {
        let isPlayerNext = document.querySelectorAll(PLAYER_NEXT)[0].textContent.toUpperCase();
        if (isPlayerNext.valueOf() !== 'CONTINUE') {
            classify();
            breakWhenIncorrect()
            pressEnter();
        }
        setTimeout(pressEnter, 150);
    } catch (e) {
        console.log(e);
    }
}

function solveChallenge() {
    mainInterval = setInterval(main, TIME_OUT);
    console.log(`to stop run this command clearInterval(${mainInterval})`);
}

// solveChallenge();
(solveChallenge)();
1
