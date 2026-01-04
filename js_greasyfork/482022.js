// ==UserScript==
// @name         🤖IMYAI网站自动签到
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  打开网页后等待2秒自动签到，签到完成后自动关闭签到对话框和公告栏。Automate sign-in with a 2-second delay after page load and automatically close the sign-in dialog after sign-in.
// @author       GPT4.0
// @match        https://ai.imyai.top/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482022/%F0%9F%A4%96IMYAI%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/482022/%F0%9F%A4%96IMYAI%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to simulate a mouse click
    function simulateClick(target) {
        if (target) {
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            target.dispatchEvent(clickEvent);
        }
    }

    // Function to find a button with a particular SVG path
    function findButtonBySVGPath(svgPathD) {
        const svgPaths = document.querySelectorAll('button svg path');
        for (let path of svgPaths) {
            if (path.getAttribute('d').includes(svgPathD)) {
                return path.closest('button');
            }
        }
        return null;
    }

    // Function to perform the sequence of actions
    function performCheckInSequence() {
        // Function to locate the button by its unique SVG path (for the first button)
        function findFirstButtonBySVGPath() {
            const svgPaths = document.querySelectorAll('svg path');
            for (let path of svgPaths) {
                if (path.getAttribute('d').includes('M16.4 31.73')) {
                    return path.closest('svg');
                }
            }
            return null;
        }

        // Function to locate the second button by its text content
        function findSecondButtonByText() {
            const buttons = document.querySelectorAll('button');
            for (let button of buttons) {
                if (button.textContent.includes('今日尚未签到、点击签到')) {
                    return button;
                }
            }
            return null;
        }

        // Locate the first button and click it
        const firstButton = findFirstButtonBySVGPath();
        simulateClick(firstButton);

        // Set a timeout to click the second button after 2 seconds
        setTimeout(function() {
            const secondButton = findSecondButtonByText();
            simulateClick(secondButton);

            // After clicking the second button, wait 1 second and then click the close button of the check-in box
            setTimeout(function() {
                const closeButton = findButtonBySVGPath('M2.08859116,2.2156945');
                simulateClick(closeButton);

                // After closing the check-in box, wait 1 second and then click the close button of the announcement
                setTimeout(function() {
                    const announcementCloseButton = findButtonBySVGPath('M2.08859116,2.2156945');
                    simulateClick(announcementCloseButton);
                }, 500); // 0.5 second delay to close the announcement

            }, 500); // 0.5 second delay to click the close button of the check-in box

        }, 1000); // 1 second delay to click the second button
    }

    // Wait for 2 seconds after the page loads, then perform the check-in sequence
    setTimeout(performCheckInSequence, 2000); // 2 second initial delay after page load
})();