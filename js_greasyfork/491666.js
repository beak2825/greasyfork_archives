// ==UserScript==
// @name         URL & Timpestamp Buttons
// @namespace    https://greasyfork.org/en/users/1265537-kloob
// @version      2.1
// @description  Add buttons to copy topic and post URLs, thread titles, timestamps, and display post IDs.
// @author       kloob
// @match        https://www.gaiaonline.com/forum/*
// @match        https://www.gaiaonline.com/forum/*/*/*
// @match        https://www.gaiaonline.com/forum/mytopics/*
// @exclude      https://www.gaiaonline.com/forum/*/f*
// @exclude      https://www.gaiaonline.com/forum/list/*
// @exclude      https://www.gaiaonline.com/forum/f.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491666/URL%20%20Timpestamp%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/491666/URL%20%20Timpestamp%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load Font Awesome
    const faStylesheet = document.createElement('link');
    faStylesheet.rel = 'stylesheet';
    faStylesheet.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css';
    document.head.appendChild(faStylesheet);

    // Function to copy BBCode to clipboard
    function copyBBCode(url, button) {
        const bbCode = `[url]${url}[/url]`;
        navigator.clipboard.writeText(bbCode).then(function() {
            console.log('BBCode copied to clipboard: ' + bbCode);
            button.innerHTML = '<i class="fa-solid fa-check" style="color: #007d16;"></i>';
            button.disabled = true; // Disable the button
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    }

    // Function to extract and display the post ID
    function displayPostID(postLink) {
        const url = postLink.getAttribute('href');
        const postID = url.split('#').pop(); // Extract the post ID from the URL
        const postIDElement = document.createElement('span');
        postIDElement.textContent = `Post ID: ${postID}`;
        postIDElement.style.marginRight = '5px';
        postLink.parentNode.insertBefore(postIDElement, postLink.nextSibling);
    }

    // Function to add buttons for topics
    function addTopicButtons() {
        document.querySelectorAll('#thread_title a').forEach(topic => {
            if (!topic.nextElementSibling || !topic.nextElementSibling.classList.contains('copy-btn')) {
                const button = document.createElement('button');
                button.innerHTML = '<i class="fa-solid fa-link" style="color: #000000;"></i>';
                button.className = 'copy-btn';
                button.style.marginLeft = '5px';
                button.addEventListener('click', function() {
                    const topicUrl = window.location.origin + topic.getAttribute('href');
                    copyBBCode(topicUrl, button);
                });
                topic.parentNode.insertBefore(button, topic.nextSibling);
            }
        });
    }

    // Function to add buttons for posts
    function addPostButtons() {
        document.querySelectorAll('.post-directlink a').forEach(postLink => {
            displayPostID(postLink); // Display the post ID before adding the copy button
            const button = document.createElement('button');
            button.innerHTML = '<i class="fa-solid fa-link" style="color: #000000;"></i>';
            button.className = 'copy-btn';
            button.style.marginLeft = '5px';
            button.addEventListener('click', function() {
                const postUrl = window.location.origin + postLink.getAttribute('href');
                copyBBCode(postUrl, button);
            });
            postLink.parentNode.appendChild(button);
        });
    }

    // Function to add a copy button next to the thread title
    function addCopyTitleButton() {
        const titleContainer = document.getElementById('thread_title');

        if (!titleContainer) {
            setTimeout(addCopyTitleButton, 1000); // Retry if the title container is not found
            return;
        }

        const titleElement = titleContainer.querySelector('a');
        if (!titleElement || titleContainer.querySelector('.copy-title-btn')) {
            return;
        }

        const copyButton = createCopyButton(titleElement.textContent.trim(), '[b]Topic Title:[/b] ');
        titleContainer.appendChild(copyButton);
    }

    // Function to add a copy button next to timestamps
    function addCopyTimestampButton() {
        const timestamps = document.querySelectorAll('abbr.timestamp, td.lastupdated');

        if (timestamps.length === 0) {
            setTimeout(addCopyTimestampButton, 1000); // Retry if no timestamps are found
            return;
        }

        timestamps.forEach(function(timestampElement) {
            if (timestampElement.nextElementSibling && timestampElement.nextElementSibling.className.includes('copy-timestamp-btn')) {
                return;
            }

            let timestampText = timestampElement.textContent.trim();
            const formattedTimestamp = `The following post/thread made on ${timestampText} was deleted:`;
            const copyButton = createCopyButton(formattedTimestamp);
            timestampElement.parentNode.insertBefore(copyButton, timestampElement.nextSibling);
        });
    }

    // Helper function to create a copy button
    function createCopyButton(textToCopy, prefix = '') {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.style.marginLeft = '5px';

        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-copy';
        copyButton.appendChild(icon);

        copyButton.addEventListener('click', function(e) {
            e.preventDefault();
            navigator.clipboard.writeText(prefix + textToCopy)
                .then(() => {
                    icon.className = 'fa-solid fa-check fa-bounce';
                    icon.style.color = '#2da62c'; // Set color to green
                    copyButton.disabled = true; // Disable the button after copying
                })
                .catch(err => console.error('Error copying:', err));
        });

        return copyButton;
    }

    // Function to reapply buttons after PJAX load
    function reapplyButtons() {
        addTopicButtons();
        addPostButtons();
        addCopyTitleButton();
        addCopyTimestampButton();
    }

    // Listen for PJAX events and reapply the buttons
    document.addEventListener('pjax:end', reapplyButtons);

    // Initial application of buttons
    reapplyButtons();

})();