// ==UserScript==
// @name         X.com Quick Block Button
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a 'Quick Block' button to tweets on x.com for one-click blocking. Robust version.
// @author       Your Name Here
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/531920/Xcom%20Quick%20Block%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/531920/Xcom%20Quick%20Block%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CHECK_INTERVAL = 1000;
    const CLICK_DELAY = 300;
    const BUTTON_TEXT = 'Block';
    const MAX_RETRIES = 3;

    // --- Styling for the Button ---
    const buttonStyle = `
        color: lightgray;
        background-color: transparent;
        border: none;
        margin-left: 10px;
        font-family: monospace;
        font-weight: bold;
        cursor: pointer;
        overflow: hidden; /* Clip the extra part of the shadow when scaled */
        position: relative; /* Needed for the pseudo-element */
    `;

      // --- Helper Function: Wait for an element to appear (RETRYING) ---
    async function waitForElement(selector, timeout = 2000, interval = 200, maxRetries = MAX_RETRIES) {
        return new Promise((resolve, reject) => {
            let elapsedTime = 0;
            let retries = 0;
            const timer = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(timer);
                    resolve(element);
                } else {
                    elapsedTime += interval;
                    if (elapsedTime >= timeout) {
                        if (retries < maxRetries) {
                            retries++;
                            elapsedTime = 0;
                            console.warn(`Quick Block: Element not found, retrying (${retries}/${maxRetries}): ${selector}`);
                        } else {
                            clearInterval(timer);
                            reject(new Error(`Element not found after ${timeout}ms and ${maxRetries} retries: ${selector}`));
                        }
                    }
                }
            }, interval);
        });
    }

    // --- Helper Function: Simulate a click with delay ---
    async function clickElement(element) {
        if (element && typeof element.click === 'function') {
            try {
                element.click();
                await new Promise(resolve => setTimeout(resolve, CLICK_DELAY));
                return true;
            } catch (e) {
                console.error("Quick Block: Error clicking element:", e, element);
                return false;
            }
        } else {
            console.error("Quick Block: Invalid element or no click method:", element);
            return false;
        }
    }

    // --- Helper Function: Find Parent Tweet Article (Robust) ---
    function findParentTweetArticle(node) {
        let current = node;
        while (current && current !== document.body) {
            if (current.tagName === 'ARTICLE' && current.getAttribute('data-testid') === 'tweet') {
                return current;
            }
            current = current.parentNode;
        }
        return null;
    }

    // --- Helper Function: Find Action Bar (More Robust) ---
    function findActionBar(tweetArticle) {
       const selectors = [
            'div[role="group"]',
            'div:has(> button[data-testid="reply"])',
            'div:has(> button[data-testid="like"])',
            'div:has(> button[data-testid="retweet"])'
        ];

        for (const selector of selectors) {
            const found = tweetArticle.querySelector(selector);
            if (found) {
                return found;
            }
        }
        return null;
    }

    // --- Main Blocking Logic (Robust) ---
    async function quickBlockUser(event) {
        const button = event.target;
        button.disabled = true;
        button.textContent = 'Blocking...';
        button.style.backgroundImage = 'linear-gradient(to bottom right, #ff9800, #f57c00)'; // Orange gradient
        button.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';

        const tweetArticle = findParentTweetArticle(button);
         if (!tweetArticle) {
            console.error('Quick Block: Could not find parent tweet article.', button, event.currentTarget);
            button.textContent = 'Error';
            button.style.backgroundColor = 'orange';
            return;
        }

        try {
            let moreButton = null;
            for (let i = 0; i < MAX_RETRIES; i++) {
                moreButton = tweetArticle.querySelector('button[data-testid="caret"]');
                if (moreButton) break;
                await new Promise(resolve => setTimeout(resolve, CLICK_DELAY * 2));
            }
            if (!moreButton) {
                throw new Error('Could not find More button (caret) after retries.');
            }

            if (!await clickElement(moreButton)) {
                throw new Error('Failed to click More button.');
            }

            let blockMenuItem = null;
             for (let i = 0; i < MAX_RETRIES; i++) {
                try{
                    blockMenuItem = await waitForElement('div[data-testid="block"]', 2000, 200, 1);
                    if(blockMenuItem){
                        break;
                    }
                }catch(e){
                    await new Promise(resolve => setTimeout(resolve, CLICK_DELAY * 2));
                }
             }
            if (!blockMenuItem) {
                throw new Error('Could not find Block menu item after retries.');
            }
            if (!await clickElement(blockMenuItem)) {
                throw new Error('Failed to click Block menu item.');
            }

            let confirmButton = null;
            for (let i = 0; i < MAX_RETRIES; i++) {
                try{
                    confirmButton = await waitForElement('button[data-testid="confirmationSheetConfirm"]', 2000, 200, 1);
                    if(confirmButton){
                        break;
                    }
                }catch(e){
                    await new Promise(resolve => setTimeout(resolve, CLICK_DELAY * 2));
                }
            }
            if (!confirmButton) {
                throw new Error('Could not find confirmation Block button after retries.');
            }
            if (!await clickElement(confirmButton)) {
                throw new Error('Failed to click confirmation Block button.');
            }

            console.log('Quick Block: User blocked successfully!');
            button.textContent = 'Blocked!';
            button.style.backgroundImage = 'linear-gradient(to bottom right, #4CAF50, #388E3C)'; // Green gradient
            button.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';

        } catch (error) {
            console.error('Quick Block Error:', error.message, tweetArticle);
            button.textContent = 'Error';
            button.style.backgroundColor = 'orange';
            button.style.backgroundImage = 'none';
            setTimeout(() => {
                button.disabled = false;
                button.textContent = BUTTON_TEXT;
                button.style.backgroundImage =  'linear-gradient(to bottom right, #f44336, #d32f2f)';
                button.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
            }, 2000);
        }
    }

    // --- Function to Add Buttons to Tweets (Robust) ---
    function addBlockButtons() {
        const tweets = document.querySelectorAll('article[data-testid="tweet"]:not([data-quickblock-added])');

        tweets.forEach(tweet => {
            tweet.setAttribute('data-quickblock-added', 'true');

            const actionBar = findActionBar(tweet);
            if (actionBar) {
                const blockButton = document.createElement('button');
                blockButton.textContent = BUTTON_TEXT;
                blockButton.style.cssText = buttonStyle;
                blockButton.title = "Quickly block the user who posted this tweet";

                blockButton.addEventListener('mouseover', () => {
                    if (!blockButton.disabled) {
                        blockButton.style.cssText = buttonHoverStyle;
                    }
                });
                blockButton.addEventListener('mouseout', () => {
                    if (!blockButton.disabled && blockButton.textContent === BUTTON_TEXT) {
                        blockButton.style.cssText = buttonStyle;
                    }
                });
                blockButton.addEventListener('mousedown', () => {
                    if (!blockButton.disabled) {
                         blockButton.style.cssText = buttonActiveStyle;
                    }
                });
                blockButton.addEventListener('mouseup', () => {
                    if (!blockButton.disabled) {
                         blockButton.style.cssText = buttonStyle;
                    }
                });

                blockButton.addEventListener('click', quickBlockUser);

                if (!actionBar.querySelector('.quick-block-button')) {
                    blockButton.classList.add('quick-block-button');
                    actionBar.appendChild(blockButton);
                }

            } else {
                const tweetLinkElement = tweet.querySelector('a[href*="/status/"]');
                let tweetIdentifier = 'Tweet content unavailable or structure changed';
                if (tweetLinkElement && tweetLinkElement.href) {
                     tweetIdentifier = tweetLinkElement.href;
                 } else {
                     const userHandleElement = tweet.querySelector('a[href^="/"][role="link"] > div[dir="ltr"] > span');
                     if (userHandleElement && userHandleElement.textContent.startsWith('@')) {
                         tweetIdentifier = `Tweet by ${userHandleElement.textContent}`;
                     }
                 }
                console.warn(`Quick Block: Could not find action bar for tweet: ${tweetIdentifier}`, tweet);
            }
        });
    }

    // --- Run Periodically and Use MutationObserver ---
    addBlockButtons();

    const observer = new MutationObserver((mutationsList) => {
        let foundTweets = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                 mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && (node.matches('article[data-testid="tweet"]') || node.querySelector('article[data-testid="tweet"]'))) {
                       foundTweets = true;
                    }
                 });
            }
            if (foundTweets) break;
        }

        if (foundTweets) {
            requestAnimationFrame(addBlockButtons);
        }
    });

    const mainContentArea = document.querySelector('main');
    if (mainContentArea) {
        observer.observe(mainContentArea, { childList: true, subtree: true });
    } else {
        console.warn("Quick Block: Could not find <main> element, observing document.body. This might be less efficient.");
        observer.observe(document.body, { childList: true, subtree: true });
    }

    setInterval(addBlockButtons, CHECK_INTERVAL * 2);

    console.log('X.com Quick Block script loaded (v1.3 - Stylish).');

})();
