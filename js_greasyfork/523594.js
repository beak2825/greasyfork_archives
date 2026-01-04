// ==UserScript==
// @name         JanitorAI Personality Snatcher 2
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  Steals JanitorAI bot descriptions.
// @author       Pugsby, ChatGPT
// @match        http*://*.janitorai.com/chats*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=janitorai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523594/JanitorAI%20Personality%20Snatcher%202.user.js
// @updateURL https://update.greasyfork.org/scripts/523594/JanitorAI%20Personality%20Snatcher%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to download a file
    function downloadFile(filename, text) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Create the button
    const button = document.createElement('button');
    button.innerText = 'Steal Personality';
    button.style.position = 'fixed';
    button.style.top = '8px';
    button.style.left = '50%';
    button.style.transform = 'translate(-50%, 0)';
    button.style.padding = '5px 8px';
    button.style.borderRadius = '6px';
    button.style.backgroundColor = 'rgba(128, 90, 213, 0.6)';
    button.style.color = 'var(--chakra-colors-whiteAlpha-800)';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';
    button.style.fontFamily = 'var(--chakra-fonts-body)';
    button.style.lineHeight = '1';
    button.style.fontSize = '14px';

    let requestCount = 0;

    // Function for logging fetch requests
    function logFetchRequests() {
        const originalFetch = window.fetch;
        button.style.backgroundColor = 'rgba(169, 20, 20, 0.6)';
        window.fetch = async (...args) => {
            requestCount++;

            if (requestCount === 2) {
                const requestBody = args[1]?.body;

                if (requestBody) {
                    let bodyText;

                    if (typeof requestBody === 'string') {
                        bodyText = requestBody;
                    } else if (requestBody instanceof Blob) {
                        bodyText = await requestBody.text();
                    } else if (requestBody instanceof FormData) {
                        bodyText = JSON.stringify(Object.fromEntries(requestBody.entries()));
                    } else {
                        console.error('Unsupported request body type:', requestBody);
                        alert('Unsupported request body type.');
                        return originalFetch(...args);
                    }

                    try {
                        const jsonBody = JSON.parse(bodyText); // Parse JSON
                        const messages = jsonBody.messages;

                        if (Array.isArray(messages) && messages.length > 0) {
                            const content = messages[0].content;
                            const occurrences = content.split("'s Persona: ");

                            let result;
                            if (occurrences.length > 2) {
                                result = occurrences.slice(2).join("'s Persona: ");
                                const systemNoteIndex = result.indexOf("[System note");

                                if (systemNoteIndex !== -1) {
                                    result = result.substring(0, systemNoteIndex).trim();
                                }
                                result = 'Personality: ' + result;
                            } else {
                                // If there are fewer than two occurrences, use the whole text
                                result = content;
                            }

                            // Download file with the result
                            downloadFile('personality.txt', result);
                            alert('File downloaded with personality data.');
                            button.style.backgroundColor = 'rgba(128, 90, 213, 0.6)';
                        } else {
                            alert('No messages found or messages is not an array.');
                            button.style.backgroundColor = 'rgba(128, 90, 213, 0.6)';
                        }
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        alert('Error parsing JSON: ' + error.message);
                        button.style.backgroundColor = 'rgba(128, 90, 213, 0.6)';
                    }
                } else {
                    alert('Request body is empty.');
                    button.style.backgroundColor = 'rgba(128, 90, 213, 0.6)';
                }

                requestCount = 0; // Reset the counter
            }

            return originalFetch(...args);
        };
    }

    // Add click handler to the button
    button.addEventListener('click', () => {
        requestCount = 0;
        logFetchRequests();
        alert('Send a message or reload previous bot message to obtain description.');
    });

    // Add the button to the page
    document.body.appendChild(button);
})();
