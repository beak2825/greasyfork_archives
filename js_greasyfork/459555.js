// ==UserScript==
// @name         Remove related answers from Quora questions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes "Related" answers on Quora questions. Only works in English.
// @author       Lucas Bustamante
// @license      MIT
// @match        https://www.quora.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quora.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459555/Remove%20related%20answers%20from%20Quora%20questions.user.js
// @updateURL https://update.greasyfork.org/scripts/459555/Remove%20related%20answers%20from%20Quora%20questions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function remove_all_related_answers() {
        document.querySelectorAll('.puppeteer_test_question_title').forEach((el) => {
            if (el.innerText.startsWith('Related')) {
                Array.from(el.getElementsByTagName("*")).forEach((re) => {
                    while (re.parentNode) {
                        re = re.parentNode;
                        if (re.className.match(/^.+\sdom_annotate_question_answer_item_\d+\s.+$/)) {
                            console.log('Matched question box');
                            re.remove();
                        }
                    }
                });
            }
        });
    }

    // Remove on page load.
    remove_all_related_answers();

    // Remove on DOM change.
    var observer = new window.MutationObserver(function(mutations, observer) {
        remove_all_related_answers();
    });

    observer.observe(document, {
        subtree: true,
        attributes: true
    });
})();