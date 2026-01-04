// ==UserScript==
// @name           Google Forms to Text
// @description    Save "Google Forms" forms to a plaintext and copy to clipboard
// @namespace      https://github.com/limtis0/
// @author         https://github.com/limtis0/
// @license        MIT
// @version        1.1
// @match          http*://docs.google.com/forms/*
// @downloadURL https://update.greasyfork.org/scripts/464708/Google%20Forms%20to%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/464708/Google%20Forms%20to%20Text.meta.js
// ==/UserScript==

// Radiogroups
const radiogroupSelector = '[role="radiogroup"]';
const radiogroupOptionsSelector = '[role="radiogroup"] > span  span';

// Lists
const listSelector = '[role="list"]:not(:has([role="heading"]))';
const listOptionsSelector = '[role="list"]:not(:has([role="heading"])) span';

// Dropdowns
const dropdownSelector = '[role="listbox"]';
const dropdownOptionsSelector = '[role="listbox"] [role="option"]:not(:nth-of-type(1)) span';

// Text input
const textInputSelector = 'input[type="text"]';

// General
const mainListSelector = '[role="list"]'
const questionsSelector = '[role="list"]:not(:first-of-type) > [role="listitem"]';
const headerSelector = '[role="heading"]:first-child span';

const elementTypes = [
    {
        'elementSelector': radiogroupSelector,
        'additionalText': '[Choose one]',
        'parseOptions': true,
        'optionsSelector': radiogroupOptionsSelector,
    },
    {
        'elementSelector': listSelector,
        'additionalText': '[Choose many]',
        'parseOptions': true,
        'optionsSelector': listOptionsSelector,
    },
    {
        'elementSelector': dropdownSelector,
        'additionalText': '[Choose one]',
        'parseOptions': true,
        'optionsSelector': dropdownOptionsSelector,
    },
    {
        'elementSelector': textInputSelector,
        'additionalText': '[Text answer]',
        'parseOptions': false,
    }
];

function isElement(q, elementSelector) {
    return q.querySelector(elementSelector) !== null;
}

function parseQuestion(q, optionsSelector) {
    const options = q.querySelectorAll(optionsSelector);
    let result = '';

    options.forEach(o => {
        result += o.innerHTML + '\n';
    });

    return result;
}

function getQuestions() {
    let questions = document.querySelectorAll(questionsSelector);
    let parsed = '';

    questions.forEach(q => {
        elementTypes.every(t => {
            // For each type of elements, add additional text, and, if needed, options
            if (isElement(q, t.elementSelector)) {
                parsed += `${q.querySelector(headerSelector).innerHTML} ${t.additionalText}\n`;

                if (t.parseOptions) {
                    parsed += parseQuestion(q, t.optionsSelector);
                }
                parsed += '\n';

                return false;
            }

            return true;
        });
    });

    return parsed.trim();
}

function createButton() {
    // Create a new button element
    const button = document.createElement('button');
    button.textContent = 'Copy questions';

    // Set button styles
    button.style.position = 'fixed';
    button.style.bottom = '1rem';
    button.style.right = '1rem';
    button.style.backgroundColor = '#4285f4';
    button.style.color = '#fff';
    button.style.fontFamily = 'Roboto, Arial, sans-serif';
    button.style.fontSize = '14px';
    button.style.padding = '8px 16px';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.25)';
    button.style.cursor = 'pointer';

    // Append button to the body element
    document.body.appendChild(button);

    // Add a callback function to the button
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(getQuestions());
    });
}

(function() {
    'use strict';

    if (isElement(document.body, mainListSelector)) {
        createButton();
    }
})();
