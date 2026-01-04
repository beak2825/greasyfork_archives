// ==UserScript==
// @name         Copy Last Code Block on ChatGPT Without Header
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a button to copy the last code block on chat.openai.com without copying the header
// @author       max5555
// @license      MIT
// @match        https://chat.openai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481471/Copy%20Last%20Code%20Block%20on%20ChatGPT%20Without%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/481471/Copy%20Last%20Code%20Block%20on%20ChatGPT%20Without%20Header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the copy button
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Last Code';
    copyButton.style.position = 'fixed';
    copyButton.style.bottom = '20px';
    copyButton.style.right = '20px';
    copyButton.style.zIndex = '1000';

    // Add the button to the body
    document.body.appendChild(copyButton);

    // Function to copy the last code block
    copyButton.addEventListener('click', () => {
        const codeContainers = document.querySelectorAll('pre code');
        if (codeContainers.length > 0) {
            const lastCodeContainer = codeContainers[codeContainers.length - 1];
            navigator.clipboard.writeText(lastCodeContainer.textContent).then(() => {
                alert('Code copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        } else {
            alert('No code blocks found!');
        }
    });
})();
