// ==UserScript==
// @name         Switch to "Following" TAB
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Switch to "Following" TAB on visiting twitter's home
// @author       You
// @match        https://twitter.com/
// @match        https://twitter.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458556/Switch%20to%20%22Following%22%20TAB.user.js
// @updateURL https://update.greasyfork.org/scripts/458556/Switch%20to%20%22Following%22%20TAB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const callback = (mutationsList, observer) => {
        const followingTabLink = document.querySelector('div[role=tablist] div[role=presentation]:nth-child(2) a');
        if (followingTabLink) {
            followingTabLink.click();
            observer.disconnect();
        }
    };
    const observer = new MutationObserver(callback);

    observer.observe(document.body, { childList: true, subtree: true });
})();