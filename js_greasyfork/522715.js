// ==UserScript==
// @name        ExamTopics Less Marketing
// @namespace   https://github.com/pusi77
// @match       https://www.examtopics.com/exams/*/*/view/*
// @grant       none
// @version     1.0.1
// @author      pusi77
// @description I don't care if somone bought a subscription, I just want to see the answers
// @downloadURL https://update.greasyfork.org/scripts/522715/ExamTopics%20Less%20Marketing.user.js
// @updateURL https://update.greasyfork.org/scripts/522715/ExamTopics%20Less%20Marketing.meta.js
// ==/UserScript==

window.addEventListener('load', async function () {
    console.log("Removing subscription notification...")

    let bottomMarketing = document.querySelector('.bottomMarketing');
    if (bottomMarketing) {
        bottomMarketing.remove();
    }
    console.log("Removed subscription notification")

}, false);

