// ==UserScript==
// @name         Bunpro: Toggle Furigana of Review Sentence
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Toggle review sentence furigana with ArrowUp Key while answer input field is focused.
// @author       alamin
// @match        *bunpro.jp/*
// @grant        none
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/421177/Bunpro%3A%20Toggle%20Furigana%20of%20Review%20Sentence.user.js
// @updateURL https://update.greasyfork.org/scripts/421177/Bunpro%3A%20Toggle%20Furigana%20of%20Review%20Sentence.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    waitForKeyElements(".study-question-japanese", function (e) {
        $("#study-answer-input").on("keyup", function (event) {
            if (event.key === "ArrowUp") {
                $(e[0]).find("rt").toggleClass("hide-furigana");
            }
        });
    });
})();
