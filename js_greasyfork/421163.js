// ==UserScript==
// @name         Wanikani Multiple Answer Input (revamped)
// @namespace    buschwichtel
// @version      1.2.2
// @description  Input multiple readings/meanings into Wanikani (revamped)
// @author       Buschwichtel (original by Mempo)
// @match        https://www.wanikani.com/review/session
// @match        https://www.wanikani.com/lesson/session
// @match        https://www.wanikani.com/extra_study/session*
// @match        https://preview.wanikani.com/review/session
// @match        https://preview.wanikani.com/lesson/session
// @match        https://preview.wanikani.com/extra_study/session*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421163/Wanikani%20Multiple%20Answer%20Input%20%28revamped%29.user.js
// @updateURL https://update.greasyfork.org/scripts/421163/Wanikani%20Multiple%20Answer%20Input%20%28revamped%29.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

const CONSOLE_PREFIX = "/// WKMAIR: ";
const SCRIPT_ID = "multiple_answer_input_rev";
const SCRIPT_NAME = "Multiple Answer Input (rev)";


(function() {
    'use strict';

    console.debug(CONSOLE_PREFIX + "INIT");

    setup();

    $('input#user-response').on('keydown',function(event){

        if (event.keyCode === 13){
            var isLesson = /^http.*:\/\/www\.wanikani\.com\/lesson/.test(location.href);
            var currentItem = $.jStorage.get(isLesson ? "l/currentQuizItem" : "currentItem");
            var questionType = $.jStorage.get(isLesson ? "l/questionType" : "questionType");

            if(!questionType){
                console.error(CONSOLE_PREFIX + "Invalid question, can't process.");
                return;
            }
            if(!currentItem){
                console.error(CONSOLE_PREFIX + "Invalid quiz item, can't process.");
                return;
            }

            // stops the event from bubbling up to the original wanikani script
            event.preventDefault();
            event.stopPropagation();

            var input = $('input#user-response')[0].value;
            var inputElements = input ? input.split(/[;]|[ ]{2,}/) : null;
            var wrongAnswers = [];
            var correctAnswers = [];

            if(inputElements){
                inputElements.forEach((element) => {
                    if(element !== "") {
                        var cleanedElement = cleanInput(element);

                        // this is wanikani's own result evaluation, so it should be identical to entering each input one at a time
                        var answer = answerChecker.evaluate(questionType, cleanedElement, currentItem);

                        console.debug(CONSOLE_PREFIX + "answerChecker evaluated: " + answer.passed + " for answer: " + cleanedElement);

                        if(answer.passed||answer.accurate){
                            correctAnswers.push(cleanedElement);
                        }
                        else {
                            wrongAnswers.push(cleanedElement);
                        }
                    }
                });

                var wrongAnswersString = "";
                var correctAnswersString = "";

                var anyWrongAnswers = wrongAnswers.length > 0;
                var anyCorrectAnswers = correctAnswers.length > 0;

                if(anyWrongAnswers) {
                    wrongAnswersString = wrongAnswers.join("; ");
                }
                if(anyCorrectAnswers) {
                    correctAnswersString = correctAnswers.join("; ");
                }

                console.info(CONSOLE_PREFIX + "Right answers given: " + (0 === correctAnswersString.length ? "none" : correctAnswersString) +
                             ", Wrong answers given: " + (0 === wrongAnswersString.length ? "none" : wrongAnswersString));

                if(wkof.settings.multiple_answer_input_rev.force_all_correct) {
                    if(anyWrongAnswers) {
                        // It doesn't matter how we send the answers, since they're wrong anyway.
                        // Note that any correct answers in the original input aren't part of the result here.
                        sendAnswer(wrongAnswersString);
                    }
                    else if(anyCorrectAnswers) {
                        // Since there were no wrong answer and at least one correct answer, all answers are correct.
                        // WaniKani only expects a single response, so we send only the first correct answer to wanikani, so it accepts it,
                        // then replace the result string with all of the answers again (since they are all correct)
                        sendAnswer(correctAnswers[0]);
                        $('input#user-response')[0].value = input;
                    }
                }
                else {
                    // If everything is wrong...
                    if(!anyCorrectAnswers) {
                        sendAnswer(wrongAnswersString);
                    }
                    // ...or everything is correct, we can just pass it off to the default
                    else if(!anyWrongAnswers && anyCorrectAnswers) {
                        sendAnswer(correctAnswers[0]);
                        $('input#user-response')[0].value = input;
                    }
                    else {
                        // put the input back into what the user actually entered
                        $('input#user-response')[0].value = input;

                        var msg = 'Not all of your answers were correct! Wrong: "' + wrongAnswersString + '"';

                        // show a message describing which answers were wrong & do the shaky thingy
                        if(!$("#answer-form form").is(":animated") && $('#user-response').val() !== '') {
                            $("#answer-form form").effect("shake", {}, 300, function() {
                                $("#additional-content").append($('<div id="answer-exception"><span>'+msg+'</span></div>').addClass("animated fadeInUp"));
                            });
                            $("#answer-form form").find("input").focus();
                        }
                    }
                }
            }
            else
            {
                // if we can't split it, just hand it off to the default script.
                // input is probably empty in this case, anyway.
                sendAnswer(input);
                console.log(CONSOLE_PREFIX + "No readable answers given.");
            }
        }
    });
})();

function setup() {
    if (!window.wkof) {
        alert(SCRIPT_NAME + ' requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }

    wkof.include('Menu,Settings');
    wkof.ready('Menu,Settings').then(loadSettings);

    function loadSettings() {

        wkof.Menu.insert_script_link({name:SCRIPT_ID,submenu:'Settings',title:SCRIPT_NAME,on_click:openSettingsMenu});

        var defaults = {
            force_all_correct: true
        };
        wkof.Settings.load(SCRIPT_ID, defaults);
    }
}

function openSettingsMenu() {
    var dialog = new wkof.Settings({
        script_id: SCRIPT_ID,
        title: SCRIPT_NAME,
        content: {
            tabSettings: {type:'page', label:'Settings', content: {
                force_all_correct: {type:'checkbox', label:'Force all correct', default: true, hover_tip: 'When enabled, will fail you if a single answer given is incorrect.'}
            }}
        }
    });
    dialog.open();
}

function sendAnswer(answer) {
    $('input#user-response')[0].value = answer;
    $("#answer-form form button").click();
}

// Carbon copy of the first few lines of answerChecker.evaluate, sadly doesn't exist standalone :(
function cleanInput(input, questionType) {
    var normalizedResponse = normalizeResponse(input);
    if (questionType === "reading") {
        // normalizeReadingResponse DOES get exported, for some reason.
        normalizedResponse = answerChecker.normalizeReadingResponse(normalizedResponse);
    }
    return normalizedResponse;
}

// Carbon copy of answerChecker.normalizeResponse, but that doesn't get exported :(
function normalizeResponse(response) {
    return response
        .trim()
        .toLowerCase()
        .replace(/-/g, " ") // replace hyphen with space
        .replace(/\.|,|'|’|\/|:/g, ""); // replace periods, comma, colons, and apostrophe with blanks
}