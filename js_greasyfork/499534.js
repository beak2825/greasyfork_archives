// ==UserScript==
// @name         GaiaOnline FA Action Logger
// @namespace    https://greasyfork.org/en/users/1265537-kloob
// @version      1.0
// @description  Capture the contents of your thread moves to make logging your actions easier/more efficient!
// @author       kloob
// @match        https://www.gaiaonline.com/forum/*/*/t.*/
// @match        https://www.gaiaonline.com/forum/mod/move/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499534/GaiaOnline%20FA%20Action%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/499534/GaiaOnline%20FA%20Action%20Logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get the forum name from the topic page
    function getForumName() {
        let bgPlateElement = document.querySelector('.bg_plate');
        if (bgPlateElement) {
            let forumLinks = bgPlateElement.querySelectorAll('a');
            if (forumLinks.length > 0) {
                let lastLink = forumLinks[forumLinks.length - 1];
                return lastLink.innerText.trim();
            }
        }
        return null;
    }

    // Function to get the target forum from the input field
    function getTargetForum() {
        let targetForumElement = document.getElementById('forum_select');
        return targetForumElement ? targetForumElement.value : null;
    }

    // Function to get the move message from the textarea
    function getMoveMessage() {
        let moveMessageElement = document.getElementById('mod-notes');
        return moveMessageElement ? moveMessageElement.value.trim() : null;
    }

    // Function to get the thread link and title in BBCode format
    function getThreadLink() {
        let threadLinkElement = document.querySelector('.topic-icon + a');
        if (threadLinkElement) {
            let threadUrl = 'https://www.gaiaonline.com' + threadLinkElement.getAttribute('href');
            let threadTitle = threadLinkElement.innerText.trim();
            return `[url=${threadUrl}]${threadTitle}[/url]`;
        }
        return null;
    }

    // Capture and store the current forum name
    let forumName = getForumName();
    if (forumName) {
        sessionStorage.setItem('currentForumName', forumName);
        console.log('Current Forum:', forumName);
    } else {
        console.log('Failed to capture forum name.');
    }

    // Function to handle target forum change
    function handleTargetForumChange() {
        let targetForumName = getTargetForum();
        if (targetForumName) {
            sessionStorage.setItem('targetForumName', targetForumName);
            console.log('Target Forum:', targetForumName);
        } else {
            console.log('Failed to capture target forum name.');
        }
    }

    // Function to handle move message change
    function handleMoveMessageChange() {
        let moveMessage = getMoveMessage();
        if (moveMessage) {
            sessionStorage.setItem('moveMessage', moveMessage);
            console.log('Move Message:', moveMessage);
        } else {
            console.log('Failed to capture move message.');
        }
    }

    // Function to handle thread link capture
    function handleThreadLinkCapture() {
        let threadLink = getThreadLink();
        if (threadLink) {
            sessionStorage.setItem('threadLink', threadLink);
            console.log('Thread Link:', threadLink);
        } else {
            console.log('Failed to capture thread link.');
        }

        // Also log the thread title
        let threadTitleElement = document.querySelector('.topic-icon + a');
        if (threadTitleElement) {
            let threadTitle = threadTitleElement.innerText.trim();
            console.log('Thread Title:', threadTitle);
        } else {
            console.log('Failed to capture thread title.');
        }
    }

    // Capture and store the target forum name when the input field value changes
    let targetForumElement = document.getElementById('forum_select');
    if (targetForumElement) {
        targetForumElement.addEventListener('change', function() {
            console.log('Change detected in target forum:', targetForumElement.value);
            handleTargetForumChange();
        });
        targetForumElement.addEventListener('input', function() {
            console.log('Input detected in target forum:', targetForumElement.value);
        });
    }

    // Capture and store the move message when the textarea value changes
    let moveMessageElement = document.getElementById('mod-notes');
    if (moveMessageElement) {
        moveMessageElement.addEventListener('change', function() {
            console.log('Change detected in move message:', moveMessageElement.value);
            handleMoveMessageChange();
        });
        moveMessageElement.addEventListener('input', function() {
            console.log('Input detected in move message:', moveMessageElement.value);
        });
    }

    // Capture and store the thread link and title when the page loads
    handleThreadLinkCapture();

    // Copy stored information to clipboard and submit form on button click
    let submitButton = document.querySelector('.btn-submit');
    if (submitButton) {
        submitButton.addEventListener('click', function(event) {
            // Copy to clipboard
            copyStoredInformation();

            // Submit form (if it's a form submit button)
            let form = submitButton.closest('form');
            if (form) {
                form.submit();
            }
        });
    }

// Function to copy stored information to clipboard
function copyStoredInformation() {
    let storedForumName = sessionStorage.getItem('currentForumName') || '';
    let storedTargetForumName = sessionStorage.getItem('targetForumName') || '';
    let storedMoveMessage = sessionStorage.getItem('moveMessage') || '';
    let storedThreadLink = sessionStorage.getItem('threadLink') || '';

    // Wrap move message in spoiler if it exists
    let spoilerWrappedMoveMessage = storedMoveMessage.trim() ? `[spoiler]${storedMoveMessage}[/spoiler]` : '';

    let clipboardContent = `[b]Topic:[/b] ${storedThreadLink}\n`;
    clipboardContent += `[b]From Forum:[/b] ${storedForumName}\n`;
    clipboardContent += `[b]To Forum:[/b] ${storedTargetForumName}\n`; // Added newline here
    clipboardContent += `[b]Notes:[/b]\n`; // Start notes on a new line
    clipboardContent += `[b]Move Message:[/b] ${spoilerWrappedMoveMessage}\n`;

    navigator.clipboard.writeText(clipboardContent)
        .then(() => console.log('Copied to clipboard:', clipboardContent))
        .catch(err => console.error('Failed to copy to clipboard:', err));
}


})();
