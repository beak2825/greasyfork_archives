// ==UserScript==
// @name         keep useful comments in old reddit
// @namespace    fiverr.com/web_coder_nsd
// @version      0.8
// @description  Remove extras in comment sections, remove AutoModerators, and show all comments
// @author       Noushad Bhuiyan
// @match        https://old.reddit.com/r/*
// @grant        none
// @icon         https://icons.iconarchive.com/icons/sicons/basic-round-social/256/reddit-icon.png
// @require      https://update.greasyfork.org/scripts/433051/Trusted-Types%20Helper.user.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481917/keep%20useful%20comments%20in%20old%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/481917/keep%20useful%20comments%20in%20old%20reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ignoredComments = ["[removed]", "[deleted]"]
    var triggerKey = "x"
    var selectors = {
        //clickMoreComments: ".nestedlisting > .morechildren .morecomments a",
        clickMoreComments: ".morecomments a",
        commentArea: ".commentarea",
        authorModerator: "a.moderator.author",
        comment: ".comment",
        paragraphs: ".commentarea .nestedlisting p",
    }

    var ignorePatterns = ["[–]", "[+]"];
    // Variable to keep track of whether Alt+X is pressed to stop clicking more comments
    var triggeredToStop = false;

    // Event listener for keydown event
    document.addEventListener("keydown", function(event) {
        // Check if Alt+X is pressed
        if (event.altKey && event.key.toLowerCase() === triggerKey) {
            triggeredToStop = true;
        }
    });

    // Event listener for keyup event
    document.addEventListener("keyup", function(event) {
        // Check if Alt key is released
        if (!event.altKey) {
            triggeredToStop = false;
        }
    });// Variable to keep track of whether Alt+X is pressed to stop clicking more comments

    // REMOVE THE AUTOMODERATORS
    function removeAutoModerators() {
        document.querySelectorAll(selectors.authorModerator).forEach(function(link) {
            var authorText = link.textContent.trim();

            // Check if the author text contains "AutoModerator"
            if (authorText.includes("AutoModerator")) {
                var commentElement = link.closest(selectors.comment);
                if (commentElement) {
                    commentElement.remove();
                }
            }
        });
    }

    // CLICK ON ALL MORE COMMENTS
    function clickMoreComments(elements) {
        if (elements.length === 0 || triggeredToStop) {
            // After clicking all more comments, remove AutoModerators and replace paragraphs
            removeAutoModerators();
            replaceParagraphs();
            return;
        }

        // Click the first element
        elements[0].click();

        // Wait for a short duration to allow the content to load (adjust as needed)
        setTimeout(function() {
            // Continue with the remaining elements
            clickMoreComments(Array.from(document.querySelectorAll(selectors.clickMoreComments)));
        }, 1200); // Adjust the timeout as needed
    }

    // PARAGRAPH REPLACER
    function replaceParagraphs() {

        var usefulHTML = "<p>";

        document.querySelectorAll(selectors.paragraphs).forEach(function(paragraph) {
            var paragraphText = paragraph.textContent;

            // Check if paragraphText contains any ignore pattern
            var ignoreParagraph = ignorePatterns.some(function(pattern) {
                return paragraphText.includes(pattern);
            });

            // Check if paragraphText contains any ignore comment
            var ignoredComment = ignoredComments.some(function(comment) {
                return paragraphText == comment;
            });

            if (!ignoreParagraph && !ignoredComment) {
                usefulHTML += paragraphText + "<br>";
            }
        });

        usefulHTML += "</p>";

        document.querySelector(selectors.commentArea).innerHTML = usefulHTML;
    }


    // Initial call to start the process
    clickMoreComments(Array.from(document.querySelectorAll(selectors.clickMoreComments)));

})();
