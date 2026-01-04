// ==UserScript==
// @name         Imgur BBC link grabber
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Generates collection of BBC img tags from the page
// @author       You
// @match        https://imgur.com/a/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475407/Imgur%20BBC%20link%20grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/475407/Imgur%20BBC%20link%20grabber.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('button');
    button.textContent = 'Generate BBC Tags';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '50%';
    button.style.zIndex = '9099';
    document.body.appendChild(button);

    button.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop the propagation of the click event
        // Create a modal
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '20px';
        modal.style.border = '1px solid #000';
        modal.style.zIndex = '1000';
        modal.style.width = '300px'; // Define a width for the modal
        modal.style.maxWidth = '100%'; // Ensure the modal does not exceed the viewport width
        modal.style.display = 'block';
        document.body.appendChild(modal);

        // Create a textarea and fill it with the BBC tags
        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = '200px';
        const imgNodes = document.querySelectorAll('.PostContent.UploadPost-file img');
        const bbcTags = Array.from(imgNodes).map(img => `[img]${img.getAttribute('src')}[/img]\n`);

        textarea.value = "Добро утро!\n\n";
        textarea.value += bbcTags.join("\n");
        modal.appendChild(textarea);

        // Create a button to copy the content of the textarea
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy to Clipboard';
        copyButton.addEventListener('click', () => {
            textarea.select();
            document.execCommand('copy');
        });
        modal.appendChild(copyButton);

        // Append the modal to the body
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop the propagation of the click event
        });
        window.addEventListener('click', (e) => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        });
    });
})();