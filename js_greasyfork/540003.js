// ==UserScript==
// @name         X ついか　親ツイートにランダムな数字を付けて自動返信
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Xの親ツイートにランダムな数字を付けて自動返信する (Optimized)
// @author       Your Name
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540003/X%20%E3%81%A4%E3%81%84%E3%81%8B%E3%80%80%E8%A6%AA%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%81%AB%E3%83%A9%E3%83%B3%E3%83%80%E3%83%A0%E3%81%AA%E6%95%B0%E5%AD%97%E3%82%92%E4%BB%98%E3%81%91%E3%81%A6%E8%87%AA%E5%8B%95%E8%BF%94%E4%BF%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/540003/X%20%E3%81%A4%E3%81%84%E3%81%8B%E3%80%80%E8%A6%AA%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%81%AB%E3%83%A9%E3%83%B3%E3%83%80%E3%83%A0%E3%81%AA%E6%95%B0%E5%AD%97%E3%82%92%E4%BB%98%E3%81%91%E3%81%A6%E8%87%AA%E5%8B%95%E8%BF%94%E4%BF%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let replyCount = 0;
    const maxReplies = 1000; // As per code, not comment
    const MIN_DELAY_MS = 50; // Minimum delay between checks/actions (reduced from 0.1 and 2)
    const MAX_WAIT_MS = 10000; // Maximum time to wait for an element to appear

    // Helper to wait for an element using polling
    function waitForElement(selector, timeout = MAX_WAIT_MS) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const check = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element not found within timeout: ${selector}`));
                } else {
                    setTimeout(check, MIN_DELAY_MS);
                }
            };
            check();
        });
    }

    // 返信プロセスを開始する関数
    async function startReplyProcess() {
        if (replyCount >= maxReplies) {
            console.log(`Finished sending ${maxReplies} replies.`);
            return;
        }

        try {
            console.log(`Attempting to find reply button. Reply count: ${replyCount}`);
            const replyButton = await waitForElement('[data-testid="reply"]');

            console.log("Reply button found, clicking.");
            replyButton.click();

            console.log("Reply button clicked. Waiting for textarea...");
            const replyTextArea = await waitForElement('[data-testid="tweetTextarea_0"]');

            console.log("Reply textarea found. Typing text.");
            const randomNum = Math.floor(Math.random() * 1000000);
            replyTextArea.focus();
             // Use insertText and dispatch events to potentially simulate user typing better
            const textToInsert = `タラタラしてんなや ${randomNum}`;

            // Simulate typing by setting value and dispatching events
            replyTextArea.value = textToInsert;
            replyTextArea.dispatchEvent(new Event('input', { bubbles: true }));
            replyTextArea.dispatchEvent(new Event('change', { bubbles: true }));
            replyTextArea.dispatchEvent(new Event('blur', { bubbles: true })); // Trigger validation if any

            console.log("Text typed. Waiting for tweet button to be enabled.");
            const tweetButton = await waitForElement('[data-testid="tweetButton"]:not(:disabled)');

            console.log("Tweet button found and enabled, clicking.");
            tweetButton.click();

            replyCount++;
            console.log(`Successfully replied ${replyCount} times.`);

            // After tweeting, the page state changes.
            // We need to wait for the UI to settle or navigate back if necessary.
            // For simplicity, we wait a bit and then check again.
            // A more advanced script might wait for a specific element to disappear/appear
            // indicating the tweet was sent and the UI reset or moved.
            console.log("Tweet sent. Waiting before next reply attempt.");
            setTimeout(startReplyProcess, 1000); // Wait 1 second before trying the next reply

        } catch (error) {
            console.error("Error during reply process:", error);
            // If an error occurs (e.g., element not found), wait before retrying
            console.log("Retrying reply process after error...");
            setTimeout(startReplyProcess, 3000); // Wait 3 seconds after an error
        }
    }

    // ページの状態を確認し、返信を開始する関数 (Initial trigger)
    function checkAndReply() {
         // Check if we are likely on a tweet detail page (simplified check)
         // A more robust check would involve looking for specific elements unique to a tweet detail page
        if (document.querySelector('[data-testid="reply"]') || document.querySelector('[data-testid="tweetTextarea_0"]')) {
             console.log("Likely on a tweet detail page. Starting reply process.");
             startReplyProcess();
         } else {
             console.log("Not on a tweet detail page or page not ready. Checking again later.");
             // Wait longer if not on a tweet detail page
             setTimeout(checkAndReply, 5000); // Check every 5 seconds
         }
    }

    console.log("X Auto Reply Script Loaded.");

    // Start the process after the window has loaded and a brief delay
    window.addEventListener('load', () => {
         console.log("Window loaded. Starting initial check...");
         setTimeout(checkAndReply, 3000); // Initial check after 3 seconds
     });

     // Handle URL changes
     let lastUrl = location.href;
     const observer = new MutationObserver(() => {
         const url = location.href;
         if (url !== lastUrl) {
             lastUrl = url;
             console.log("URL changed. Checking for new tweet page.");
             // When URL changes, the page structure might change.
             // Wait a bit and then re-run the initial check.
             observer.disconnect(); // Temporarily disconnect to avoid triggering on subsequent mutations
             setTimeout(() => {
                 checkAndReply();
                 observer.observe(document, { subtree: true, childList: true }); // Reconnect observer
             }, 3000); // Wait 3 seconds before checking on new page
         }
     });

     // Start observing for URL changes
     observer.observe(document, { subtree: true, childList: true });

})();