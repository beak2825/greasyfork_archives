// ==UserScript==
// @name         Add <br> around <code> tags on FreeCodeCamp
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Adds <br> before and after <code> tags on FreeCodeCamp using Monaco Editor API
// @author       Geromet
// @match        https://www.freecodecamp.org/learn/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/480384/Add%20%3Cbr%3E%20around%20%3Ccode%3E%20tags%20on%20FreeCodeCamp.user.js
// @updateURL https://update.greasyfork.org/scripts/480384/Add%20%3Cbr%3E%20around%20%3Ccode%3E%20tags%20on%20FreeCodeCamp.meta.js
// ==/UserScript==

(function() {
    'use strict';
readPage();
    function addLineBreaks() {
        const codeElements = document.getElementsByTagName('code');
        for (const codeElement of codeElements) {
            const prevSibling = codeElement.previousSibling;
            const nextSibling = codeElement.nextSibling;
            if (prevSibling && prevSibling.tagName === 'BR' && nextSibling && nextSibling.tagName === 'BR') {
                continue;
            }
            const lineBreakBefore = document.createElement('br');
            codeElement.parentNode.insertBefore(lineBreakBefore, codeElement);
            const lineBreakAfter = document.createElement('br');
            codeElement.parentNode.insertBefore(lineBreakAfter, codeElement.nextSibling);
        }
    }

    function simulateMouseDrag(element) {
        const event = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: element.getBoundingClientRect().left,
            clientY: element.getBoundingClientRect().top,
        });

        element.dispatchEvent(event);

        const moveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: element.getBoundingClientRect().left + 1,
            clientY: element.getBoundingClientRect().top,
        });

        element.dispatchEvent(moveEvent);

        const upEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
        });

        element.dispatchEvent(upEvent);
    }
function onSubmitButtonClick() {
    setTimeout(function() {
        location.reload();
    }, 1000);
}
     function oncheckButtonClick() {
         setTimeout(setSubmitButton(),1000);

    }
    function readPage()
    {
        const intervalId = setInterval(function() {
        const codeElements = document.getElementsByTagName('code');

if (codeElements.length > 0) {
            addLineBreaks();
            const checkButton = document.querySelector('button[data-playwright-test-label="lowerJaw-check-button"]');
            if(checkButton)
            {
                 checkButton.addEventListener('click', oncheckButtonClick);
            }
            const reflexSplitter = document.querySelector('.reflex-splitter');
            if (reflexSplitter) {
                simulateMouseDrag(reflexSplitter);
            }

            clearInterval(intervalId);

            }


    }, 100);
    }
 function setSubmitButton()
    {
      const submitButton = document.querySelector('button[data-playwright-test-label="lowerJaw-submit-button"]');
            if (submitButton) {
                submitButton.addEventListener('click', onSubmitButtonClick);
            }
    }
})();
