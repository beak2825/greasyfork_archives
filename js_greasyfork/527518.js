// ==UserScript==
// @name         (改)Scroll To Top/Bottom Button
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add buttons to scroll to top and bottom of page in the bottom right corner of the screen
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// 修改自         https://greasyfork.org/zh-CN/scripts/461812-scroll-to-top-bottom-button
// @downloadURL https://update.greasyfork.org/scripts/527518/%28%E6%94%B9%29Scroll%20To%20TopBottom%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/527518/%28%E6%94%B9%29Scroll%20To%20TopBottom%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self === window.top && !window.frameElement) {
        var styles = `
            .scroll-to-btn {
                position: fixed;
                right: 20px;
                font-size: 50px;
                border: none;
                color: white;
                border-radius: 10%;
                cursor: pointer;
                z-index: 9999;
                background-color: transparent;
                filter: grayscale(90%);
            }
            .scroll-to-btn.top {
                bottom: calc(50% + 30px); /* Center vertically */
            }
            .scroll-to-btn.bottom {
                bottom: calc(50% - 30px); /* Center vertically */
            }
        `;

        GM_addStyle(styles);

        var scrollToTopBtn = document.createElement("button");
        scrollToTopBtn.innerText = "🔼";
        scrollToTopBtn.classList.add("scroll-to-btn", "top");
        scrollToTopBtn.addEventListener("click", function() {
            window.scrollTo({top: 0, behavior: 'auto'});
        });

        var scrollToBottomBtn = document.createElement("button");
        scrollToBottomBtn.innerText = "🔽";
        scrollToBottomBtn.classList.add("scroll-to-btn", "bottom");
        scrollToBottomBtn.addEventListener("click", function() {
            window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth',timingFunction: 'cubic-bezier(0,.84,.49,.99)'});
        });

        document.body.appendChild(scrollToTopBtn);
        document.body.appendChild(scrollToBottomBtn);
    }
})();