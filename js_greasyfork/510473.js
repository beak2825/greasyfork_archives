// ==UserScript==
// @name Left-handed Stumblechat
// @namespace https://greasyfork.org/en/users/1244737
// @version 1.4
// @description Makes the messages only use 1 line and sets chat div position to fixed with bottom-left alignment.
// @author meklin and robomoist
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://stumblechat.com/room/*
// @downloadURL https://update.greasyfork.org/scripts/510473/Left-handed%20Stumblechat.user.js
// @updateURL https://update.greasyfork.org/scripts/510473/Left-handed%20Stumblechat.meta.js
// ==/UserScript==

(function() {
    let css = `
        .message .nickname ~ .content {
            display: inline-block;
            top: -7px;
            position: relative;
            margin-left: 2px;
            margin-right: 1em;
        }
        .content + .content {
            display: inline-block!important;
            margin-right: 1em;
        }
        .message .nickname ~ .content span {
            line-height: 1.5em;
        }
        #chat-wrapper {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 250px !important;
            height: 100% !important;
            z-index: 9999 !important;
            display: block !important;
        }
        #videos {
            left: 250px !important;
        }
        #userlist {
            position: fixed !important;
            top: 0 !important; /* Align it to the top */
            right: 0 !important; /* Fix it to the right */
            width: 210px !important; /* Adjust width as needed */
            height: 100% !important; /* Full height */
            z-index: 9998 !important; /* Make sure it stays above other elements */
            overflow-y: auto !important; /* Scroll if needed */
        }
        sc-chat {
            z-index: 1 !important; /* Set the z-index to 1 */
            position: relative !important; /* Ensuring it doesn't float above */
        }
    `;

    // Apply CSS when the page loads
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }

    // Optional: Use MutationObserver to detect dynamic loading of the sc-chat element
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (document.querySelector('sc-chat #chat-wrapper')) {
                GM_addStyle(css);
                observer.disconnect(); // Stop observing once the changes are applied
            }
        });
    });

    // Observe the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
