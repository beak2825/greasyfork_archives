// ==UserScript==
// @name         פייער תגובה - איינס צוויי דריי אשכול
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Automatic remove "new incoming post" when submitting post, in the time-critical 12:34 topic
// @author       קו הישר
// @match        *://*.ivelt.com/forum/viewtopic.php*
// @match        *://*.ivelt.com/forum/posting.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429760/%D7%A4%D7%99%D7%99%D7%A2%D7%A8%20%D7%AA%D7%92%D7%95%D7%91%D7%94%20-%20%D7%90%D7%99%D7%99%D7%A0%D7%A1%20%D7%A6%D7%95%D7%95%D7%99%D7%99%20%D7%93%D7%A8%D7%99%D7%99%20%D7%90%D7%A9%D7%9B%D7%95%D7%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/429760/%D7%A4%D7%99%D7%99%D7%A2%D7%A8%20%D7%AA%D7%92%D7%95%D7%91%D7%94%20-%20%D7%90%D7%99%D7%99%D7%A0%D7%A1%20%D7%A6%D7%95%D7%95%D7%99%D7%99%20%D7%93%D7%A8%D7%99%D7%99%20%D7%90%D7%A9%D7%9B%D7%95%D7%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the topic title is "איינס, צוויי, דריי, פיר"
    function isCorrectTopicTitle() {
        var topicTitleElement = document.querySelector('.topic-title a');
        return topicTitleElement && topicTitleElement.textContent.trim() === 'איינס, צוויי, דריי, פיר';
    }

    if (isCorrectTopicTitle()) {
        // Select the submit button container
        var submitButtonsContainer = document.getElementsByClassName('submit-buttons')[0];
        // Select the 'topic_cur_post_id' input element
        var topicCurPostIdElement = document.getElementsByName('topic_cur_post_id')[0];
        
        // Remove the 'topic_cur_post_id' element if both elements are found
        if (submitButtonsContainer && topicCurPostIdElement) {
            submitButtonsContainer.removeChild(topicCurPostIdElement);
        }
    }
})();