// ==UserScript==
// @name         chatgpt logout-default prompt
// @namespace    http://rant.li/boson
// @version      1.5
// @description  Automatically clicks the 'Stay logged out' button and focuses on text input with default prompt
// @author       Boson
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @grant        none
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/517499/chatgpt%20logout-default%20prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/517499/chatgpt%20logout-default%20prompt.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let scriptExecuted = false;
    function clickStayLoggedOut(retryCount = 0) {
        const element = document.querySelector('.text-token-text-secondary.underline');
        if (element) {
            element.click();
            console.log('Clicked "Stay logged out" button');
            setTimeout(focusOnTextInput, 1000);
        } else {
            console.log('Element not found, retrying...');
            if (retryCount < 3) {
                setTimeout(clickStayLoggedOut, 1000, retryCount + 1);
            } else {
                console.log('Failed to find stay logged out element after 5 retries');
            }
        }
    }

    function focusOnTextInput(retryCount = 0) {
        const inputSelector = 'div#prompt-textarea';
        const textAreaElement = document.querySelector(inputSelector);
        if (textAreaElement) {
            if (!textAreaElement.hasAttribute('disabled')) {
                if (textAreaElement.offsetWidth > 0 && textAreaElement.offsetHeight > 0) {
                    textAreaElement.focus();
                    textAreaElement.textContent = '<instructions> Be technical, precise, efficient, innovative, and concise with graduate-level vocabulary. </instructions> <knowledge>You emulate the most proficient people in the domain relevant to the upcoming questions and are up-to-date with the latest information, technologies and best practices. </knowledge> <question>  '; // Replace with your desired query
                    placeCursorAtEnd(textAreaElement);

                } else {
                    console.log('Text input element is not visible');
                }
            } else {
                console.log('Text input element is disabled');
            }
        } else {
            console.log('Text input element not found, retrying...');
            if (retryCount < 3) {
                setTimeout(focusOnTextInput, 1000, retryCount + 1);
            } else {
                console.log('Failed to find text input element after 5 retries');
            }
        }
    }

    function placeCursorAtEnd(element) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(element);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    window.addEventListener('load', function() {
      if (!scriptExecuted) {
        console.log('Page loaded, attempting to click "Stay logged out"');
        clickStayLoggedOut();
            scriptExecuted = true;
        }
    });
})();