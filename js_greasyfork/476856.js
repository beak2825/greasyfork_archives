// ==UserScript==
// @name         Content Time Estimator
// @namespace    http://yournamespace.com/
// @version      0.2
// @description  Estimate reading time for content.
// @author       icycoldveins
// @include      *://*/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476856/Content%20Time%20Estimator.user.js
// @updateURL https://update.greasyfork.org/scripts/476856/Content%20Time%20Estimator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Style for the reading time box
    GM_addStyle(`
        #reading-time-box {
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 5px 10px;
            background-color: #000;
            color: #FFF;
            border-radius: 5px;
            font-size: 14px;
            z-index: 10000;
            display: none;
        }
    `);

    const estimateReadingTime = () => {
        // Grab all the paragraphs on the page
        let paragraphs = document.querySelectorAll('p');
        let totalWords = 0;

        paragraphs.forEach(paragraph => {
            totalWords += paragraph.innerText.split(' ').length;
        });

        // Average reading speed is roughly 200-250 words per minute
        let readingTime = Math.ceil(totalWords / 225);
        return readingTime;
    };

    const displayReadingTime = () => {
        let readingTime = estimateReadingTime();

        if (readingTime > 1) { // Show the estimator only if reading time is more than a minute
            let timeBox = document.createElement('div');
            timeBox.id = 'reading-time-box';
            timeBox.innerHTML = `Estimated Reading Time: ${readingTime} mins`;
            document.body.appendChild(timeBox);
            timeBox.style.display = 'block';
        }
    };

    window.addEventListener('load', displayReadingTime);

})();
