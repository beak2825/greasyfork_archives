// ==UserScript==
// @name         Modijiurl Auto Skip
// @include      *
// @namespace    http://tampermonkey.net/
// @version      v1.3.0
// @description  Auto Skip and get link without doing anything
// @author       conan76
// @icon         https://modijiurl.com/img/logog.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507249/Modijiurl%20Auto%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/507249/Modijiurl%20Auto%20Skip.meta.js
// ==/UserScript==


(function() {
    'use strict';
    console.log("Script developed by Conan76");

    function getCurrentStep() {
        const stepElement = document.querySelector('[role="alert"]');

        if (stepElement) {
            const stepSpan = stepElement.querySelector('span.text-danger');
            if (stepSpan) {
                const stepText = stepSpan.textContent;
                const stepNumber = parseInt(stepText.split('/')[0].trim());
                return stepNumber;
            }
        }

        // Check for the last step
        if (document.getElementById('timerz')) {
            return 'last';
        }

        console.log("Step element not found");
        return null;
    }

    function showAndClickButton(button1, button2){
        if (button1) {
            button1.style.display = 'block';
        }
        if (button2) {
            button2.style.display = 'block';
            button2.click();
        }
    }

    function handleStep1() {

        let button1 = document.querySelector('#verifybtn');
        let button2 = document.querySelector('#tp444');

        showAndClickButton(button1, button2);
    }

    function handleStep2() {
        let button1 = document.querySelector('#verifybtn');
        let button2 = document.querySelector('#rtg-snp2');

        showAndClickButton(button1, button2);
    }

    function handleStep3() {
        let button1 = document.querySelector('#verifybtn');
        let button2 = document.querySelector('#rtg-snp2');

        showAndClickButton(button1, button2);
    }

    function handleLastStep() {

        let button = document.querySelector("#gtelinkbtn");
        button.click();
    }

    function init() {
        const currentStep = getCurrentStep();
        console.log("Current step:", currentStep);

        switch(currentStep) {
            case 1:
                handleStep1();
                break;
            case 2:
                handleStep2();
                break;
            case 3:
                handleStep3();
                break;
            case 'last':
                 handleLastStep();
                 break;
        }
    }

    init();
    document.addEventListener('DOMContentLoaded', init);
})();