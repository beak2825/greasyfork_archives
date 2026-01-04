// ==UserScript==
// @name         Twitter Auto Comment, Retweet & Like Bot
// @version      1.3
// @description  Automatically comments, retweets, and likes tweets on Twitter using random comments for a account & hashtag.
// @author       Your Name
// @match        *://twitter.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/en/users/your-username
// @downloadURL https://update.greasyfork.org/scripts/528951/Twitter%20Auto%20Comment%2C%20Retweet%20%20Like%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/528951/Twitter%20Auto%20Comment%2C%20Retweet%20%20Like%20Bot.meta.js
// ==/UserScript==

(async function() {
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    let commentsDict = [
        'good', 'amazing one', 'keep going', 'excellent', 'next video please', 'sub to your channel',
        'shared to others', 'made my day', 'keep it up', 'sensational', 'rock it', 'challenge it',
        'post video daily', 'work was amazing', 'needed more edit', 'edit was awesome', 'what a video man',
        'watched yesterday', 'you are genius', 'faster than light', 'your work needed success', 'new fan of you',
        'keep rocking dude', 'copy cat', 'link the video', 'listening', 'writing', 'reading', 'playing'
    ];

    while (true) {
        try {
            let tweets = document.querySelectorAll('[data-testid="tweet"]');

            for (let tweet of tweets) {
                try {
                    // Step 1: Comment on the tweet
                    let replyButton = tweet.querySelector('[data-testid="reply"]');
                    if (replyButton) {
                        replyButton.click();
                        await delay(2000);

                        let commentBox = document.querySelector('.public-DraftStyleDefault-ltr');
                        if (commentBox) {
                            let randomComment = commentsDict[Math.floor(Math.random() * commentsDict.length)];
                            commentBox.innerText = randomComment;
                            console.log("Entered comment:", randomComment);
                            await delay(2000);

                            // Click the reply button
                            let tweetButton = document.querySelector('[data-testid="tweetButtonInline"]');
                            if (tweetButton) {
                                tweetButton.click();
                                console.log("Comment posted!");
                                await delay(3000);
                            }
                        }

                        // Close reply modal
                        let closeButton = document.querySelector('[aria-label="Close"]');
                        if (closeButton) {
                            closeButton.click();
                            await delay(2000);
                        }
                    }

                    // Step 2: Retweet the tweet
                    let retweetButton = tweet.querySelector('[data-testid="retweet"]');
                    if (retweetButton) {
                        retweetButton.click();
                        await delay(1000);

                        let confirmRetweet = document.querySelector('[data-testid="retweetConfirm"]');
                        if (confirmRetweet) {
                            confirmRetweet.click();
                            console.log("Retweeted the tweet!");
                            await delay(2000);
                        }
                    }

                    // Step 3: Like the tweet
                    let likeButton = tweet.querySelector('[data-testid="like"]');
                    if (likeButton && !likeButton.getAttribute("aria-pressed")) {
                        likeButton.click();
                        console.log("Liked the tweet!");
                        await delay(2000);
                    }

                } catch (error) {
                    console.log("Error processing a tweet:", error);
                }
            }

            // Step 4: Scroll down to load more tweets
            window.scrollBy(0, window.innerHeight);
            console.log("Scrolling down...");
            await delay(5000);

        } catch (error) {
            console.error("An error occurred:", error);
            break;
        }
    }
})();
