// ==UserScript==
// @name         MatematikFessorBot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Vælg "Gangemetode 1 (12 gange 34)" i "test dig selv"
// @author       YaYPIXXO
// @match        https://www.matematikfessor.dk/test/*
// @grant        none
// @require      https://unpkg.com/mathjs@4.1.1/dist/math.min.js
// @downloadURL https://update.greasyfork.org/scripts/376867/MatematikFessorBot.user.js
// @updateURL https://update.greasyfork.org/scripts/376867/MatematikFessorBot.meta.js
// ==/UserScript==

var testInfo;

function init() {
    'use strict';
    var loadCheck,
        pathName = window.location.pathname;

    if (pathName.match(/^\/test\/fivesharp\/$/)) {
        // check nextButton clickable every 100 ms
        loadCheck = setInterval(function () {
            if (document.getElementsByClassName("nextButton")[0] && !document.getElementsByClassName("nextButton disabled")[0]) {
                testLoaded();
                clearInterval(loadCheck);
            }
        }, 100);

    } else if (pathName.match(/^\/test\/result\/\d+$/)) {
        // check recreateTestBtn clickable every 100 ms
        loadCheck = setInterval(function () {
            if (document.getElementById("recreateTestBtn") && document.getElementsByClassName("evaluateAnswer")[0]) {
                resultLoaded();
                clearInterval(loadCheck);
            }
        }, 100);
    }

}

function testLoaded() {
    'use strict';
    var testType = document.getElementsByClassName("no-link")[0].innerHTML;

    testInfo = JSON.parse(loadJsPage.toString(10).match(/{"questions":\[{"Question":[\s\S]*?}}\);/)[0].replace(/\);/, ""));

    switch (testType) {
        case "Gang med 0":
            saveAnswers([0, 0, 0, 0, 0]);
            break;
        case "Gang med 0 (flere faktorer)":
            saveAnswers([0, 0, 0, getMultAnswers(3, 0), getMultAnswers(4, 0)]);
            break;
        case "4281 + 346 (4-cifret plus 3-cifret)":
            saveAnswers([getMathAnswer(0), getMathAnswer(1), getMathAnswer(2), getMathAnswer(3), getMathAnswer(4)]);
            break;
        case "5 + 23 (1-cifret plus 2-cifret uden mente)":
            saveAnswers([getMultAnswers(0, getMathAnswer(0)), getMultAnswers(1, getMathAnswer(1)), getMathAnswer(2), getMathAnswer(3), getMathAnswer(4)]);
            break;
        case "1-cifret gange 1-cifret":
            saveAnswers([getMathAnswer(0), getMathAnswer(1), getMathAnswer(2), getMathAnswer(3), getMathAnswer(4)]);
            break;
        case "31 + 56 (2-cifret plus 2-cifret uden mente)":
            saveAnswers([getMultAnswers(0, getMathAnswer(0)), getMultAnswers(1, getMathAnswer(1)), getMathAnswer(2), getMathAnswer(3), getMathAnswer(4)]);
            break;
        case "37 + 28 (2-cifret plus 2-cifret med mente)":
            saveAnswers([getMultAnswers(0, getMathAnswer(0)), getMultAnswers(1, getMathAnswer(1)), getMathAnswer(2), getMathAnswer(3), getMathAnswer(4)]);
            break;
        case "10 + 39 + 51 + 24 (Sum med fire 2-cifrede tal)":
            saveAnswers([getMathAnswer(0), getMathAnswer(1), getMathAnswer(2), getMathAnswer(3), getMathAnswer(4)]);
            break;
        case "Gangemetode 1 (12 gange 34)":
            saveAnswers([getMathAnswer(0), getMathAnswer(1), getMathAnswer(2), getMathAnswer(3), getMathAnswer(4)]);
            break;
        case "7 + 46 (1-cifret plus 2-cifret med mente)":
            saveAnswers([getMultAnswers(0, getMathAnswer(0)), getMultAnswers(1, getMathAnswer(1)), getMathAnswer(2), getMathAnswer(3), getMathAnswer(4)]);
            break;
        case "1034 - 80 (4-cifret minus 2-cifret)":
            saveAnswers([getMultAnswers(0, getMathAnswer(0)), getMathAnswer(1), getMultAnswers(2, getMathAnswer(2)), getMathAnswer(3), getMathAnswer(4)]);
            break;
        case "12 - 5 med prikker":
            saveAnswers([getMultAnswers(0, getMathAnswer(0)), getMultAnswers(1, getMathAnswer(1)), getMultAnswers(2, getMathAnswer(2)), getMultAnswers(3, getMathAnswer(3)), getMultAnswers(4, getMathAnswer(4))])
        break;
        default:
            window.alert(testType + " er ikke understøttet af fessorBot");
            break;
    }
}

// get text for questionNumber and evaluate equation
function getMathAnswer(questionNumber) {
    var question = testInfo.questions[questionNumber].Question;
    var Results = question.question.replace(/[^\d+,⋅-]/g, '');
    Results = Results.replace(/⋅/g, "*");
    Results = math.eval(Results).toString();
    return Results
}

function getMultAnswers(questionNumber, lookFor) {
    var correctAnswer;

    for (var i = 0; i < testInfo.questions[questionNumber].answers.length; i++) {
        var lookAt = testInfo.questions[questionNumber].answers[i].Answer.answer;
        if (lookAt.indexOf(lookFor) > -1) {
            correctAnswer = i;
        }
    }
    return testInfo.questions[questionNumber].answers[correctAnswer].Answer.id;
}

function saveAnswers(answers) {
    'use strict';
    var userInfo = JSON.parse(loadJsPage.toString(10).match(/{"reloadUserData":[\s\S]*?}}\);/)[0].replace(/\);/, "")),
        xhr,
        returned = [];
    for (let i = 0; i < answers.length; i += 1) {
        xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.matematikfessor.dk/test/save_answer', true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        xhr.setRequestHeader("X-User-Id", userInfo.userData.id);
        xhr.setRequestHeader("X-Timestamp-Sent", new Date().getTime());
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.onloadend = function () {
            returned[i] = true;
            if (returned.indexOf(false) === -1) {
                finishTest();
            }
        }
        returned[i] = false;
        xhr.send("data%5Bquestion_id%5D=" + testInfo.questions[i].Question.id + "&data%5Banswer%5D=" + answers[i] + "&data%5Btest_id%5D=" + testInfo.testSettings.Test.id + "&data%5Bmodel%5D=" + testInfo.testSettings.model);
    }
}

function finishTest() {
    'use strict';
    var loadCheck;
    document.getElementsByClassName("big actionButton primary")[0].click();
    loadCheck = setInterval(function () {
        if (document.getElementsByClassName("big actionButton primary")[1]) {
            document.getElementsByClassName("big actionButton primary")[1].click();
            clearInterval(loadCheck);
        }
    }, 100);
}

function resultLoaded() {
    var i,
        isTarget = false,
        loadCheck;

    for (i = 0; i < document.getElementsByClassName("no-link").length; i += 1) {
        if (document.getElementsByClassName("no-link")[i].innerHTML === "Resultat for: Gang med 0" ||
            document.getElementsByClassName("no-link")[i].innerHTML === "Resultat for: Gang med 0 (flere faktorer)" ||
            document.getElementsByClassName("no-link")[i].innerHTML === "Resultat for: 4281 + 346 (4-cifret plus 3-cifret)" ||
            document.getElementsByClassName("no-link")[i].innerHTML === "Resultat for: Gang med 0 (flere faktorer)" ||
            document.getElementsByClassName("no-link")[i].innerHTML === "Resultat for: 5 + 23 (1-cifret plus 2-cifret uden mente)" ||
            document.getElementsByClassName("no-link")[i].innerHTML === "Resultat for: 1-cifret gange 1-cifret" ||
            document.getElementsByClassName("no-link")[i].innerHTML === "Resultat for: 31 + 56 (2-cifret plus 2-cifret uden mente)" ||
            document.getElementsByClassName("no-link")[i].innerHTML === "Resultat for: 37 + 28 (2-cifret plus 2-cifret med mente)" ||
            document.getElementsByClassName("no-link")[i].innerHTML === "Resultat for: 10 + 39 + 51 + 24 (Sum med fire 2-cifrede tal)" ||
            document.getElementsByClassName("no-link")[i].innerHTML === "Resultat for: Gangemetode 1 (12 gange 34)" ||
            document.getElementsByClassName("no-link")[i].innerHTML === "Resultat for: 3,4 + 2,5 (plus med decimaltal)" ||
            document.getElementsByClassName("no-link")[i].innerHTML === "Resultat for: 7 + 46 (1-cifret plus 2-cifret med mente)" ||
            document.getElementsByClassName("no-link")[i].innerHTML === "Resultat for: 1034 - 80 (4-cifret minus 2-cifret)" ||
            document.getElementsByClassName("no-link")[i].innerHTML === "Resultat for: 12 - 5 med prikker") {
            isTarget = true;
        }
    }

    if (isTarget) {
        document.getElementById("recreateTestBtn").click();
        loadCheck = setInterval(function () {
            document.getElementById("recreateTestBtn").click();
            if (document.getElementsByClassName("big actionButton primary")[0]) {
                document.getElementsByClassName("big actionButton primary")[0].click();
                clearInterval(loadCheck);
            }
        }, 100);
    }
}

// initialize
init();
