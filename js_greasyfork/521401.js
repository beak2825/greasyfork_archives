// ==UserScript==
// @name        Xoul AI True black Mobile
// @author      LuxTallis
// @namespace   Xoul AI True black Mobile
// @match       https://xoul.ai/*
// @grant       none
// @license     MIT
// @version     1.0
// @description Black theme for xoul.ai mobile
// @icon        https://i.imgur.com/REqi6Iw.png
// @downloadURL https://update.greasyfork.org/scripts/521401/Xoul%20AI%20True%20black%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/521401/Xoul%20AI%20True%20black%20Mobile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait until the page is fully loaded to apply the styles
    window.addEventListener('load', function() {
        // Apply the custom styles to hide the borders of the elements
        const style = document.createElement('style');
        style.textContent = `
            /* Remove borders for ChatBubble left */
            #chat-container > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) .ChatBubble_left__ZhCrR body[data-theme="dark"] .ChatBubble_bubble__Zsfxg::before,
            body[data-theme="dark"] .ChatBubble_focused_message_bot__PHyy1::before,
            body[data-theme="dark"] .ChatBubble_left__ZhCrR .ChatBubble_bubble__Zsfxg::before {
                border-right: none !important;
            }

            /* Remove borders for ChatBubble right */
            .ChatBubble_right__58fYr > div:nth-child(1) > div:nth-child(1) .ChatBubble_right__58fYr body[data-theme="dark"] .ChatBubble_bubble__Zsfxg::before,
            body[data-theme="dark"] .ChatBubble_focused_message_user__Hd6Zk::before,
            body[data-theme="dark"] .ChatBubble_right__58fYr .ChatBubble_bubble__Zsfxg::before {
                border-left: none !important;
            }

            /* Remove borders when editing */
            .ChatBubble_bubble--editing___Go70 .ChatBubble_left__ZhCrR body[data-theme="dark"] .ChatBubble_bubble__Zsfxg::before,
            body[data-theme="dark"] .ChatBubble_focused_message_bot__PHyy1::before,
            body[data-theme="dark"] .ChatBubble_left__ZhCrR .ChatBubble_bubble__Zsfxg::before {
                border-right: none !important;
            }

            .ChatBubble_bubble--editing___Go70 .ChatBubble_right__58fYr body[data-theme="dark"] .ChatBubble_bubble__Zsfxg::before,
            body[data-theme="dark"] .ChatBubble_focused_message_user__Hd6Zk::before,
            body[data-theme="dark"] .ChatBubble_right__58fYr .ChatBubble_bubble__Zsfxg::before {
                border-left: none !important;
            }
        `;
        document.head.appendChild(style);
    });
})();
