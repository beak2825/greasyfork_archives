// ==UserScript==
// @name         Quip comments only
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Hide non-commentary edits from the conversation sidebar on Quip pages
// @author       leorolim@
// @match        https://*quip-amazon.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/411410/Quip%20comments%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/411410/Quip%20comments%20only.meta.js
// ==/UserScript==

// ---------------------------------------------
// Made on 2020-09-15 by Leo Rolim
// ---------------------------------------------

// Goal: Remove non-comment items from conversation sidebar
// I haven't tested much, but you can try using the JavaScript code below on Chrome:
// 1. Open the comments tab and scroll up as far as possible.
// 2. Open DevTools (right click "Inspect" or Ctrl+Shift+I/Command+Option+I)
// 3. Find the Console (should be on lower bottom of the DevTools, sometimes it's hidden)
// 4. Paste and run the code in function hide_non_comment_threads_on_sidebar() below on the Console.
// 5. If more edits appear, you can just run it again as needed.


(function() {
    'use strict';

    function hide_non_comment_threads_on_sidebar() {


        // Optional: remove articles with edit summaries
        var diffArticles = document.getElementsByClassName('thread-message diff reactable-document-message');

        if(diffArticles.length > 0) {
            for (var index2 = diffArticles.length - 1; index2 != 0 ; index2--) {
                diffArticles[index2].remove();
            }
        }

        var diffDivs = document.querySelectorAll('div[class^="thread-message"]');

        if(diffDivs.length > 0) {
            for (var index = diffDivs.length - 1; index != 0; index--) {
                var divToReview = diffDivs[index];

                if(!(["thread-message clickable comment message","thread-message-list-watermark thread-message-day-marker chat-line", "thread-message-snippet", "thread-message-picture-body","thread-message-quote thread-message-comment-quote","thread-message-quote","thread-message-comment-quote",		 "thread-message-condensed-count", "thread-message-reply-link","thread-message-comment","thread-message-content","thread-message-body-content","thread-message-body","thread-message-picture-wrapper","thread-message-picture","thread-message-document-body","thread-message-document-body no-fade theme-5"].includes(divToReview.className) )) 	{
                    divToReview.remove();
                }
            }
        }
    }
    hide_non_comment_threads_on_sidebar();

    //var navPath = document.querySelector('div[class^="nav-path_nav-path-thread"'); //nav-path nav-path-thread
    var chatTitle = document.querySelectorAll('div[class^="document-chat-title"');


    //for (var i1 = 0; i1 != navPath.length; i1++) {
    //    navPath[i1].addEventListener('click',hide_non_comment_threads_on_sidebar, false);
    //}

    for (var i2 = 0; i2 != chatTitle.length; i2++) {
       chatTitle[i2].addEventListener('click',hide_non_comment_threads_on_sidebar, false);
    }

})();
