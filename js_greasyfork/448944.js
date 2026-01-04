// ==UserScript==
// @license      MIT
// @name         JEE Mains Answers capture 
// @match        https://test.cbexams.com/*
// @description  This script detects parses your entered answers into a computer readable format
// @version 0.0.1.20220804185301
// @namespace https://greasyfork.org/users/941655
// @downloadURL https://update.greasyfork.org/scripts/448944/JEE%20Mains%20Answers%20capture.user.js
// @updateURL https://update.greasyfork.org/scripts/448944/JEE%20Mains%20Answers%20capture.meta.js
// ==/UserScript==


const returnData = [] // stores all the answers

const cb = document.createElement('input')
cb.id = 'cb'
cb.type = 'text'
cb.style.display = 'hidden'
document.body.appendChild(cb)

const copyToClip = () => {
    var cb = document.getElementById("cb");
    cb.value = JSON.stringify(returnData);
    cb.style.display = 'block';
    cb.select();
    document.execCommand('copy');
    cb.style.display = 'none';
    alert('Copied content to clipboard')
}

/**
   * @param {string} content the content
*/
function getSectionsData(content) {
    const subjectRegex = /(?<=Name:).+(?=-)/;
    const idRegex = /(?<=Question\sID:)\d{6}/;
    const sectionRegex = /(?<=Section\s)./;

    const id = content.match(idRegex).pop()
    const subject = content.match(subjectRegex).pop();
    const section = content.match(sectionRegex).pop();

    return { id, subject, section };
}

/**
   * @param {Element} answerData the content
   * @param {string} section
*/
function getGivenAnswer(answerData, section) {
    switch (section) {
        case 'A':
            return answerData.querySelector('font').textContent;
        case 'B':
            return answerData.querySelector('font').textContent;
    }
}

const main = () => {
    const questions = document.querySelectorAll('table[cellspacing="3"]');

    const copyButton = document.createElement("button");
    copyButton.innerText = 'Copy data to clipboard...'
    copyButton.onclick = copyToClip;

    document.body.prepend(copyButton);

    for (const question of questions) {
        let appendData = { id: null, subject: null, section: null, givenAnswer: null }
        const questionData = question.querySelector('tbody > tr:first-child');
        const content = questionData.textContent
        appendData = { ...appendData, ...getSectionsData(content) };

        const answerData = question.querySelector('tbody > tr:last-child');
        // console.log(answerData)
        appendData.givenAnswer = getGivenAnswer(answerData, appendData.section);
        returnData.push(appendData);
        // break;
    }

    return returnData
}

console.log(main())