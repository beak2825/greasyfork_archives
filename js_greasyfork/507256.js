// ==UserScript==
// @name         ChatGPT Auto-Continue (September 2024)
// @version      1.0
// @description  Updated September 2024. Fun fact: Written 99% by ChatGPT.
// @author       ∫(Ace)³dx [Technically ChatGPT though]
// @match        https://chatgpt.com/c/*
// @icon         https://cdn-icons-png.flaticon.com/512/6471/6471695.png
// @license MIT
// @grant        none
// @namespace https://greasyfork.org/users/449798
// @downloadURL https://update.greasyfork.org/scripts/507256/ChatGPT%20Auto-Continue%20%28September%202024%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507256/ChatGPT%20Auto-Continue%20%28September%202024%29.meta.js
// ==/UserScript==

// Function to check for the button and click it if found
function checkAndClickButton() {
    try {
        // Evaluate the XPath expression
        let xpath = '/html/body/div[1]/div[2]/main/div[1]/div[2]/div/div[1]/div/form/div/div[1]/div/div/div/div/button';
        let result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        let button = result.singleNodeValue;

        // If the button is found, click it
        if (button) {
            button.click();
            console.log('Button clicked!');
        }
    } catch (error) {
        console.error('Error checking or clicking the button:', error);
    }
}

// Set an interval to check every 500 milliseconds
setInterval(checkAndClickButton, 500);
