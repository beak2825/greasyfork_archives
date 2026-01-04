// ==UserScript==
// @name         Old Google Redirect Message Replacement
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces the old Google redirect message with a new one.
// @author       Your Name
// @match        https://vanced.neocities.org/2013*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470992/Old%20Google%20Redirect%20Message%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/470992/Old%20Google%20Redirect%20Message%20Replacement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const oldMessage = "You have been redirected to an old version of the search interface, since the new one is currently under development.";
    const newMessage = "Google Instant is unavailable. Press Enter to search.";
    const learnMoreLink = '<a href="/support/websearch/bin/answer.py?answer=186645&amp;form=bb&amp;hl=en">Learn more</a>';

    const messageSpan = document.querySelector('span.nbprs');
    if (messageSpan && messageSpan.innerText === oldMessage) {
        messageSpan.innerHTML = `${newMessage}&nbsp;${learnMoreLink}`;
    }
})();
