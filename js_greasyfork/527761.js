// ==UserScript==
// @name         Решатель Тестов RSV by @AndrewBPC
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-select radio/checkbox inputs and click next button
// @author       You
// @match        https://testing.rsv.ru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527761/%D0%A0%D0%B5%D1%88%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%20%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%20RSV%20by%20%40AndrewBPC.user.js
// @updateURL https://update.greasyfork.org/scripts/527761/%D0%A0%D0%B5%D1%88%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%20%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%20RSV%20by%20%40AndrewBPC.meta.js
// ==/UserScript==

(function() {
    'use strict';
const toObserve = '.SingleQuestion__RadioGroup, .SingleQuestion__Content_Block, .GridQuestion__Row, .RadioGroup__Radio_CustomRow, .DispositionQuestion__RadioGroup';
    function selectInputsAndClickNext() {
        // Find all question groups
        let questionGroups = document.querySelectorAll(toObserve);

        questionGroups.forEach(group => {
            let input = group.querySelector('input[id^="input-"][type="radio"], input[id^="input-"][type="checkbox"]');
            if (input && !input.checked) {
                input.checked = true;
                input.dispatchEvent(new Event('change', { bubbles: true }));
                console.log("Input selected:", input.id);
            }
        });

        // Find and click the "Далее" button
        let nextButton = [...document.querySelectorAll('button')]
            .find(btn => btn.textContent.trim() === 'Далее');

        if (nextButton) {
            nextButton.click();
            console.log("Clicked 'Далее' button");
        }
    }

    function checkPageLoad() {
        let observer = new MutationObserver(() => {
            if (document.querySelector(toObserve)) {
                selectInputsAndClickNext();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', checkPageLoad);
    setTimeout(selectInputsAndClickNext, 1000);
})();
