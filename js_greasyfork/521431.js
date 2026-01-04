// ==UserScript==
// @name         kahootgpt
// @description  This works by you opening a tab of chatgpt.com in the background (works best if those are the only 2 in the window) and whenever you have an all text question, simply click ctrl+tab to switch to it, then wait about 1.25 seconds for the ai to answer, then tab again (assuming you didnt let go of ctrl) to switch back to kahoot (or just click the tab), click anywhere in the window before using again.
// @version      0.2
// @namespace    https://tampermonkey.net
// @author       TTT
// @license      MIT
// @match        kahoot.com/*
// @match        kahoot.it/*
// @match        chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kahoot.it
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/521431/kahootgpt.user.js
// @updateURL https://update.greasyfork.org/scripts/521431/kahootgpt.meta.js
// ==/UserScript==
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        const currentValue = GM_getValue("outputText");
        const chatbox = document.getElementById('prompt-textarea');
        if (chatbox) {
            chatbox.innerHTML += currentValue;

            const event = new Event('input', {
                bubbles: true
            });
            chatbox.dispatchEvent(event);
        }

        setTimeout(() => {
            const submitButton = document.querySelector('[data-testid="send-button"]');
            if (submitButton) {
                submitButton.click();
            }
        }, 10);
    }
});

function simulateKeyPress(value) {
    if (value.includes('A')) {
        simulateKeyPressEvent('1');
    }
    if (value.includes('B')) {
        simulateKeyPressEvent('2');
    }
    if (value.includes('C')) {
        simulateKeyPressEvent('3');
    }
    if (value.includes('D')) {
        simulateKeyPressEvent('4');
    }

    setTimeout(() => {
        clickAnswerChoices(value);
    }, 200);
}

function simulateKeyPressEvent(key) {
    const event = new KeyboardEvent('keydown', {
        key: key,
        code: `Digit${key}`,
        keyCode: key.charCodeAt(0),
        charCode: key.charCodeAt(0),
        bubbles: true,
        cancelable: true
    });

    window.dispatchEvent(event);
    console.log(`Simulated key press: ${key}`);
}

function clickSubmitButton() {
    const button = document.querySelector('[data-functional-selector="multi-select-submit-button"]');
    if (button) {
        button.click();
        console.log('Clicked the submit button.');
    } else {
        console.error('Submit button not found.');
    }
}

function clickAnswerChoices(value) {
    const choices = document.querySelectorAll('.answer-choice');
    let totalChoices = choices.length;

    if (totalChoices === 0) {
        clickSubmitButtonAndReset();
        return;
    }

    let choicesClicked = 0;

    const interval = setInterval(() => {
        choices.forEach(choice => {
            if (choicesClicked < totalChoices) {
                choice.click(); 
                console.log(`Clicked answer choice: ${choice.textContent}`);
                choicesClicked++;
            }
        });

        if (choicesClicked >= totalChoices) {
            clearInterval(interval);
            clickSubmitButtonAndReset();
        }

    }, 100);
}

function clickSubmitButtonAndReset() {
    clickSubmitButton();
    GM_setValue('Option', null);
    console.log('Option value set to null.');
}
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        const currentValue = GM_getValue('Option', '');

        simulateKeyPress(currentValue);

        clickAnswerChoices(currentValue);
    }
});
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey) {
        const instructionText = "There are 4 answer choices, send \"A.\" \"B.\" \"C.\" or \"D.\" to indicate which option is correct \"A.\" for the first, \"B.\" for the second, \"C.\" for the third, and \"D.\" for the fourth, send your option choice with a period afterwards, i.e: 'A. B.' do not send additional text, only the letter option choice which is correct.";

        let additionalText = '';

        const elements = document.getElementsByTagName('*');
        let foundText = false;
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].innerText && elements[i].innerText.includes("Check all that apply")) {
                foundText = true;
                additionalText = "Please check all applicable choices.";
                break;
            }
        }

        if (!foundText) {
            additionalText = "Choose one option letter choice.";
        }

        const blockTitleElement = document.querySelector('[data-functional-selector="block-title"]');
        const blockTitleText = blockTitleElement ? blockTitleElement.innerText : 'Block title not found';

        const answerTexts = [];

        const choicesContainers = document.querySelectorAll('[class*="quiz-choices__Container"]');
        console.log(`Found ${choicesContainers.length} quiz choices container(s)`);

        if (choicesContainers.length > 0) {
            choicesContainers.forEach(container => {
                console.log(`Container found: ${container.className}`);

                const childElements = container.children;

                for (let child of childElements) {
                    answerTexts.push(child.innerText);
                }
            });
        } else {
            answerTexts.push('Quiz choices container not found');
        }

        const output = `${instructionText}\n\n${additionalText}\n\n${blockTitleText}\n\n${answerTexts.join('\n\n')}`;

        GM_setValue('outputText', output);

        console.log('Text has been saved using GM_setValue');
    }
});

function copyLettersWithPeriod() {
    const containers = document.querySelectorAll('[data-message-author-role="assistant"]');

    const lastContainer = containers[containers.length - 1];

    let text = lastContainer.innerText;
    let result = [];

    const regex = /([A-Za-z])\./g;

    let match;
    while ((match = regex.exec(text)) !== null) {
        result.push(match[1]);
    }

    const copiedLetters = result.join('');

    GM_setValue('Option', copiedLetters);
}

setInterval(copyLettersWithPeriod, 10);