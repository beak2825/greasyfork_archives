// ==UserScript==
// @name         Visible Copy Confirmation Feedback
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Provides a visual feedback when you copy text using Ctrl+C.
// @author       Donff Roodus
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539019/Visible%20Copy%20Confirmation%20Feedback.user.js
// @updateURL https://update.greasyfork.org/scripts/539019/Visible%20Copy%20Confirmation%20Feedback.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'c') {
            showCopyFeedback();
        }
    });

    function showCopyFeedback() {
        // Create the feedback element
        let feedbackElement = document.createElement('div');
        feedbackElement.textContent = 'Copied to clipboard!';
        document.body.appendChild(feedbackElement);

        // Style the feedback element
        Object.assign(feedbackElement.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '15px',
            borderRadius: '5px',
            zIndex: '9999',
            fontSize: '16px',
            opacity: '0',
            transition: 'opacity 0.5s'
        });

        // Animate the feedback
        setTimeout(() => {
            feedbackElement.style.opacity = '1';
        }, 10);

        // Remove the feedback element after a few seconds
        setTimeout(() => {
            feedbackElement.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(feedbackElement);
            }, 500);
        }, 2000);
    }
})();