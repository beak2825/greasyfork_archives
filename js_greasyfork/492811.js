// ==UserScript==
// @name        Evalea Feedback Copy
// @namespace   Violentmonkey Scripts
// @match       https://evalea.de/tool/interviews/answer/*
// @grant       none
// @version     1.0.3
// @author      Der_Floh
// @description Ermöglicht Speichern und Laden für Feedbackgespräche
// @license     MIT
// @icon				https://i.vimeocdn.com/portrait/42410065_200x200
// @homepageURL	https://greasyfork.org/de/scripts/492811-evalea-feedback-copy
// @supportURL	https://greasyfork.org/de/scripts/492811-evalea-feedback-copy/feedback
// @downloadURL https://update.greasyfork.org/scripts/492811/Evalea%20Feedback%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/492811/Evalea%20Feedback%20Copy.meta.js
// ==/UserScript==

class SingleAnswer {
    constructor(spanElem) {
        this.value = spanElem.querySelector('input').value;

        const questionElem = spanElem.parentNode.parentNode;
        this.questionText = questionElem.querySelector('span').textContent;

        const sectionElem = questionElem.parentNode.parentNode.parentNode.parentNode;
        this.sectionText = sectionElem.getAttribute("data-cy");
    }
}

window.addEventListener("load", async () => {
    const container = document.getElementById("wrap");

    const saveButton = document.createElement("button");
    saveButton.id = "feedbacksavebutton";
    saveButton.textContent = "Save Feedback";
    saveButton.style.padding = "6px";
    saveButton.style.margin = "4px";
    saveButton.onclick = () => {
        saveButton.textContent = "Saving...";
        saveAnswersFromCurrentFeedback();
        saveButton.textContent = "Saved";
        setTimeout(() => {
            saveButton.textContent = "Save Feedback";
        }, 2000);
    };
    container.appendChild(saveButton);

    const loadButton = document.createElement("button");
    loadButton.id = "feedbackloadbutton";
    loadButton.textContent = "Load Feedback";
    loadButton.style.padding = "6px";
    loadButton.style.margin = "4px";
    loadButton.onclick = () => {
        loadButton.textContent = "Loading...";
        loadAnswersFromLastFeedback();
        loadButton.textContent = "Loaded";
        setTimeout(() => {
            loadButton.textContent = "Load Feedback";
        }, 2000);
    };
    container.appendChild(loadButton);
});

function saveAnswersFromCurrentFeedback() {
    const answers = getAnswersFromCurrentFeedback();
    saveAnswers(answers);
}

function getAnswersFromCurrentFeedback() {
    const spans = document.body.querySelectorAll('span[class="activeB"]');
    const answers = [];
    for (const spanElem of spans) {
        const inputElem = spanElem.querySelector("input");
        if (inputElem && inputElem.value) {
            const answer = new SingleAnswer(spanElem);
            answers.push(answer);
        }
    }
    return answers;
}

function saveAnswers(answers) {
    const serializedData = JSON.stringify(answers);
    localStorage.setItem("lastfeedbackanswers", serializedData);
}

function getAnswersFromLastFeedback() {
    const serializedData = localStorage.getItem("lastfeedbackanswers");
    if (serializedData)
        return JSON.parse(serializedData);
}

function loadAnswersFromLastFeedback() {
    const answers = getAnswersFromLastFeedback();
    loadAnswers(answers);
}

function loadAnswers(answers) {
    const inputs = document.body.querySelectorAll('input[class="scale-circle"]');
    for (const inputElem of inputs) {
        const questionElem = inputElem.parentNode.parentNode.parentNode;
        const questionText = questionElem.querySelector('span').textContent;

        const sectionElem = questionElem.parentNode.parentNode.parentNode.parentNode;
        const sectionText = sectionElem.getAttribute("data-cy");

        const answer = answers.find(elem => elem.sectionText == sectionText && elem.questionText == questionText);
        if (answer && answer.value == inputElem.value)
            inputElem.click();
    }
}
