// ==UserScript==
// @name         Scroll To Top/Bottom Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add buttons to scroll to top and bottom of page in the bottom right corner of the screen
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461812/Scroll%20To%20TopBottom%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/461812/Scroll%20To%20TopBottom%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if running in top-level document and not in an iframe
    if (window.self === window.top && !window.frameElement) {
        // Define the styles for the buttons
        var styles = `
            .scroll-to-btn {
                position: fixed;
                right: 20px;
                font-size: 50px;
                border: none;
                color: white;
                border-radius: 10%;
                cursor: pointer;
                z-index: 9999; /* set z-index to a high value */
                background-color: transparent;
                filter: grayscale(90%);
                /* transform: rotateX(30deg)  translateZ(50px) ;*/
            }
            .scroll-to-btn.top {
                bottom: 95px;
            }
            .scroll-to-btn.bottom {
                bottom: 40px;
            }
        `;

        // Add the styles to the page
        GM_addStyle(styles);

        // Create the scroll to top button
        var scrollToTopBtn = document.createElement("button");
        scrollToTopBtn.innerText = "🔼";
        scrollToTopBtn.classList.add("scroll-to-btn", "top");
        scrollToTopBtn.addEventListener("click", function() {
            window.scrollTo({top: 0, behavior: 'smooth',timingFunction: 'cubic-bezier(0,.84,.49,.99)'});
        });

        // Create the scroll to bottom button
        var scrollToBottomBtn = document.createElement("button");
        scrollToBottomBtn.innerText = "🔽";
        scrollToBottomBtn.classList.add("scroll-to-btn", "bottom");
        scrollToBottomBtn.addEventListener("click", function() {
            window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth',timingFunction: 'cubic-bezier(0,.84,.49,.99)'});
        });

        // Add the buttons to the page
        document.body.appendChild(scrollToTopBtn);
        document.body.appendChild(scrollToBottomBtn);
    }
})();
