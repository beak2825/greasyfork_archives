// ==UserScript==
// @name         Edmentum Show Sample Answers
// @namespace    EdmentumShowSampleAnswers
// @version      0.2.1
// @description  Always shows sample answer buttons when they exist, regardless of whether the question has been submitted
// @author       Origami Toast
// @match        https://*.edmentum.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/447364/Edmentum%20Show%20Sample%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/447364/Edmentum%20Show%20Sample%20Answers.meta.js
// ==/UserScript==

for(let nav of document.getElementsByClassName('SampleAnswerNav')){
    nav.style = {}
    nav.firstElementChild.style.display = 'inline-block'
}

for(let nav of document.getElementsByClassName('buttonCorrectToggle')){
    nav.style.display = 'inline'
    nav.style.visibility = 'visible'
}