// ==UserScript==
// @name         Wanikani-Skipper
// @namespace    https://www.wanikani.com/
// @version      2024-01-02
// @description  This script allows to skip any type of quiz question (configurable) on WaniKani (lesson, review, extra study, recent mistakes) by answering it automatically correctly thereby allowing to learn Kanji with WaniKani exactly how one prefers.
// @copyright    2023-2024, Marcel Benjamin Schwegler
// @license      MIT; http://opensource.org/licenses/MIT
// @match        https://www.wanikani.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/483511/Wanikani-Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/483511/Wanikani-Skipper.meta.js
// ==/UserScript==

// ----------------------------------------- OPTIONS -----------------------------------------------
let AUTOMATIC_MODE = false; // Determines in which mode to start first time (auto skip or manual skip)
const WANIKANI_API_KEY = ''; // API key necessary to request information about quizzes from WaniKani

const SKIP_RADICAL_MEANING = false; // Determines if radical meaning quizzes should be skipped in automatic mode
const SKIP_KANJI_MEANING = false; // Determines if kanji meaning quizzes should be skipped in automatic mode
const SKIP_KANJI_READING = false; // Determines if kanji reading quizzes should be skipped in automatic mode
const SKIP_VOCABULARY_MEANING = false; // Determines if vocabulary meaning quizzes should be skipped in automatic mode
const SKIP_VOCABULARY_READING = false; // Determines if vocabulary reading quizzes should be skipped in automatic mode
const SKIP_KANA_VOCABULARY_MEANING = false; // Determines if kana vocabulary quizzes should be skipped in automatic mode

const KEEP_INPUT_FIELD_FOCUSED = true; // Determines if input field will keep cursor active after submitting





// #####################################################################################################################
// ---------------------------------------------------------------------------------------------------------------------
// ------------------------------ DO ONLY MODIFY IF YOU KNOW WHAT YOU DO------------------------------------------------

const RETRY_MS = 250;
const DEBOUNCE_DELAY_MS = 100;
const ALLOWED_URL_PATTERNS = [
    /^https:\/\/www\.wanikani\.com\/subject-lessons\/.*\/quiz.*/,
    /^https:\/\/www\.wanikani\.com\/subjects\/review.*/,
    /^https:\/\/www\.wanikani\.com\/subjects\/extra_study.*/,
    /^https:\/\/www\.wanikani\.com\/recent-mistakes.*/
];
const SUBMIT_SOLUTION_CLASS = '.quiz-input__submit-button';
const ANSWER_INPUT_ID = '#user-response';
const QUIZ_INPUT_LABEL_CLASS = ".quiz-input__question-type-container";
const QUIZ_MENU_CLASS = ".character-header__menu-navigation-link";
let SUBMIT_SOLUTION_ELEMENT;
let ANSWER_INPUT_ELEMENT;
let QUIZ_INPUT_LABEL_ELEMENT;
let QUIZ_MENU_ELEMENT;
const INPUT_CONTAINER_CLASS = '.quiz-input__input-container';
const INPUT_CORRECT_ATTR = 'correct';
let QUIZ_STATE_CHANGED_OBSERVER;
let IS_PROCESSING_QUIZ = false;
let QUIZ_QUEUE = [];
const AUTOMATIC_MODE_ICON = '<i class="fa-solid fa-a"></i>';
const MANUAL_MODE_ICON = '<i class="fa-solid fa-m"></i>';
const SKIP_BUTTON_STYLE_ELEMENT = $('<style>').text(INPUT_CONTAINER_CLASS + '[' + INPUT_CORRECT_ATTR + '=true]' + ' #skipButton { color: white !important; } ' + INPUT_CONTAINER_CLASS + '[' + INPUT_CORRECT_ATTR + '=false]' + ' #skipButton { color: white !important; }');

// -------------------------------------------- HELPERS ----------------------------------------------------------------

function getKanjiPrimaryReadingType(itemData) {
  let readingMatch = itemData.data.readings.find(
      function(reading){ return reading.primary == true }
  );
  return readingMatch.type;
}

function getKanjiOnyomiReading(itemData) {
  let readingMatch = itemData.data.readings.find(
      function(reading){ return reading.type == 'onyomi' && reading.accepted_answer == true }
  );
  return readingMatch.reading;
}

function getKanjiKunyomiReading(itemData) {
  let readingMatch = itemData.data.readings.find(
      function(reading){ return reading.type == 'kunyomi' && reading.accepted_answer == true }
  );
  return readingMatch.reading;
}

function getMeaning(itemData) {
  let meaningMatch = itemData.data.meanings.find(
      function(meaning){ return meaning.accepted_answer == true }
  );
  return meaningMatch.meaning;
}

function getReading(itemData) {
  let readingMatch = itemData.data.readings.find(
      function(reading){ return reading.accepted_answer == true }
  );
  return readingMatch.reading;
}

function getCurrentItemId() {
  return QUIZ_INPUT_LABEL_ELEMENT.attr("data-subject-id");
}

function getCurrentQuizType() {
  return QUIZ_INPUT_LABEL_ELEMENT.attr("data-question-type");
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setAutomaticMode(mode) {
    localStorage.setItem('auto', JSON.stringify(mode));
}

function getAutomaticMode() {
    return JSON.parse(localStorage.getItem('auto'));
}

function hasQuizToBeSkipped(quizType, objectType) {
    // Map config of possible quizzes
    const conditions = {
        'meaning_radical': SKIP_RADICAL_MEANING,
        'meaning_kanji': SKIP_KANJI_MEANING,
        'reading_kanji': SKIP_KANJI_READING,
        'meaning_vocabulary': SKIP_VOCABULARY_MEANING,
        'reading_vocabulary': SKIP_VOCABULARY_READING,
        'meaning_kana_vocabulary': SKIP_KANA_VOCABULARY_MEANING
    };

    return conditions[quizType + '_' + objectType];
}

function matchesURLPattern(patterns) {
    return patterns.some(pattern => pattern.test(window.location.href));
}

function waitForPageChange() {
    const deferred = $.Deferred();

    const observer = new MutationObserver(() => {
        if (matchesURLPattern(ALLOWED_URL_PATTERNS)) {
            deferred.resolve();
        }
    });

    observer.observe(document.body, { subtree: true, childList: true });

    return deferred.promise();
}

function addModeButton() {
    // Create the button element
    var modeButton = $('<button>', {
      id: 'modeButton',
      text: '',
      click: modeButtonClick,
      css: {
        'cursor': 'pointer',
        'background': 'rgba(0,0,0,0)',
        'border': '0',
        'padding': '0 15px',
        'font-size': '17px',
        'color': 'inherit',
      }
    });

    if(getAutomaticMode()) {
        modeButton.append(AUTOMATIC_MODE_ICON);
    }
    else {
        modeButton.append(MANUAL_MODE_ICON);
    }

    QUIZ_MENU_ELEMENT.after(modeButton);
}

async function modeButtonClick() {
    let modeButtonElement = $('#modeButton');
    if(getAutomaticMode()) {
        setAutomaticMode(false);
        modeButtonElement.find('i').replaceWith(MANUAL_MODE_ICON);
        console.log("Wanikani-Skipper: Manual Mode");
        removeQuizChangedObserver();
        addSkipButton();
    }
    else {
        setAutomaticMode(true);
        modeButtonElement.find('i').replaceWith(AUTOMATIC_MODE_ICON);
        console.log("Wanikani-Skipper: Automatic Mode");
        removeSkipButton();
        addQuizChangedObserver();
    }

}

function addSkipButton() {
    // Create the button element
    var skipButtonElement = $('<button>', {
      id: 'skipButton',
      text: '',
      click: skipButtonClick,
      css: {
        'cursor': 'pointer',
        'position': 'absolute',
        'top': '10px',
        'right': '40px',
        'bottom': '10px',
        'background': 'rgba(0,0,0,0)',
        'border': '0',
        'padding': '0 20px',
        'font-size': '16px',
        'color': 'inherit',
      }
    });
    skipButtonElement.append('<i class="fa-solid fa-angles-right"></i>');

    // Follow submit button style changes
    $('head').append(SKIP_BUTTON_STYLE_ELEMENT);

    SUBMIT_SOLUTION_ELEMENT.before(skipButtonElement);
}

async function skipButtonClick() {

    await SolveCurrentQuiz();
}

function removeSkipButton() {
    let skipButtonElement = $('#skipButton');
    skipButtonElement.remove();
    SKIP_BUTTON_STYLE_ELEMENT.remove();
}

function addQuizChangedObserver() {

    const processQuizChanged = async function() {
        let errorHappened = false;
        do {
            errorHappened = await SolveCurrentQuiz();
            if(errorHappened) {
                await delay(RETRY_MS);
            }
        } while(errorHappened);
        await delay(DEBOUNCE_DELAY_MS);
    };

    // Kickstart by trying to solve first quiz
    QUIZ_QUEUE.push(processQuizChanged);
    if (!IS_PROCESSING_QUIZ) {
        processQuizQueue();
    }

    QUIZ_STATE_CHANGED_OBSERVER = new MutationObserver(function(mutations) {
        let quizHasChanged = false;
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-subject-id' || mutation.attributeName === 'data-question-type') {
               quizHasChanged = true;
            }
        });

        if(quizHasChanged) {
            // Enqueue quiz solving request
            QUIZ_QUEUE.push(processQuizChanged);

            // Handle quiz solving request if no other is currently processed
            if (!IS_PROCESSING_QUIZ) {
                processQuizQueue();
            }
        }
    });

    // Configure and start the observer
    const config = { attributes: true };
    QUIZ_STATE_CHANGED_OBSERVER.observe(QUIZ_INPUT_LABEL_ELEMENT[0], config);
}

async function processQuizQueue() {
    IS_PROCESSING_QUIZ = true;

    while (QUIZ_QUEUE.length > 0) {
        const callback = QUIZ_QUEUE.shift();
        if (typeof callback === 'function') {
            await callback();
        }
    }

    IS_PROCESSING_QUIZ = false;
}

function removeQuizChangedObserver() {
    if (QUIZ_STATE_CHANGED_OBSERVER) {
        QUIZ_STATE_CHANGED_OBSERVER.disconnect();
    }
}

// ----------------------------------------------- QUIZ SOLVING LOGIC ------------------------------------------------

function getItemDataById(itemId) {
    // Make the API request using jQuery
    console.log(`Wanikani-Skipper: Fetching item data from: https://api.wanikani.com/v2/subjects/${itemId}`);
    return $.ajax({
        url: `https://api.wanikani.com/v2/subjects/${itemId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${WANIKANI_API_KEY}`,
        },
        error: function(xhr, status, error) {
            console.error('Wanikani-Skipper: API request failed:', error);
        }
    });
}

function getQuizAnswer(itemData, quizType) {
    let answer;
    if(quizType === "reading" && itemData.object !== "vocabulary") {
       if(getKanjiPrimaryReadingType(itemData) === "onyomi") {
           answer = getKanjiOnyomiReading(itemData);
       }
       else {
           answer = getKanjiKunyomiReading(itemData);
       }

    }
    else if(quizType === "reading" && itemData.object === "vocabulary") {
       answer = getReading(itemData);
    }
    else {
       answer = getMeaning(itemData);
    }

    return answer;
}


async function SolveCurrentQuiz() {
    let errorHappened = false;

    // Request all data for current quiz item
    let currentItemId = getCurrentItemId();
    let currentQuizType = getCurrentQuizType();

    try {
        // Retrieve information about the item to solve via WaniKani API
        let currentItemJson = await getItemDataById(currentItemId);

        if((getAutomaticMode() && hasQuizToBeSkipped(currentQuizType, currentItemJson.object)) || !getAutomaticMode()) {
            console.log("Wanikani-Skipper: Trying to solve current quiz item ..");

            const quizSolution = getQuizAnswer(currentItemJson, currentQuizType);

            console.log("Wanikani-Skipper: Item-Id: " + currentItemId);
            console.log("Wanikani-Skipper: Quiz-Type: " + currentQuizType);
            console.log("Wanikani-Skipper: Answer: " + quizSolution);

            // Enter and submit solution
            ANSWER_INPUT_ELEMENT.val(quizSolution);
            SUBMIT_SOLUTION_ELEMENT.click();
            SUBMIT_SOLUTION_ELEMENT.click();

            // Determine if cursor shall be kept active in input field
            if(KEEP_INPUT_FIELD_FOCUSED) {
                ANSWER_INPUT_ELEMENT.focus();
            }
            else {
                ANSWER_INPUT_ELEMENT.blur();
            }
        }
        else {
            console.log("Wanikani-Skipper: Current quiz item is configured to be not skipped. Wait until user submits solution..");
        }
    } catch (error) {
        console.error('Wanikani-Skipper: Could not solve quiz due to error.');
        errorHappened = true;
    }

    return errorHappened;
}


//---------------------------------------------------- PROGRAM ENTRY POINT --------------------------------------------------------

(async function() {
    'use strict';

    if (!getAutomaticMode()) {
        setAutomaticMode(AUTOMATIC_MODE);
    }

    if(WANIKANI_API_KEY) {
        // Wait for valid URL
        while(true) {
            if(matchesURLPattern(ALLOWED_URL_PATTERNS)) {
                console.log("Wanikani-Skipper: Wanikani URL allowed!");

                // Load necessary elements from page
                SUBMIT_SOLUTION_ELEMENT = $(SUBMIT_SOLUTION_CLASS);
                ANSWER_INPUT_ELEMENT = $(ANSWER_INPUT_ID);
                QUIZ_INPUT_LABEL_ELEMENT = $(QUIZ_INPUT_LABEL_CLASS);
                QUIZ_MENU_ELEMENT = $(QUIZ_MENU_CLASS);

                addModeButton();

                if(getAutomaticMode()) {
                    console.log("Wanikani-Skipper: Automatic Mode");
                    addQuizChangedObserver();
                }
                else {
                    console.log("Wanikani-Skipper: Manual Mode");
                    addSkipButton();
                }
                break;
            }
            else {
                console.log("Wanikani-Skipper: Wanikani URL not allowed!");
                await waitForPageChange();
            }
        }
    }
    else {
        console.log("Wanikani-Skipper: Please add your Wanikani-API-Key for the script to function!");
    }
    
})();