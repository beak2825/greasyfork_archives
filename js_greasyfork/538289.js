// ==UserScript==
// @name         X Auto Post
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically logs in and posts on X
// @author       You
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&url=https://x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538289/X%20Auto%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/538289/X%20Auto%20Post.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const email = 'yagyogo@adadad.uk';
    const password = 'Yuudai_9999';
    const posts = [
        '悪殺会万歳',
        '反悪殺会は消えろ',
        'スルースキル身につけろ'
    ];

    function simulateClick(element) {
        if (element) {
            element.click();
        }
    }

    function simulateInput(element, value) {
        if (element) {
            element.value = value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function login() {
        // Look for login fields and buttons
        const emailInput = document.querySelector('input[type="text"][autocomplete="username"]');
        const passwordInput = document.querySelector('input[type="password"][autocomplete="current-password"]');
        const nextButton = document.querySelector('button[type="button"]'); // Might need refinement
        const loginButton = document.querySelector('button[data-testid="LoginForm_Login_Button"]');

        if (emailInput && nextButton) {
            console.log('Filling email');
            simulateInput(emailInput, email);
            setTimeout(() => simulateClick(nextButton), 500); // Wait a bit before clicking next
        } else if (passwordInput && loginButton) {
            console.log('Filling password and logging in');
            simulateInput(passwordInput, password);
            setTimeout(() => simulateClick(loginButton), 500); // Wait a bit before clicking login
        } else {
            console.log('Login fields not found, might be already logged in or page structure changed.');
        }
    }

    function postContent() {
        const tweetButton = document.querySelector('[data-testid="SideNav_NewTweet_Button"]');
        const tweetComposer = document.querySelector('[data-testid="tweetTextarea_0"]');
        const postButton = document.querySelector('[data-testid="tweetButton"]');

        if (tweetButton) {
            console.log('Found tweet button, clicking...');
            simulateClick(tweetButton);
            // Wait for the composer to appear
            setTimeout(() => postContent(), 1000);
            return;
        }

        if (tweetComposer) {
            console.log('Found tweet composer, entering text...');
            // Post one of the messages, you might want a more sophisticated logic here
            const postText = posts[Math.floor(Math.random() * posts.length)];
            simulateInput(tweetComposer, postText);

            // Wait a bit before clicking post button
            setTimeout(() => {
                const updatedPostButton = document.querySelector('[data-testid="tweetButton"]');
                if (updatedPostButton) {
                    console.log('Found post button, clicking...');
                    simulateClick(updatedPostButton);
                } else {
                    console.log('Post button not found after entering text.');
                }
            }, 1000);
        } else {
            console.log('Tweet composer not found.');
        }
    }

    // Run the functions based on the current URL or page state
    function init() {
        // Check if we are on a login page or need to log in
        if (document.querySelector('input[type="text"][autocomplete="username"]')) {
            login();
        } else {
            // Assume we are logged in and try to post
            // You might want more robust checks here
            postContent();
        }
    }

    // Run init after the page loads
    window.addEventListener('load', init);

    // You might need to observe changes in the DOM if elements load dynamically
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                init(); // Re-run init when new nodes are added
            }
        });
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

})();
