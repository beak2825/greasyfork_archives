// ==UserScript==
// @name         Renshuu question type color
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Provides color-coded icons for renshuu questions based on their types
// @author       Guy
// @match        https://www.renshuu.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450293/Renshuu%20question%20type%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/450293/Renshuu%20question%20type%20color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initializeScript() {
        const TYPE_TO_COLOR = {
            'Hiragana/Katakana:': 'introbox2_on',
            'Kanji term:': 'dorange',
            'Kanji compound:': 'dorange',
            'Kanji with the above reading(s)': 'dorange',
            'Definition': 'introbox4_on',
            'Definition:': 'introbox4_on',
            'Definition for the green word:': 'introbox4_on',
            'Please type in the onyomi reading(s) for the kanji.': 'introbox7_on',
            'Please type in the kunyomi reading(s) for the kanji.': 'introbox6_on',
        }
        function applyQuestionTypeColor(){
            const questionType = $("#question_type");
            if(questionType) {
                if(questionType.children(".question_type_icon").length) {
                    return;
                }
                const color = TYPE_TO_COLOR[questionType.text()];
                if (!color) {
                    console.error(`question type '${questionType.text()}' has no assosiated color!`);
                    return;
                }
                $('<span class="question_type_icon"/>').css('height', '1em').css('width', '1em').css('border-radius', '50%').css('background-color', `var(--${color})`).css('margin-right', '0.25em').prependTo(questionType);
                questionType.css('display', 'flex').css('align-items', 'center');
            }
        }
        $('#content').on('next_card', applyQuestionTypeColor);
    }

    function reloadOnUrlChange() {
        // Renshuu removes all of the 'next_card' handlers when the page loads, so I need to reapply it.
        var oldHref = document.location.href;

        var bodyList = document.querySelector("body")

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    // I take a 500ms timeout to make sure initializeScript is called after the 'next_card' handlers were removed - I'll research a better way to do this later on.
                    setTimeout(initializeScript, 500);
                }
            });
        });

        var config = {
            childList: true,
            subtree: true
        };

        observer.observe(bodyList, config);
    }
    reloadOnUrlChange();
    initializeScript();

})();