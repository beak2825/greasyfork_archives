// ==UserScript==
// @name         Copy Github PR
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a "Copy PR" button to copy the title and link as a rich text
// @author       Othman Shareef (othmanosx@gmail.com)
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481129/Copy%20Github%20PR.user.js
// @updateURL https://update.greasyfork.org/scripts/481129/Copy%20Github%20PR.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const elementQuery = 'h1 .markdown-title'
    let button
    let debounceTimer;

    // Wait for the Jira ticket title element to be available
    const waitForElement = (selector, callback) => {
        const element = document.querySelector(selector);
        if (element) {
            callback();
        } else {
            setTimeout(() => {
                waitForElement(selector, callback);
            }, 200);
        }
    };

    // copy ticket title to clipboard
    const copyPR = () => {
        button.innerText = 'Loading...';
        const ticketTitleElement = document.querySelector(elementQuery);

        // Get issue numbers from PR template
        const issueNumberElements = Array.from(document.querySelectorAll('.issue-link.js-issue-link'));

        // Use a Set to keep track of unique inner texts
        const uniqueTexts = new Set();

        // Use filter to include only the first occurrence of each inner text
        const uniqueElementsData = issueNumberElements
        .filter((element) => {
            const innerText = element.textContent;
            const href = element.getAttribute('href');
            if (href && href.includes('atlassian.net') && !uniqueTexts.has(innerText)) {
                uniqueTexts.add(innerText);
                return true;
            }
            return false;
        })
        .map((element) => ({
            innerText: element.textContent,
            href: element.getAttribute('href'),
        }));

        const issuesHTML = uniqueElementsData.length > 0 ? "Resolves: " + uniqueElementsData.map(({ innerText, href }) => `<a href="${href}">${innerText}</a>`).join(', ') : ""

        if (ticketTitleElement) {
            const PRTitle = ticketTitleElement.innerText;
            const PRLink = window.location.href
            const html = `<a href="${PRLink}">${PRTitle}</a><br/>${issuesHTML}`
            const clipboardItem = new ClipboardItem({
                'text/html': new Blob([html], {
                    type: 'text/html'
                }),
                'text/plain': new Blob([html], {
                    type: 'text/plain'
                })
            });
            navigator.clipboard.write([clipboardItem]).then(_ => {
                // Change button text to "Copied!" for a moment
                button.innerText = 'Copied!';
                setTimeout(() => {
                    // Change button text back to the original text after a delay
                    button.innerText = 'Copy PR';
                }, 1000); // You can adjust the delay (in milliseconds) as needed
            }, error => alert(error));
             } else {
            alert('PR title element not found!');
        }
    };

    // Add button next to the ticket title
    const addButton = () => {
        const existingCopyBtn = document.getElementById("copy-button")
        if(existingCopyBtn) return
        const copyButton = document.createElement('button');
        copyButton.innerText = 'Copy PR';
        copyButton.className = 'Button--secondary Button--big Button';
        copyButton.id = "copy-button"
        copyButton.style.marginLeft = '10px';
        copyButton.style.marginTop = '5px';
        copyButton.style.verticalAlign = 'text-top';

        copyButton.addEventListener('click', copyPR);

        button = copyButton
        const element = document.querySelector(elementQuery);
        element.parentElement.appendChild(copyButton);
    };

    waitForElement(elementQuery, addButton);

    const debounce = (func, delay) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, delay);
    };

        // Use MutationObserver to detect changes in the DOM
    const observer = new MutationObserver(() => {
        debounce(() => {
            waitForElement(elementQuery, addButton);
        }, 100);
    });

    // Observe changes in the body and its descendants
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

})();