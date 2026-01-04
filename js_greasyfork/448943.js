// ==UserScript==
// @license      MIT
// @name         JEE Mains Marks after capturing the answers 
// @match        https://examinationservices.nic.in/*/KeyChallange/AnswerKey.aspx
// @description  This script calculates the marks after you give the captured answers.
// @version 0.0.1.20220804185237
// @namespace https://greasyfork.org/users/941655
// @downloadURL https://update.greasyfork.org/scripts/448943/JEE%20Mains%20Marks%20after%20capturing%20the%20answers.user.js
// @updateURL https://update.greasyfork.org/scripts/448943/JEE%20Mains%20Marks%20after%20capturing%20the%20answers.meta.js
// ==/UserScript==

function parseAnswerKey() {
    let table = document.querySelector('#ctl00_LoginContent_grAnswerKey.table.table-bordered.table-condensed tbody')
    const content = table = table.querySelectorAll('tr:not(tr:nth-child(1))')
    correct_answers = {}
    for (let row of content) {
        let question_id = row.querySelector('span[id$=QuestionNo]').textContent
        let answer = row.querySelector('span[id$=Answer]').textContent
        correct_answers[question_id] = answer
    }
    return correct_answers;
}

/**
 * @param {{id: string; subject: "Chemistry" | "Physics" | "Maths"; section: "A" | "B"; givenAnswer: string}[]}  givenAnswers Description
 */
function calculateMarks(givenAnswers) {
    const correctAnswers = parseAnswerKey();
    let total = 0;
    for (const givenAnswer of givenAnswers) {
        if (!givenAnswer.givenAnswer.includes("Not Attempted")) {
            if (correctAnswers[givenAnswer.id] === givenAnswer.givenAnswer) total += 4;
            else total--;
        }
    }
    alert(`The total marks are ${total}`)
}

const main = () => {

    const mapForm = document.createElement("form");

    const mapInput = document.createElement("input");
    mapInput.type = "text";
    mapInput.name = "answers";
    mapInput.placeholder = 'Paste captured answers';

    const submitBtn = document.createElement("button");
    submitBtn.type = 'submit'
    submitBtn.innerText = "Get marks"

    mapForm.appendChild(mapInput);
    mapForm.appendChild(submitBtn);
    document.body.prepend(mapForm);

    mapForm.onsubmit = e => {
        e.preventDefault();
        try {
            calculateMarks(JSON.parse(mapInput.value));
        } catch (e) {
            alert(e)
        }
    }
}

main()