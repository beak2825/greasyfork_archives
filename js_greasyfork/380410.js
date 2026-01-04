
// ==UserScript==
// @name         Khan Answers
// @namespace    http://dothething.net/
// @version      20160317
// @description  Get all the answers to Khan Academy worksets
// @author       You
// @match        https://www.khanacademy.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380410/Khan%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/380410/Khan%20Answers.meta.js
// ==/UserScript==

var firstCall = true;
var questionData = null;
var questionAnswers = [];
var processedAnswers = 0;

(function(open) {
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        if(url.indexOf("/api/internal/user/exercises/") > -1 && firstCall) {
            firstCall = false;
            $.get(url, function(data) {
                questionData = JSON.parse(data.itemData);
                console.log(questionData);
                questionAnswers.push(questionData);
            });
        }
        open.call(this, method, url, async, user, pass);
        firstCall = true;
    };
})(XMLHttpRequest.prototype.open);

setTimeout(runAnswers, 5000);
setTimeout(appendAnswerButton, 5000);

function appendAnswerButton() {
    $('#next-question-button').click(function() {
        runAnswers();
    });
}

function runAnswers() {
    $('#hintsarea').append("<button id=\"noAnswersButton\">Answers not showing? Click here</button>");
    questionData = questionAnswers[processedAnswers];
    $(document).ready(function() {
        $("#noAnswersButton").on("click", function(event) {
            event.preventDefault();
            runDialog();
        });
    });
    processedAnswers += 1;
    $('#hintsarea').append("<p><b>ANSWERS</b></p>");
    // Simple text input answers
    var i = 0;
    try {
        console.log(parseInt(ObjectLength(questionData.question.widgets)));
        var correctAnswers = "";
        for(i = 0; i < parseInt(ObjectLength(questionData.question.widgets)); i++) {
            //console.log(questionData.question.widgets['input-number ' + (i + 1)].options.value);
            var answer = (questionData.question.widgets['input-number ' + (i + 1)].options.value).toString();
            appendAnswer(i, "Input", answer);
        }
    } catch(err) {}
    // Matcher problems
    try {
        for(i = 0; i < parseInt(ObjectLength(questionData.question.widgets)); i++) {
            //console.log(questionData.question.widgets['matcher ' + (i + 1)].options.right); // An array of values
            var answers = questionData.question.widgets['matcher ' + (i + 1)].options.right;
            var correctAnswers = "";
            answers.forEach(function(answers, index, array) {
                correctAnswers += answers + "<br>";
            });
            appendAnswer(i, "Matcher", correctAnswers);
        }
    } catch(err) {}
    // Sorter problems
    try {
        for(i = 0; i < parseInt(ObjectLength(questionData.question.widgets)); i++) {
            //console.log(questionData.question.widgets['matcher ' + (i + 1)].options.right); // An array of values
            var answers = questionData.question.widgets['sorter ' + (i + 1)].options.correct;
            var correctAnswers = "<br>";
            answers.forEach(function(answers, index, array) {
                correctAnswers += answers + "<br>";
            });
            appendAnswer(i, "Sorter", correctAnswers);
        }
    } catch(err) {}
    // Expression answers (type 1)
    try {
        for(i = 0; i < parseInt(ObjectLength(questionData.question.widgets)); i++) {
            //console.log(questionData.question.widgets['expression ' + (i + 1)].options.answerForms);
            var expressionAnswers = questionData.question.widgets['expression ' + (i + 1)].options.answerForms;
            expressionAnswers.forEach(function(answerArray, index, array) {
                appendAnswer(i, "Expression", answerArray.value);
            });

        }
    } catch(err) {}
    // Expression answers (type 2)
    try {
        for(i = 0; i < parseInt(ObjectLength(questionData.question.widgets)); i++) {
            //console.log(questionData.question.widgets['expression ' + (i + 1)].options.value);
            var expressionAnswers2 = questionData.question.widgets['expression ' + (i + 1)].options;
            appendAnswer(i, "Expression", expressionAnswers2.value);
        }
    } catch(err) {}
    // Button dropdown answers
    try {
        for(i = 0; i < parseInt(ObjectLength(questionData.question.widgets)); i++) {
            var answersForDropdown = questionData.question.widgets['dropdown ' + (i + 1)].options.choices;
            var correctAnswers = "";
            answersForDropdown.forEach(function(answer, index, array) {
                if(answer.correct == true) {
                    correctAnswers = correctAnswers + answer.content + ', ';
                }
            });
            //console.log("Dropdown " + (i + 1) + ": " + correctAnswers);
            appendAnswer(i, "Dropdown", correctAnswers);
        }
    } catch(err) {}
    // Radio or Checkbox answers
    try {
        for(i = 0; i < parseInt(ObjectLength(questionData.question.widgets)); i++) {
            var answersForDropdown = questionData.question.widgets['radio ' + (i + 1)].options.choices;
            var correctAnswers = "";
            answersForDropdown.forEach(function(answer, index, array) {
                if(answer.correct == true) {
                    correctAnswers = correctAnswers + answer.content + ', ';
                }
            });
            //console.log("Radio " + (i + 1) + ": " + correctAnswers);
            appendAnswer(i, "Radio/Checkbox", correctAnswers);
        }
    } catch(err) {}
}

function appendAnswer(count, answerType, answer) {
    var uri_pattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
    if(answer.match(new RegExp(uri_pattern)) != null) {
        answer.match(new RegExp(uri_pattern)).forEach(function(url, index, array) {
            $('#hintsarea').append("<p>" + answerType + " " + (count + 1) + ": <img src='" + url + "'></p><br>");
        });
    } else {
        $('#hintsarea').append("<p>" + answerType + " " + (count + 1) + ": " + answer + "</p><br>");
    }
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function ObjectLength( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
};

function runDialog() {
    $('#hintsarea').append('<div id="dialog" title="Answer Data"><pre>' + JSON.stringify(questionData.question.widgets, null, 2) + '</pre></div>');
    $('#dialog').dialog();
}
