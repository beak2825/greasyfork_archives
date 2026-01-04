// ==UserScript==
// @name         圈吧屏蔽挖坟帖
// @namespace    http://tampermonkey.net/
// @version      2025.07.18
// @description  百度贴吧：oricon吧 屏蔽挖坟贴
// @author       Gemini-x3c
// @match        https://tieba.baidu.com/f?kw=oricon*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @license      MIT
// @homepageURL  https://greasyfork.org/zh-CN/scripts/542924-%E5%9C%88%E5%90%A7%E5%B1%8F%E8%94%BD%E6%8C%96%E5%9D%9F%E5%B8%96
// @downloadURL https://update.greasyfork.org/scripts/542924/%E5%9C%88%E5%90%A7%E5%B1%8F%E8%94%BD%E6%8C%96%E5%9D%9F%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/542924/%E5%9C%88%E5%90%A7%E5%B1%8F%E8%94%BD%E6%8C%96%E5%9D%9F%E5%B8%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hidePosts() {
        // Select all thread containers. The class name may vary, so we use a selector that is more likely to work.
        // After inspection, 'j_thread_list' seems to be the right class for the li elements.
        var threads = document.querySelectorAll('li.j_thread_list');

        threads.forEach(function(thread) {
            // Find the last reply time element within each thread.
            // The class name 'threadlist_reply_date' is a good candidate.
            var replyTimeElement = thread.querySelector('.threadlist_reply_date');

            if (replyTimeElement) {
                var replyTimeText = replyTimeElement.textContent.trim();

                // Use a regular expression to check if the text is in the "MM-DD" format.
                // This regex matches one or two digits, a hyphen, and then one or two digits.
                var datePattern = /^\d{1,2}-\d{1,2}$/;

                if (datePattern.test(replyTimeText)) {
                    // If the reply time is a date, hide the entire thread.
                    thread.style.display = 'none';
                }
            }
        });
    }

    // Run the function to hide posts when the page loads.
    hidePosts();

    // Tieba pages often load more content dynamically, so we need to handle that.
    // We can use a MutationObserver to watch for changes in the DOM and rerun our function.
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                hidePosts();
            }
        });
    });

    // Start observing the main content area for changes.
    var targetNode = document.getElementById('thread_list');
    if (targetNode) {
        observer.observe(targetNode, { childList: true });
    }
})();