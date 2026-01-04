// ==UserScript==
// @name         Archive All X.com Posts
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically scroll and archive all posts from any user on X.com into a .txt file
// @author       wez
// @match        https://x.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512446/Archive%20All%20Xcom%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/512446/Archive%20All%20Xcom%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button to trigger the archiving process
    const archiveButton = document.createElement('button');
    archiveButton.textContent = 'Archive All Posts';
    archiveButton.style.position = 'fixed';
    archiveButton.style.top = '60px'; // Move button lower so it doesn't interfere
    archiveButton.style.right = '10px';
    archiveButton.style.zIndex = '10000';
    archiveButton.style.padding = '10px';
    archiveButton.style.backgroundColor = '#1DA1F2';
    archiveButton.style.color = '#ffffff';
    archiveButton.style.border = 'none';
    archiveButton.style.borderRadius = '5px';
    archiveButton.style.cursor = 'pointer';
    document.body.appendChild(archiveButton);

    let tweets = [];
    let isScrolling = false;

    // Function to collect tweets from the page
    const collectTweets = () => {
        const tweetElements = document.querySelectorAll('article div[lang]');
        tweetElements.forEach((tweet) => {
            const tweetText = tweet.innerText;
            if (tweetText) {
                const tweetTime = tweet.closest('article').querySelector('time').getAttribute('datetime');
                const tweetEntry = `${new Date(tweetTime).toLocaleString()}: ${tweetText}`;
                if (!tweets.includes(tweetEntry)) { // Avoid duplicates
                    tweets.push(tweetEntry);
                }
            }
        });
    };

    // Function to scroll the page and load more tweets
    const autoScroll = () => {
        window.scrollTo(0, document.body.scrollHeight); // Scroll to the bottom
        setTimeout(() => {
            collectTweets();
            if (!isScrolling) {
                downloadTweets(); // Download tweets when scrolling stops
            } else {
                autoScroll(); // Continue scrolling
            }
        }, 1500); // Adjust this delay if needed
    };

    // Function to download collected tweets as a .txt file
    const downloadTweets = () => {
        const blob = new Blob([tweets.join('\n\n')], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'archived_tweets.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        isScrolling = false; // Reset the scrolling flag
    };

    // Event listener to start archiving
    archiveButton.addEventListener('click', () => {
        isScrolling = true;
        autoScroll();

        // Stop scrolling after 60 seconds (adjust as necessary)
        setTimeout(() => {
            isScrolling = false;
        }, 60000);
    });
})();
