// ==UserScript==
// @name        Read More
// @namespace   https://github.com/DaBlower
// @match       https://www.reddit.com/*
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.2
// @author      DaBlower
// @license     GPL-3.0-only
// @description Automatically expand truncated comments and replies without clicking "read more"
// @downloadURL https://update.greasyfork.org/scripts/540267/Read%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/540267/Read%20More.meta.js
// ==/UserScript==

// for reddit and youtube (for now)

    function expandAll() {
        // expand replies in reddit
        document.querySelectorAll('button').forEach(function(btn) {
            const text = btn.innerText.trim().toLowerCase(); // gets the text in each button
            if (
                btn.offsetParent !== null && // is the button visible?
                (text.includes('more reply') || text.includes('more replies')) // does it contain more reply or more replies? (the text inside the expand button)
            ) {
                btn.click(); // click the button
            }

        });

        // expand truncated comments in youtube
        document.querySelectorAll('tp-yt-paper-button#more').forEach(function(btn){
            const text = btn.innerText.trim().toLowerCase();
            if (
                btn.offsetParent !== null &&
                text.includes('read more')
            ){
                btn.click();
            }
        });
    }
    setTimeout(expandAll, 2000);

    const observer = new MutationObserver(expandAll);

    observer.observe(document.body, {
        childList: true, // observe changes to children as well as document.body
        subtree: true // include non-immediate children
    });
