// ==UserScript==
// @name          Wanikani ReadingMeaning Text
// @namespace     rwesterhof
// @description   Replaces the Reading and Meaning words during reviews
// @version       1.5
// @match         https://preview.wanikani.com/subjects/review*
// @match         https://preview.wanikani.com/subjects/lesson*
// @match         https://preview.wanikani.com/subjects/extra_study*
// @match         https://www.wanikani.com/subjects/review*
// @match         https://www.wanikani.com/subjects/lesson*
// @match         https://www.wanikani.com/subjects/extra_study*
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/421401/Wanikani%20ReadingMeaning%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/421401/Wanikani%20ReadingMeaning%20Text.meta.js
// ==/UserScript==

//
// Choose any words to replace 'Reading' and 'Meaning' here
// use "" to prevent replacement
//
const READING_REPLACEMENT = "Japanese";
const MEANING_REPLACEMENT = "English";
//
// Choose the background color gradient for the question bar (top and bottom colors - use twice the same for a solid color block)
// use "" for the default colors
//
const READING_BACKGROUND = "#009966, #007040"; // green
//const READING_BACKGROUND = ""; // default (black)
//const MEANING_BACKGROUND = #ffaa00, #c09000"; // yellow
const MEANING_BACKGROUND = ""; // default (light grey)

// actual functioning
(function() {
    'use strict';

    function consoleLog(obj) {
        if (obj != undefined) {
            for (var key in obj) {
             console.log('key: ' + key + ', value: ' + obj[key]);
            }
      }
    }

    // CSS Styling
    if (READING_BACKGROUND != "") {
        var readingStyle = document.createElement('style');
        readingStyle.id = "rm_text_reading";
        readingStyle.appendChild(document.createTextNode('.quiz-input .quiz-input__question-type-container[data-question-type=reading] { background-image:linear-gradient(to bottom, ' + READING_BACKGROUND + '); }'));
        document.getElementsByTagName('head')[0].appendChild(readingStyle);
    }
    if (MEANING_BACKGROUND != "") {
        var meaningStyle = document.createElement('style');
        meaningStyle.id = "rm_text_meaning";
        meaningStyle.appendChild(document.createTextNode('.quiz-input .quiz-input__question-type-container[data-question-type=meaning] { background-image:linear-gradient(to bottom, ' + MEANING_BACKGROUND + '); }'));
        document.getElementsByTagName('head')[0].appendChiled(meaningStyle);
    }

    // Select the node that will be observed for mutations
    var targetNode = document.getElementsByClassName('quiz-input__question-type')[0];
    var config = { attributes: false, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // prevent loops because we'll be changing the contents as well
        observer.disconnect();

        var selection= document.getElementsByClassName('quiz-input__question-type')[0];

        var selectionText = selection.innerHTML || "";
        if (/reading/.test(selectionText) && (READING_REPLACEMENT != "")) {
            selection.innerHTML = selectionText.replace("reading", READING_REPLACEMENT);
        }
        else if (/meaning/.test(selectionText) && (MEANING_REPLACEMENT != "")) {
            selection.innerHTML = selectionText.replace("meaning", MEANING_REPLACEMENT);
        }

        // reattach
        observer.observe(targetNode, config);
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    // in the new setup, the text is prepopulated and doesn't trigger the observer, so we call manually
    callback(null, observer);
    // we still need the observer though, because it post populates as well!!!
})();