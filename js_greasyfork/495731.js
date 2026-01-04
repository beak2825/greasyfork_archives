// ==UserScript==
// @name         Hide Weather Report Posts from Avimelech
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Hide posts within אבימלך׳ס נייעס טישל! containing specific weather-related texts and allow them to be toggled
// @author       Knaper Yaden
// @match        *://*.ivelt.com/forum/viewtopic.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495731/Hide%20Weather%20Report%20Posts%20from%20Avimelech.user.js
// @updateURL https://update.greasyfork.org/scripts/495731/Hide%20Weather%20Report%20Posts%20from%20Avimelech.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Array of words/phrases to match
    const wordsToMatch = ['די וועטער היינט', 'היינטיגע וועטער', 'הערליכע וועטער', 'ווארימע פאר טעג', 'וועטער אויסקוק', 'וועטער באריכט', 'וועטער פאר די היינטיגע טאג', 'שיינע וועטער', 'וועט אויסקוק', 'א פיינע טאג'];

    // Function to check if the page meets the specific condition
    function isTargetPage() {
        const topicTitleLink = document.querySelector('h2.topic-title a[href*="./viewtopic.php?t=60870"]');
        return topicTitleLink !== null;
    }

    // Function to hide posts containing specific texts and add toggle button
    function hidePosts() {
        // Get all post elements
        const posts = document.querySelectorAll('.post');

        // Loop through each post
        posts.forEach(post => {
            // Check if the post contains any of the words in the array
            const postText = post.innerText;
            if (wordsToMatch.some(word => postText.includes(word))) {
                // Create the toggle container with the same post class for consistent styling
                const toggleContainer = document.createElement('div');
                toggleContainer.className = post.className;
                toggleContainer.style.marginBottom = '10px';

                // Create the toggle message
                const toggleMessage = document.createElement('div');
                toggleMessage.className = 'inner';
                toggleMessage.style.padding = '10px';
                toggleMessage.style.border = '1px solid #ccc';
                toggleMessage.style.backgroundColor = '#f9f9f9';
                toggleMessage.style.cursor = 'pointer';

                // Add the message text
                const messageText = document.createElement('span');
                messageText.innerText = 'וועטער אויסקוק באריכטן באהאלטן - ';
                toggleMessage.appendChild(messageText);

                // Create the show button
                const showButton = document.createElement('button');
                showButton.innerText = 'ווייז';
                showButton.style.marginLeft = '10px';
                toggleMessage.appendChild(showButton);

                // Append the toggle message to the toggle container
                toggleContainer.appendChild(toggleMessage);

                // Hide the original post content
                post.style.display = 'none';

                // Insert the toggle container before the post
                post.parentNode.insertBefore(toggleContainer, post);

                // Add click event to the show button to toggle the post visibility
                showButton.addEventListener('click', () => {
                    if (post.style.display === 'none') {
                        post.style.display = '';
                        showButton.innerText = 'באהאלט צוריק';
                    } else {
                        post.style.display = 'none';
                        showButton.innerText = 'ווייז';
                    }
                });
            }
        });
    }

    // Run the function after the page has fully loaded, if it's the target page
    window.addEventListener('load', () => {
        if (isTargetPage()) {
            hidePosts();
        }
    });
})();