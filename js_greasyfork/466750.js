// ==UserScript==
// @name         Continue in-complete GPT responses.
// @description  A script that makes GPT responses continue. 
// @version      1.1
// @icon         https://www.google.com/favicon.ico
// @author       blank
// @namespace    https://google.com
// @match        https://chat.openai.com/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466750/Continue%20in-complete%20GPT%20responses.user.js
// @updateURL https://update.greasyfork.org/scripts/466750/Continue%20in-complete%20GPT%20responses.meta.js
// ==/UserScript==
(function() {
    "use strict";
 
    const log = console.log;
 
    // Get the ChatGPT response element.
    const responseElement = document.querySelector(".chat-gpt-response");
 
    // Check if the response is incomplete.
    if (responseElement.textContent.endsWith("...")) {
 
        // Get the last word in the response.
        const lastWord = responseElement.textContent.split(" ").pop();
 
        // Generate a continuation for the response.
        const continuation = GPT.continue(lastWord);
 
        // Append the continuation to the response.
        responseElement.textContent += continuation;
 
        // Check if the response is still incomplete.
        if (responseElement.textContent.endsWith("...")) {
 
            // Generate a new continuation for the response.
            const newContinuation = GPT.continue(continuation);
 
            // Append the new continuation to the response.
            responseElement.textContent += newContinuation;
        }
    }
})();