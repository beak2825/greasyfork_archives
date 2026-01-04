// ==UserScript==
// @name         Block who retweeted this
// @namespace    http://tampermonkey.net/
// @version      0.51
// @description  Add a button to block everyone who retweeted a tweet.
// @author       CL Based on a script by KingSupernova
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_openInTab
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513104/Block%20who%20retweeted%20this.user.js
// @updateURL https://update.greasyfork.org/scripts/513104/Block%20who%20retweeted%20this.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to style the buttons according to Twitter's design
    function applyButtonStyles(button) {
        button.style.marginLeft = '10px';
        button.style.backgroundColor = '#e0245e';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '5px 12px';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '9999px'; // Twitter's rounded button style
        button.style.fontSize = '13px';
        button.style.fontWeight = 'bold';
        button.style.textTransform = 'uppercase';
        button.style.fontFamily = 'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        button.style.letterSpacing = '0.5px';
        button.style.transition = 'background-color 0.2s ease-in-out';
    }

    // Hover effect
    function applyButtonHoverEffect(button) {
        button.addEventListener('mouseover', function() {
            button.style.backgroundColor = '#c21d4b'; // Darker red on hover
        });
        button.addEventListener('mouseout', function() {
            button.style.backgroundColor = '#e0245e'; // Back to original color
        });
    }

    // Helper function to add the "Block who retweeted this" button under each tweet
    function addButtonToTweet() {
        let tweetButtons = document.querySelectorAll('[role="group"]');

        tweetButtons.forEach(buttonGroup => {
            // Check if the button already exists to prevent duplicates
            if (!buttonGroup.querySelector('.block-retweeters-button')) {
                let blockButton = document.createElement('button');
                blockButton.innerHTML = 'Block who retweeted this';
                blockButton.className = 'block-retweeters-button';

                // Apply styles and hover effect
                applyButtonStyles(blockButton);
                applyButtonHoverEffect(blockButton);

                blockButton.addEventListener('click', function() {
                    let tweetLink = buttonGroup.closest('article').querySelector('a[href*="/status/"]');
                    if (tweetLink) {
                        let tweetUrl = tweetLink.href;
                        let retweetUrl = tweetUrl + '/retweets';
                        // Open the retweets page in a new tab
                        GM_openInTab(retweetUrl, { active: true, insert: true, setParent: true });
                    }
                });
                buttonGroup.appendChild(blockButton);
            }
        });
    }

    // Helper function to add the block button on the retweets page
    function addButtonToRetweetsPage() {
        let retweetList = document.querySelector('[aria-label="Timeline: Reposts"]');
        if (retweetList && !document.querySelector('.block-retweets-button')) {
            let blockButton = document.createElement('button');
            blockButton.innerHTML = 'Block all retweeters';
            blockButton.className = 'block-retweets-button';
            blockButton.style.display = 'block';
            blockButton.style.margin = '10px auto';
            blockButton.style.padding = '10px 15px';
            blockButton.style.fontSize = '14px';
            blockButton.style.textAlign = 'center';

            // Apply styles and hover effect
            applyButtonStyles(blockButton);
            applyButtonHoverEffect(blockButton);

            blockButton.addEventListener('click', function() {
                runBlockScript();  // Run the block script when clicked
            });

            retweetList.parentNode.insertBefore(blockButton, retweetList);
        }
    }

    // Blocking script to block retweeters
    function runBlockScript() {
        const affectedAccountUrls = {};

        const getNextPerson = function() {
            let elements = Array.from(document.querySelectorAll('[aria-label="Timeline: Reposts"] > div > div'));
            for (let el of elements) {
                try {
                    let profileLink = el.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.firstChild.firstChild.firstChild.firstChild;
                    if (profileLink.href && !affectedAccountUrls[profileLink.href]) return profileLink;
                } catch (err) {}
            }
            return false;
        };

        const findButton = function(username) {
            let dialog = document.querySelector('[data-testid="Dropdown"]') || document.querySelector('[data-testid="sheetDialog"]');
            let buttons = Array.from(dialog.children);
            for (let button of buttons) {
                if (button.children[1].firstChild.firstChild.textContent.startsWith(username + " @")) return button;
            }
            console.log("Could not find " + username.toLowerCase() + " button");
            return false;
        };

        const performActionOnPerson = async function(person, action) {
            for (affectedAccountUrls[person.href] = !0, person.click(); null === document.querySelector('[data-testid="userActions"]');)
                await sleep(10);
            for (document.querySelector('[data-testid="userActions"]').firstChild.click(); !document.querySelector('[data-testid="Dropdown"]') || document.querySelector('[data-testid="sheetDialog"]');)
                await sleep(10);
            let button = findButton(action);
            for (button && (button.click(), "Block" === action && (await sleep(50), document.querySelector('[data-testid="confirmationSheetConfirm"]').click()), await sleep(50)), history.back();
                null === document.querySelector('[aria-label="Timeline: Reposts"]');
            ) await sleep(10);
            return Boolean(button);
        };

        const scrollToNewPeople = async function() {
            let viewport = document.querySelector("[data-viewportview=true]") || document.documentElement;
            let lastScrollTop = viewport.scrollTop;
            let lastCheckTime = performance.now();
            for (; !getNextPerson();) {
                if (viewport.scrollTop += 100, lastScrollTop === viewport.scrollTop) {
                    if (performance.now()-lastCheckTime >= 2000) return;
                } else lastCheckTime = performance.now();
                lastScrollTop = viewport.scrollTop, await sleep(1);
            }
        };

        const performActionOnPeople = async function(action) {
            let count = 0;
            for (;;) {
                await scrollToNewPeople();
                let person = getNextPerson();
                if (person) {
                    let success = await performActionOnPerson(person, action);
                    success && count++;
                } else {
                    alert(count + " people " + action.toLowerCase() + "ed.");
                    return;
                }
            }
        };

        const sleep = async function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        };

        // Start blocking retweeters
        performActionOnPeople('Block');
    }

    // Mutation observer to add buttons to new tweets and the retweets page
    const observer = new MutationObserver(() => {
        addButtonToTweet();
        addButtonToRetweetsPage();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();