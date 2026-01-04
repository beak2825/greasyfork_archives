// ==UserScript==
// @name         CliffsNotes Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  CliffsNotes Tutor Problems Bypass
// @author       You
// @match        https://www.cliffsnotes.com/tutors-problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cliffsnotes.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450480/CliffsNotes%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/450480/CliffsNotes%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const answer_text = document.getElementsByClassName('answer-text')[0];
    const explanation_text = document.getElementsByClassName('explanation-text')[0];
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
            mutationRecord.target.style.filter = 'none';
        });
    });

    observer.observe(answer_text, {
        attributes: true,
        attributeFilter: ['style']
    });
    observer.observe(explanation_text, {
        attributes: true,
        attributeFilter: ['style']
    });
})();