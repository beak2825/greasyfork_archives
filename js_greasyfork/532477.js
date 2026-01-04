// ==UserScript==
// @name         Reddit Unddit Undelete
// @namespace    https://github.com/nazdridoy
// @version      1.8.0
// @description  Adds an "Unddit" button to Reddit's navigation bar that lets you quickly view deleted and removed comments/posts on undelete.pullpush.io with one click. Recover deleted Reddit content easily.
// @author       nazdridoy
// @license      MIT
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @icon         https://undelete.pullpush.io/images/favicon.ico
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-body
// @homepageURL  https://github.com/nazdridoy/Reddit-Unddit-Undelete
// @supportURL   https://github.com/nazdridoy/Reddit-Unddit-Undelete/issues
// @downloadURL https://update.greasyfork.org/scripts/532477/Reddit%20Unddit%20Undelete.user.js
// @updateURL https://update.greasyfork.org/scripts/532477/Reddit%20Unddit%20Undelete.meta.js
// ==/UserScript==

/* 
MIT License

Copyright (c) 2023 nazDridoy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
    'use strict';

    console.log('[Unddit Redirect] Script started!');

    // Reddit Unddit Undelete - Easily view deleted comments and posts on Reddit
    // This script helps users recover deleted content from Reddit by adding a convenient button
    // to the UI that redirects to undelete.pullpush.io (formerly known as unddit)

    // Check if we're on old.reddit.com or www.reddit.com
    const isOldReddit = window.location.hostname === 'old.reddit.com';

    // Observer to watch DOM for dynamic changes
    const observer = new MutationObserver(() => {
        if (!document.getElementById('unddit-button')) {
            if (isOldReddit) {
                addOldRedditButton();
            } else {
                addNewRedditButton();
            }
        }
    });

    // Function to create and add the button to new Reddit's navigation
    function addNewRedditButton() {
        const headerNav = document.querySelector('header.v2 > nav'); // Reddit's main navigation bar
        if (!headerNav) {
            console.log('[Unddit Redirect] New Reddit navigation bar not found.');
            return;
        }

        // Create the Unddit button for quick access to deleted content
        const button = GM_addElement(headerNav, 'div', {
            id: 'unddit-button',
            class: 'unddit-button',
            textContent: 'Unddit',
            title: 'View deleted comments and posts on undelete.pullpush.io',
        });

        // Style the button to be visible and match Reddit's design
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#ff4500'; // Reddit orange
        button.style.color = '#fff';
        button.style.padding = '5px 10px';
        button.style.margin = '5px';
        button.style.borderRadius = '5px';
        button.style.fontSize = '14px';
        button.style.fontWeight = 'bold';

        // Click event to redirect to undelete.pullpush.io to see deleted content
        button.addEventListener('click', redirectToUnddit);

        console.log('[Unddit Redirect] Button added to new Reddit:', button);
    }

    // Function to create and add the button to old Reddit's navigation
    function addOldRedditButton() {
        const headerBottomRight = document.getElementById('header-bottom-right');
        if (!headerBottomRight) {
            console.log('[Unddit Redirect] Old Reddit header-bottom-right not found.');
            return;
        }

        // Create a container for the button that matches the old Reddit style
        const buttonContainer = document.createElement('span');
        buttonContainer.id = 'unddit-button-container';
        buttonContainer.style.marginRight = '8px';
        buttonContainer.style.display = 'inline-block';

        // Create the Unddit button for quick access to deleted content
        const button = document.createElement('a');
        button.id = 'unddit-button';
        button.textContent = 'Unddit';
        button.title = 'View deleted comments and posts on undelete.pullpush.io';
        button.href = '#';
        button.style.fontWeight = 'bold';
        button.style.color = '#ff4500'; // Reddit orange

        // Click event to redirect to undelete.pullpush.io to see deleted content
        button.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToUnddit();
        });

        buttonContainer.appendChild(button);
        headerBottomRight.insertBefore(buttonContainer, headerBottomRight.firstChild);
        
        console.log('[Unddit Redirect] Button added to old Reddit:', button);
    }

    // Common function to handle the redirect
    function redirectToUnddit() {
        const currentUrl = window.location.href;
        const newUrl = currentUrl.replace(/https:\/\/(www\.|old\.)reddit\.com/, 'https://undelete.pullpush.io');
        console.log('[Unddit Redirect] Redirecting to:', newUrl);
        window.location.href = newUrl;
    }

    // Start observing the DOM for changes to ensure button appears even with dynamic page loading
    observer.observe(document, {
        childList: true,
        subtree: true,
    });

    // Add the button immediately in case the nav bar is already loaded
    if (isOldReddit) {
        addOldRedditButton();
    } else {
        addNewRedditButton();
    }

    // Cleanup observer if neither Reddit version is detected
    setTimeout(() => {
        const isRedditApp = isOldReddit 
            ? document.getElementById('header-bottom-right')
            : document.querySelector('header.v2');
            
        if (!isRedditApp) {
            observer.disconnect();
            console.log('[Unddit Redirect] Stopped observing: Reddit app not detected.');
        }
    }, 8000);
})();