// ==UserScript==
// @name         WaniKani Mobile Improvement
// @namespace    roboro
// @version      0.1.3
// @description  Make WaniKani work better on mobile
// @author       roboro
// @match        https://wanikani.com/review/session
// @match        https://www.wanikani.com/review/session
// @match        https://wanikani.com/lesson/session
// @match        https://www.wanikani.com/lesson/session
// @downloadURL https://update.greasyfork.org/scripts/390364/WaniKani%20Mobile%20Improvement.user.js
// @updateURL https://update.greasyfork.org/scripts/390364/WaniKani%20Mobile%20Improvement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        #stats {
            font-size: 14px;
        }

        #summary-button {
            font-size: 20px;
        }

        header.quiz #main-info #character,
        #question #character {
            font-size: 6em;
            line-height: 1.4;
        }

        header.quiz #main-info.vocabulary #character,
        #question #character.vocabulary {
            font-size: 4em !important;
            line-height: 2em !important;
        }

        #question #question-type h1 {
            font-size: 1em;
            margin: 5px 0;
        }

        #answer-form input[type="text"] {
            font-size: 1.25em;
        }

        #answer-form fieldset {
            padding: 0;
        }

        #answer-form button {
            top: 50%;
            transform: translateY(-50%);
            right: 0;
        }

        #additional-content {
            margin: 5px;
        }

        #reviews footer {
            position: relative;
            display: flex;
            justify-content: flex-end;
        }

        #lessons,
        #reviews {
            padding-bottom: 0;
        }

        #lessons > .pure-u-1,
        #reviews > .pure-u-1 {
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        #lesson {
            flex: 1;
        }

        #lesson #supplement-info,
        #information {
            flex: 1;
            overflow-y: auto;
            margin-top: 0;
        }

        #lesson #supplement-info {
            margin-left: 0;
            margin-right: 0;
        }

        footer#lessons-hotkey-footer {
            display: none;
        }

        body #confusionGuesserOverlay {
            margin: 0;
        }
    `;

    $('head').append(`<style>@media (max-width: 600px) {${css}}</style>`);
})();