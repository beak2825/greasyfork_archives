// ==UserScript==
// @name         EnterToNextStep
// @version      2024-03-19b
// @description  Push 'Enter' to move next Level or AI Quiz.
// @author       sinam7
// @match        https://youngdok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youngdok.com
// @grant        none
// @namespace https://greasyfork.org/users/1276118
// @downloadURL https://update.greasyfork.org/scripts/490179/EnterToNextStep.user.js
// @updateURL https://update.greasyfork.org/scripts/490179/EnterToNextStep.meta.js
// ==/UserScript==
(function() {
    'use strict';


    // Function to handle keydown event and button click event
    function handleEvent1(event) {
        if (event.key === 'Enter') {
            var button1 = document.querySelector('.button.btn-medium.btn-solid-white');
            if (button1) {
                button1.click();
            }
        }
    }

    function handleEvent2(event) {
        if (event.key === 'Enter') {
            var button2 = document.querySelector('.btn-medium.btn-line-white');
            if (button2) {
                button2.click();
            }
        }
    }
    // Function to handle keydown event
    function handleKeyPress(event) {
        switch (event.key) {
            case 'q':
                clickElementByText('4');
                break;
            case 'w':
                clickElementByText('5');
                break;
            case 'e':
                clickElementByText('6');
                break;
            default:
                break;
        }
    }

    // Function to click an element by its inner text
    function clickElementByText(text) {
        const answerItems = document.querySelectorAll('.answer-item');
        answerItems.forEach(function(item) {
            const choiceNumber = item.querySelector('.choice-number');
            if (choiceNumber && choiceNumber.innerText.trim() === text) {
                item.click(); // Click the element
                console.log(`Clicked element with inner text: ${text}`);
            }
        });
    }

    function searchForAnswerList() {
        var answerList = document.querySelector('.answer-list.inline-type');
        if (!answerList) {
            document.removeEventListener('keydown', handleKeyPress);
            return;
        }
        document.addEventListener('keydown', handleKeyPress);
    }



    // Function to periodically search for button1 every 1 second
    function searchForButton1() {
        var button1 = document.querySelector('.button.btn-medium.btn-solid-white');
        if (!button1) {
            document.removeEventListener('keydown', handleEvent1);
            return;
        }
        document.addEventListener('keydown', handleEvent1);
    }

    // Function to periodically search for button2 every 1 second
    function searchForButton2() {
        var button2 = document.querySelector('.btn-medium.btn-line-white');
        if (!button2) {
            document.removeEventListener('keydown', handleEvent2);
            return;
        }
        document.addEventListener('keydown', handleEvent2);
    }


    // Add event listener to document for keydown event



    // Periodically search for buttons every 1 second
    var button1SearchInterval = setInterval(searchForButton1, 1000);
    var button2SearchInterval = setInterval(searchForButton2, 1000);
    // if you need QWE to 456 mapping, uncomment code below.
    // var answerListSearchInterval = setInterval(searchForAnswerList, 1000);

})();