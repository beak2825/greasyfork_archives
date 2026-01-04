// ==UserScript==
// @name         Flux GPT Prompt Generator
// @namespace    https://skye.horse/
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.user.js
// @version      1.0.3
// @description  Automatically constructs easily-copyable prompts to answer Flux poll questions with the help of ChatGPT.
// @author       Brittank88
// @license      CC0
// @match        https://flux.qa/#/feeds/*?tab=polls
// @icon         https://www.google.com/s2/favicons?sz=32&domain=flux.qa
// @icon64       https://www.google.com/s2/favicons?sz=64&domain=flux.qa
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/466967/Flux%20GPT%20Prompt%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/466967/Flux%20GPT%20Prompt%20Generator.meta.js
// ==/UserScript==

const LOG_PREFIX = '[Flux GPT Prompt Generator]';

// eslint-disable-next-line
const CONFIG = new MonkeyConfig({
    title: 'Flux GPT Prompt Generator Configuration',
    menuCommand: true,
    params: {
        "ChatGPT New Page": {
            type: 'checkbox',
            default: false
        }
    }
});

(function() {
    'use strict';

    if (CONFIG.get("ChatGPT New Page")) GM_openInTab('https://chat.openai.com/', true);

    // Check if cards already exist on document load.
    const initialCardElements = document.querySelectorAll('mat-card-content');
    initialCardElements.forEach(appendButton);
    console.log(`%c${LOG_PREFIX} Processed ${initialCardElements.length} questions present on document load!`, 'color:lime');

    // Recursive implementation to append button to each new card added, on-demand.
    const waitForElmCallback = cardElement => {
        appendButton(cardElement);
        console.log(`%c${LOG_PREFIX} Processed new question!`, 'color:lime');
        waitForElm('mat-card-content').then(waitForElmCallback);
    };

    // Trigger recursive mutation observer.
    waitForElm('mat-card-content').then(waitForElmCallback);
})();

/** Appends a button to the given card with the appropriate function as callback. **/
function appendButton(cardElement) {

    // Generate the elements.
    var spacerElement = document.createElement('div');
    spacerElement.className = 'spacer';

    var buttonElement = document.createElement('button');
    buttonElement.style = "display: flex; align-items: center;";
    buttonElement.onclick = () => {
        processCard(cardElement).then(prompt => {
            GM_setClipboard(prompt);
            console.log(`%c${LOG_PREFIX} Generated prompt:`, 'color:lime');
            console.log(`%c${prompt}`, 'color:lime; font-family:courier');
        }, msg => { throw new Error(`${LOG_PREFIX} ${msg}`); });
    }

    var buttonIcon = document.createElement('img');
    buttonIcon.src = "https://www.google.com/s2/favicons?sz=16&domain=chat.openai.com";

    var buttonText = document.createElement('span');
    buttonText.textContent = "Copy Prompt";

    var nbspTextNode = document.createTextNode('\u00A0');

    buttonElement.append(buttonIcon);
    buttonElement.append(nbspTextNode);
    buttonElement.append(buttonText);

    // Retrieve the element we will insert the button before.
    var subtitleElement = cardElement.previousElementSibling;
    var lastElementChild = subtitleElement.lastElementChild;
    subtitleElement.insertBefore(buttonElement, lastElementChild);
    subtitleElement.insertBefore(spacerElement, lastElementChild);
}

// Const map of question types and associated processing functions to call.
const responseTypeProcessingMap = {
    'FLUX-AUDIENCE-MULTIPLE-CHOICE': processMultiChoice,
    'FLUX-AUDIENCE-FREE-ANSWER': processFreeAnswer,
    'FLUX-AUDIENCE-WORD-CLOUD': processWordCloud
};

/** Determines the question type of the card element and generates the appropriate prompt as a result. **/
function processCard(cardElement) {
    return new Promise((resolve, reject) => {
        // First, extract the question text.
        var questionText = cardElement.querySelector('p.question').textContent;

        // Now, process differently depending on if the question is free-answer or multiple choice.
        var responseElement = [].slice.call(cardElement.children).find(c => c.tagName.startsWith('FLUX-AUDIENCE-'));

        if (responseElement === undefined) reject('Unable to extract response element!');

        var tagName = responseElement.tagName;
        let processingFunc;
        if ((processingFunc = responseTypeProcessingMap[tagName])) processingFunc(cardElement, questionText, responseElement).then(resolve, reject)
        else reject(`Unknown response element type '${tagName}'!`);
    });
}

/** Process a question featuring multiple-choice answers. **/
function processMultiChoice(cardElement, questionText, responseElement) {
    return new Promise((resolve, reject) => {

        // Extract the text from each possible response (also accounting for the submit button).
        var responseIdentifierList = [].slice.call(
            responseElement.querySelectorAll('form > button[type]:not([type="submit"]) div.button-content > div.label')
        );
        var responseList = [].slice.call(
            responseElement.querySelectorAll('form > button[type]:not([type="submit"]) div.button-content > span')
        );

        // Return the prompt string, or reject if we couldn't identify responses.
        responseList.length > 0 && responseList.length === responseIdentifierList.length
            ? resolve(`${questionText}\n\n${responseList.reduce((acc, b, i) => acc + `${responseIdentifierList[i].innerText}) ${b.innerText}\n`, '')}`)
            : reject('Could not extract possible responses!');
    });
}

/** Processes a question featuring an open multi-word response box. **/
function processFreeAnswer(cardElement, questionText, responseElement) {
    return new Promise((resolve, reject) => {

        // Extract the word limit from the response box.
        var wordLimit = responseElement.querySelector('input').maxLength;

        // Return the prompt string, or reject if we couldn't validate the word limit.
        wordLimit > 0 && typeof wordLimit === 'number'
            ? resolve(`Answer the following in ${wordLimit} words or less:\n\n${questionText}`)
            : reject('Failed to extract word limit!');
    });
}

/** Processes a question featuring an open single-word response box. **/
function processWordCloud(cardElement, questionText, responseElement) {
    return new Promise((resolve, reject) => {

        // Extract the character limit from the response box.
        var charLimit = responseElement.querySelector('input').maxLength;

        // Return the prompt string, or reject if we couldn't validate the character limit.
        charLimit > 0 && typeof charLimit === 'number'
            ? resolve(`Answer the following in ${charLimit} characters or less:\n\n${questionText}`)
            : reject('Failed to extract character limit!');
    });
}

/* MutationObserver implementation to resolve with the next element matching the selector that is created.
 * @author Brittank88
 */
function waitForElm(selector) {
    return new Promise(resolve => {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(node => {
                        if (node.matches && node.matches(selector)) {
                            observer.disconnect();
                            resolve(node);
                        } else if (node.querySelectorAll) {
                            const matchingNodes = node.querySelectorAll(selector);
                            matchingNodes.forEach(matchingNode => {
                                observer.disconnect();
                                resolve(matchingNode);
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
