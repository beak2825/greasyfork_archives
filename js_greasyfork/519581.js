// ==UserScript==
// @name         YouTube Shorts Auto Commenter
// @namespace    https://github.com/yashu1wwww
// @version      1.6
// @description  Automatically posts comments on YouTube Shorts videos and refreshes other Shorts videos to post comments automatically
// @author       Yashawanth R
// @license      MIT
// @match        https://*.youtube.com/shorts/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/519581/YouTube%20Shorts%20Auto%20Commenter.user.js
// @updateURL https://update.greasyfork.org/scripts/519581/YouTube%20Shorts%20Auto%20Commenter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const commentsDict = [
        "super", "amazing one", "what a acting", "great video", "have a nice day",
        "keep going", "keep rocking", "all the best buddy", "next video please",
        "one of the best video everseen", "wonderful day", "great one seen today",
        "superb", "magnifying", "shared to my friends", "best thing in internet",
        "sensational video", "dashing", "marvelous", "next big video in internet",
        "always good content hits", "people will really liked these video",
        "good food have humans good", "all the best dude"
    ];

    let counter = 0;
    const MAX_COMMENTS = prompt("How many comments would you like to post?", 10); // User-defined comment limit

    function pauseVideoWhenReady() {
        const pauseButton = document.querySelector(
            '#play-pause-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill'
        );
        if (pauseButton) {
            pauseButton.click();
            console.log("Video paused");
            setTimeout(openCommentsSection, 2000);
        } else {
            console.log("Pause button not ready, retrying...");
            setTimeout(pauseVideoWhenReady, 500);
        }
    }

    function openCommentsSection() {
        const commentsButton = findElementByXPath(
            "/html/body/ytd-app/div[1]/ytd-page-manager/ytd-shorts/div[3]/div[2]/ytd-reel-video-renderer[1]/div[4]/ytd-reel-player-overlay-renderer/div[2]/div/div[2]/ytd-button-renderer/yt-button-shape/label/button/yt-touch-feedback-shape/div/div[2]"
        );
        if (commentsButton) {
            commentsButton.click();
            console.log("Comments section opened");
            setTimeout(clickCommentBox, 1000);
        } else {
            console.log("Comments button not ready, retrying...");
            setTimeout(openCommentsSection, 500);
        }
    }

    function findElementByXPath(xpath) {
        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        return result.singleNodeValue;
    }

    function clickCommentBox() {
        const commentBox = findElementByXPath(
            "//*[@id='simplebox-placeholder']"
        );
        if (commentBox) {
            commentBox.click();
            console.log("Comment box clicked");
            setTimeout(postComment, 2000); // Wait for 2 seconds before posting the comment
        } else {
            console.log("Comment box not found, retrying...");
            setTimeout(clickCommentBox, 1000);
        }
    }

    function postComment() {
        const inputBox = document.querySelector("#contenteditable-root");
        if (inputBox) {
            inputBox.textContent = commentsDict[Math.floor(Math.random() * commentsDict.length)];
            console.log("Comment added: ", inputBox.textContent);

            const submitButton = document.querySelector("#submit-button");
            if (submitButton) {
                submitButton.click();
                console.log("Comment posted");
                counter++;
                if (counter < MAX_COMMENTS) {
                    setTimeout(clickCommentBox, 6000); // Wait before posting the next comment
                } else {
                    console.log("Commenting limit reached");
                }
            } else {
                console.log("Submit button not found");
                setTimeout(postComment, 1000);
            }
        } else {
            console.log("Input box not found, retrying...");
            setTimeout(postComment, 1000);
        }
    }

    pauseVideoWhenReady();
})();
