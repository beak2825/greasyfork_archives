// ==UserScript==
// @name         VetPrep Copier
// @namespace    http://tampermonkey.net/
// @version      v0.3.0
// @description  Add buttons to copy questions and answer from the vetprep website
// @author       You
// @match        https://www.vetprep.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vetprep.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533866/VetPrep%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/533866/VetPrep%20Copier.meta.js
// ==/UserScript==


function main() {
    'use strict';


    addCopyBtn("Question!", getQuestion)
    addCopyBtn("Answer!", getAnswer)
}

function getQuestion() {
    const questions = document.getElementById('question').querySelectorAll('span')[0].innerHTML.replace(/\<.*?\>/g, '')

    let answersStr = ""
    const answers = document.getElementsByClassName('answer-list')[0].querySelectorAll('li')
    answers.forEach((answer) => {answersStr += `\n * ${answer.innerText.replace(" Correct Answer","").replace(" Your Answer","")}`})

    return questions + answersStr
}



function getAnswer() {
    let correctAnswer = document.getElementsByClassName('correct')[0].innerText.replace(" Correct Answer","")
    let explanation = document.getElementsByClassName('well')[0].getElementsByTagName('p')[0].innerHTML

    return correctAnswer + "\n" + explanation
}

function addCopyBtn(label, getStrFunc) {
    let btn = document.createElement("BUTTON");
    btn.innerHTML = '<a id="myButton" type="button">'+ label

    const computedStyle = document.defaultView.getComputedStyle(document.getElementsByClassName("btn btn-default")[0], "")
    Array.from(computedStyle).forEach(key => btn.style.setProperty(key, computedStyle.getPropertyValue(key), computedStyle.getPropertyPriority(key)))
    btn.style.setProperty("margin-left", "20px")

    btn.onclick = () => {
        navigator.clipboard.writeText(getStrFunc())
    };

    let nextBtn = document.getElementById("btn-next")
    if (nextBtn) {
        nextBtn.parentNode.appendChild(btn)
    }
    else {
        let corinc = document.getElementsByClassName('corinc')[0]
        corinc.appendChild(btn)
    }
}

main()
