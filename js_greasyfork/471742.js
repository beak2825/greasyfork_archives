// ==UserScript==
// @name         Fix X button
// @namespace    https://twitter.com/
// @version      1.1
// @description  Fixes the faulty new X button
// @author       You
// @match        https://twitter.com/
// @match        https://*.twitter.com/
// @match        https://twitter.com/*
// @match        https://*.twitter.com/*
// @match        https://x.com/
// @match        https://*.x.com/
// @match        https://x.com/*
// @match        https://*.x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        window.close
// @license      JSON
// @downloadURL https://update.greasyfork.org/scripts/471742/Fix%20X%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/471742/Fix%20X%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const closeTab = () => {
        // in case window.close doesn't work, we need to have a fallback
        document.head.innerHTML = "<style>body { color: orange; background: black }</style>"
        document.body.innerHTML = "It's now safe to turn off your computer."

        // close the tab
        window.close()
    }

    const fixSvgElement = (v) => {
        if(v.innerHTML.includes("M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z")) { // filter to the X button
            v.style.cursor = "pointer";
            v.onclick = closeTab
        }
    }
    const observer = new MutationObserver(mutations => {
        Array.from(document.getElementsByTagName("svg")).forEach(fixSvgElement);
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

    Array.from(document.getElementsByTagName("svg")).forEach(fixSvgElement);
})();