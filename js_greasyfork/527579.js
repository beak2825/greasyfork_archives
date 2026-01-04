// ==UserScript==
// @name         X Block
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds a block button to tweets excluding your own, using native Twitter block
// @author       adamlproductions
// @match        https://x.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527579/X%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/527579/X%20Block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let myScreenName = null;

    function extractUserInfo() {
        const profileLink = document.querySelector('a[href^="/"][aria-label*="Profile"]');
        if (profileLink) {
            myScreenName = profileLink.getAttribute('href').slice(1).toLowerCase();
        } else {
            console.log('Profile link not found.');
        }
    }

    function waitForProfile() {
        if(null !== myScreenName){
            return;
        }
        const profileLink = document.querySelector('a[href^="/"][aria-label*="Profile"]');
        if (profileLink) {
            extractUserInfo();
        } else {
            setTimeout(waitForProfile, 1000);
        }
    }

    function triggerNativeBlock(screenName, tweetElement) {
        console.log("tweetElement:", tweetElement);
        const menuButton = tweetElement.querySelector('button[aria-label="More"][role="button"]');
        if (!menuButton) {
            console.error('Context menu not found for tweet');
            return;
        }
        menuButton.click();
        setTimeout(() => {
            const blockOption = document.querySelector(`div[role="menuitem"][data-testid="block"]`);
            if (blockOption) {
                blockOption.click();
            } else {
                console.error('Block option not found in menu');
            }
        }, 500);
    }

    function addBlockButton(tweet) {
        const actions = tweet.querySelector('div[role="group"]');
        if (actions && !actions.querySelector('.block-button')) {
            const usernameLink = tweet.querySelector('a[href^="/"]');
            if (usernameLink) {
                const screenName = usernameLink.getAttribute('href').slice(1).toLowerCase();
                if (screenName !== myScreenName) {
                    const blockButton = document.createElement('button');
                    blockButton.textContent = 'Block';
                    blockButton.className = 'block-button';
                    blockButton.style.marginLeft = '10px';
                    blockButton.style.cursor = 'pointer';
                    blockButton.addEventListener('click', () => {
                        triggerNativeBlock(screenName, tweet);
                    });
                    actions.appendChild(blockButton);
                }
            }
        }
    }

    function scanAndAddButtons() {
        waitForProfile();
        document.querySelectorAll('article').forEach(article => {
            addBlockButton(article);
        });
    }

    let pageObserver;
    function observePage() {
        if (pageObserver) pageObserver.disconnect();

        const contentArea = document.querySelector('main') || document.body;
        pageObserver = new MutationObserver(() => {
            scanAndAddButtons();
        });

        pageObserver.observe(contentArea, { childList: true, subtree: true });
        scanAndAddButtons();
    }

    let lastPath = '';
    function checkNavigation() {
        const currentPath = window.location.pathname;
        if (currentPath !== lastPath) {
            lastPath = currentPath;
            if (/\/status\/\d+/.test(currentPath)) {
                observePage();
            } else {
                if (pageObserver) {
                    pageObserver.disconnect();
                    pageObserver = null;
                }
            }
        }
    }
    setInterval(checkNavigation, 500);
    checkNavigation();
})();