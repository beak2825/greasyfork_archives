// ==UserScript==
// @name         Course Eval Auto-Completer
// @namespace    courseEvalCompleter
// @version      0.1
// @description  complete course evaluations easily!
// @author       workingProgress8
// @match        https://charlotte.campuslabs.com/eval/index/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=campuslabs.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455558/Course%20Eval%20Auto-Completer.user.js
// @updateURL https://update.greasyfork.org/scripts/455558/Course%20Eval%20Auto-Completer.meta.js
// ==/UserScript==

(function() {
    if (document.querySelector('.flex-item .btn-primary.submit-button') != null)
    {
    const questions = document.querySelectorAll('.form-item');
    questions.forEach(question =>
        {
            let questionType = question.querySelector('.form-item__input input');
            switch(questionType.type)
                {
                    case 'radio':
                        questionType.checked = true;
                        break;
                    case 'hidden':
                        questionType.nextElementSibling.textContent = '';
                        questionType.nextElementSibling.textContent = 'n/a';
                        break;
                    default:
                        break;
            }

        });
        document.querySelector('.flex-item .btn-primary.submit-button').click();
    }
})();