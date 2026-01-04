// ==UserScript==
// @name         Quizizz answers
// @namespace    http://tampermonkey.net/
// @version      2024-02-15
// @description  Indica las respuestas de quizizz
// @author       You
// @match        https://quizizz.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://update.greasyfork.org/scripts/383527/701631/Wait_for_key_elements.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487393/Quizizz%20answers.user.js
// @updateURL https://update.greasyfork.org/scripts/487393/Quizizz%20answers.meta.js
// ==/UserScript==
if (hasAnswers) {
    answersLoop()
}

waitForKeyElements('.room-code', init)

var hasAnswers = false;
var question_t = "";
var new_question_t = "";

function answersLoop() {
    console.log(new_question_t)
    new_question_t = "<p>" + $("#questionText").children().first().children().first().children().first().text() + "</p>"
    if (question_t !== new_question_t) {
        question_t = new_question_t
        markAnswer()
    }
    setTimeout(() => answersLoop(), 500);
}

function markAnswer() {
    var answer_t = sessionStorage.getItem(question_t)
    $('div[id=optionText]').each((index, element) => {
        if (answer_t !== "<p>" + $(element).children().first().children().first().children().text() + "</p>") {
            $(element).css('opacity', '0.5');
        }
    })
}

function init() {
    const roomCode = getRoomCode()
    if (!roomCode) {
        return
    }

    $.ajax({
        url: 'https://api.quizit.online/quizizz/answers?pin=' + roomCode,
        method: 'GET'
    }).then(function(data) {
        data.data.answers.forEach((answer) => {
            var question_text = answer.question.text
            var answer_text = answer.answers[0].text
            sessionStorage.setItem(question_text, answer_text)
        }
        );
    });
    hasAnswers = true
    answersLoop()
}

function getRoomCode() {
  const root = document.querySelector('#root')
  if (!root) {
    alert("Can't get current game data. Make sure you joined the game")
    return
  }

  return document.querySelector('.room-code').textContent
}