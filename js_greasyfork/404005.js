// ==UserScript==
// @name         Q to Accept Quiz
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a keyboard shortcut to start quizzes!
// @author       Me
// @match        https://bunpro.jp/learn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404005/Q%20to%20Accept%20Quiz.user.js
// @updateURL https://update.greasyfork.org/scripts/404005/Q%20to%20Accept%20Quiz.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keyup', function (e) {
        if (e.code !== 'KeyQ') return;
        let btn = document.querySelector('#start-quiz');
        if (!btn) return;
        btn.click();
    });
})();