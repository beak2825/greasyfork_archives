// ==UserScript==
// @name        Automatically show more replies on Twitter (+ offensive replies)
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*
// @grant       none
// @version     1.1
// @author      minnieo
// @description 6/1/2024, 1:49:37 AM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/496716/Automatically%20show%20more%20replies%20on%20Twitter%20%28%2B%20offensive%20replies%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496716/Automatically%20show%20more%20replies%20on%20Twitter%20%28%2B%20offensive%20replies%29.meta.js
// ==/UserScript==


// Function to check and click the 'Show more replies' button
function clickShowMoreRepliesButton() {
    // Find the button that contains a span with the text 'Show more replies'
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        const span = button.querySelector('span');
        if (span && span.textContent === 'Show more replies') {
            button.click();
            console.log('Button "Show more replies" clicked!');
        }
    });
}

// REMOVE THESE LINES BELOW
function clickShowAdditionalRepliesButton() {
    // Find the div that contains a span with the text 'Show additional replies, including those that may contain offensive content'
    const divs = document.querySelectorAll('div');
    divs.forEach(div => {
        const span = div.querySelector('span');
        if (span && span.textContent === 'Show additional replies, including those that may contain offensive content') {
            // Find the button within the same div
            const button = div.querySelector('button');
            if (button) {
                button.click();
                console.log('Button "Show additional replies" clicked!');
            }
        }
    });
}
// REMOVE THESE LINES ABOVE


// Set up a MutationObserver to monitor changes in the DOM
const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
            clickShowMoreRepliesButton();
            clickShowAdditionalRepliesButton(); // REMOVE THIS LINE
        }
    }
});

// Start observing the entire document for changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial check in case the buttons are already present
clickShowMoreRepliesButton();
clickShowAdditionalRepliesButton(); // REMOVE THIS LINE

