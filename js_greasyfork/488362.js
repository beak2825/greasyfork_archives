// ==UserScript==
// @name         SubscribeStar Ellipsify69
// @version      2024-04-12
// @description  Make the navigation easier.
// @namespace    https://greasyfork.org/users/1267336
// @author       ProtagNeptune
// @match        https://subscribestar.adult/*
// @match        https://www.subscribestar.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=subscribestar.adult
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488362/SubscribeStar%20Ellipsify69.user.js
// @updateURL https://update.greasyfork.org/scripts/488362/SubscribeStar%20Ellipsify69.meta.js
// ==/UserScript==

function ellipsify(str) {
    if (str.length > 69) {
        return str.substring(0, 69) + "...";
    } else {
        return str;
    }
}

function applyTruncation() {
    const currentUrl = window.location.href;
    const excludedPatterns = [
      'https://subscribestar.adult/chats/',
      'https://subscribestar.adult/posts/',
      'https://www.subscribestar.com/chats/',
      'https://www.subscribestar.com/posts/'
    ];
    if (!excludedPatterns.some(pattern => currentUrl.startsWith(pattern))) {
        const trixElements = document.querySelectorAll('.trix-content');
        trixElements.forEach((element) => {
            element.textContent = ellipsify(element.textContent);
        });
    }
}

// Call the function initially
applyTruncation();

// Repeat the function every three seconds
setInterval(applyTruncation, 3000); // 3000 milliseconds = 3 seconds