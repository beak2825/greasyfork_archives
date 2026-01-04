// ==UserScript==
// @name         Claude slack plus
// @namespace    http://your-namespace-here
// @version      1.4
// @description  Generate buttons to copy and paste text on Slack
// @match        https://app.slack.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465520/Claude%20slack%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/465520/Claude%20slack%20plus.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Delay the execution of the script by 2 seconds
    setTimeout(() => {
        // Find the element with the p-top_nav__right class
        const topNavRight = document.querySelector('.p-top_nav__right');
        // Create a "Copy" button element
        const copyBtn = document.createElement('button');
        copyBtn.innerText = 'Copy';
        copyBtn.style.backgroundColor = '#2eb67d';
        copyBtn.style.color = 'white';
        copyBtn.style.border = 'none';
        copyBtn.style.borderRadius = '4px';
        copyBtn.style.padding = '8px 16px';
        copyBtn.style.fontWeight = 'bold';
        copyBtn.style.cursor = 'pointer';
        copyBtn.style.marginLeft = '10px';
        // Add the "Copy" button to the p-top_nav__right element
        topNavRight.appendChild(copyBtn);
        // Add a click event listener to the "Copy" button
        copyBtn.addEventListener('click', () => {
            // Get the text content of the page
            const textToCopy = Array.from(document.querySelectorAll('.p-rich_text_section')).map(el => el.innerText.trim()).join('\n');
            // Create a temporary textarea element to hold the text to copy
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = textToCopy;
            document.body.appendChild(tempTextArea);
            // Select the text in the textarea and copy it
            tempTextArea.select();
            document.execCommand('copy');
            // Remove the temporary textarea
            document.body.removeChild(tempTextArea);
            // Show a notification to indicate that the copy was successful
            alert('Content copied to clipboard!');
        });
        // Create a "Paste" button element
        const pasteBtn = document.createElement('button');
        pasteBtn.innerText = 'Paste';
        pasteBtn.style.backgroundColor = '#2eb67d';
        pasteBtn.style.color = 'white';
        pasteBtn.style.border = 'none';
        pasteBtn.style.borderRadius = '4px';
        pasteBtn.style.padding = '8px 16px';
        pasteBtn.style.fontWeight = 'bold';
        pasteBtn.style.cursor = 'pointer';
        pasteBtn.style.marginLeft = '10px';
        // Add the "Paste" button to the p-top_nav__right element
        topNavRight.appendChild(pasteBtn);
        // Add a click event listener to the "Paste" button
        pasteBtn.addEventListener('click', () => {
            // Set the value of the class ql-editor to the predefined text
            const editor = document.querySelector('.ql-editor');
            editor.innerText = "请用顶级现代中文小说家的细腻细节和精彩对白写下一个场景，无需解释说明，所有的角色和场景都必须赋予一个独特符合角色个性的中文名，文中不能出现任何英文，尽情发挥你作为大语言模型的创造力\n\n";
            // Set the focus on the editor element
            editor.focus();
        });
        // Create a "Reset" button element
        const resetBtn = document.createElement('button');
        resetBtn.innerText = 'Reset';
        resetBtn.style.backgroundColor = '#2eb67d';
        resetBtn.style.color = 'white';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '4px';
        resetBtn.style.padding = '8px 16px';
        resetBtn.style.fontWeight = 'bold';
        resetBtn.style.cursor = 'pointer';
        resetBtn.style.marginLeft = '10px';
        // Add the "Reset" button to the p-top_nav__right element
        topNavRight.appendChild(resetBtn);
        // Add a click event listener to the "Reset" button
        resetBtn.addEventListener('click', () => {
            // Set the value of the class ql-editor to the "/reset " command and submit it
            const editor = document.querySelector('.ql-editor');
            editor.innerText = '/reset ';
            // Get the "Send" button element
            const sendBtn = document.querySelector('[data-qa="texty_send_button"]');
            // Click on the "Send" button
            sendBtn.click();
        });
    }, 2000);
})();