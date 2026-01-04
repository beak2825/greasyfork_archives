// ==UserScript==
// @name        ChatGPT adjust height of source bar
// @match       https://chatgpt.com/*
// @description Sets height to revert on the first span ancestor of path elements with specific d attribute
// @version 0.0.1.20250718195752
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/542921/ChatGPT%20adjust%20height%20of%20source%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/542921/ChatGPT%20adjust%20height%20of%20source%20bar.meta.js
// ==/UserScript==

function setSpanHeight() {
    const pathElements = document.querySelectorAll('path[d^="M14.0857 8.74999C14.0857 5.80355"]');
    pathElements.forEach(pathElement => {
        let currentElement = pathElement;
        while (currentElement && currentElement.tagName.toLowerCase() !== 'span') {
            currentElement = currentElement.parentElement;
        }
        if (currentElement) {
            currentElement.style.setProperty('height', 'revert', 'important');
        }
    });
}

const observer = new MutationObserver(setSpanHeight);
observer.observe(document.body, { childList: true, subtree: true });
setSpanHeight();