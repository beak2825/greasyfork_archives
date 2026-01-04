// ==UserScript==
// @name         OpenAI Chat Fold Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fold long "You" messages in OpenAI Chat
// @author       Your Name
// @match        https://chat.openai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482618/OpenAI%20Chat%20Fold%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/482618/OpenAI%20Chat%20Fold%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('load', function() {
        // Function to fold long messages
        function foldLongMessages() {
            const messages = document.querySelectorAll('div[data-message-author-role="user"]');

            messages.forEach(message => {
                if (message.innerText.split('\n').length > 3) {
                    message.style.overflow = 'hidden';
                    message.style.height = '100px'; // Adjust as needed
                    message.style.cursor = 'pointer';

                    // Click to expand
                    message.addEventListener('click', function() {
                        if (message.style.overflow === 'hidden') {
                            message.style.overflow = 'visible';
                            message.style.height = 'auto';
                        } else {
                            message.style.overflow = 'hidden';
                            message.style.height = '100px';
                        }
                    });
                }
            });
        }

        // Run the function and also set an interval to handle dynamic content
        foldLongMessages();
        setInterval(foldLongMessages, 1000);
    });
})();
