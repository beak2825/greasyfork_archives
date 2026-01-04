// ==UserScript==
// @name         LinkedIn Assessment Assistant
// @namespace    LinkedIn Assessment Assistant
// @version      2.03
// @description  A light weight script to convert LinkedIn assessment questions into a clickable hyperlink to help you pass.
// @author       JustSomeGuy
// @include      *linkedin.com/in/*
// @include      *linkedin.com/skill-assessments/*
// @include      *linkedin.com/in/*/detail/assessments/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412457/LinkedIn%20Assessment%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/412457/LinkedIn%20Assessment%20Assistant.meta.js
// ==/UserScript==aaaa

// allow mouse events
(function reStyle(){
    var style = `<style>
p.sa-code-block, p.sa-code-block, span.sa-question-basic-multichoice__multiline {
user-select: all;
pointer-events: all;
}
.pv-detail-assessments__body {
overflow: scroll;
}
</style>`;
    document.head.insertAdjacentHTML("beforeend", style);
})();

// loop convertQuestionToHyperLink()
setInterval(function(){ convertQuestionToHyperLink(); }, 500);

function convertQuestionToHyperLink() {
    // get elements
    var questionElement = document.querySelectorAll(".sa-assessment-quiz__title-question")[0];
    var questionTextElement = document.querySelectorAll(".sa-assessment-quiz__multi-line")[0];
    var question = document.querySelectorAll(".sa-assessment-quiz__multi-line span")[0];
    var question2 = document.querySelectorAll(".sa-code-block")[0];
    var title = document.getElementsByClassName("mt1")[0];

    // check if question exists
    if (typeof(question) != 'undefined' && question !== null) {
        // get question
        question = question.innerHTML;

        // if it exists, get second part of question
        if (typeof(question2) != 'undefined' && question2 !== null) {
            question2 = question2.innerHTML;
        } else {
            question2 = "";
        }

        //get name of assessment
        title = title.innerHTML;
        // remove "assessment" from string
        title = title.replace("Assessment", "");
        // remove leading/trailing spaces
        title = title.trim();

        var i;
        // remove formatting - loop in case of multiple occurrences
        for (i = 0; i < 10; i++) {
            question = question.replace('<span class="t-mono">','');
            question = question.replace('</span>','');
        }
        // set url question
        var urlquestion = htmlDecode(removeFluff(question + question2));

        // set search URL
        var url = "https://google.com/search?q="+title+' '+urlquestion.split(' ').join('+');

        // direct changes to the question breaks the process
        // create container for hyperlinked question
        var newquestionElement = document.createElement("span");
        // create hyperlink
        var a = document.createElement("a");
        // attach question to new container
        var newquestionText = document.createTextNode(question);
        // check to see if questionSpan id exists
        var questionSpan = document.getElementById("questionSpan");

        // set href
        a.href = url;
        // set target
        a.target = '_blank';

        // hide existing question container
        questionTextElement.style.display = 'none';

        // attach new container with clickable hyperlink
        newquestionElement.appendChild(a).appendChild(newquestionText);
        // set id of new container
        newquestionElement.id = "questionSpan";

        // remove questionSpan element if it exists
        if (typeof(questionSpan) != 'undefined' && questionSpan !== null) {
            questionSpan.remove();
        }
        // add questionSpan element before answers element
        questionElement.insertBefore(newquestionElement, questionElement.childNodes[0]);
    }
}

function htmlDecode(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes[0].nodeValue;
}

function removeFluff(input) {
    input = input.replace('In which', 'what');
    input = input.replace('Which of the following do you use to', 'solution: How to correctly');
    input = input.replace('Which is an example', 'what is');

    return input;
}