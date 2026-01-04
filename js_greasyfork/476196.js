// ==UserScript==
// @name         X (Twitter) - Default "Following" tab
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect to "Following" tab on x.com (twitter.com) by default
// @author       Yoshin
// @match        https://x.com
// @match        https://x.com/home
// @match        https://twitter.com
// @match        https://twitter.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476196/X%20%28Twitter%29%20-%20Default%20%22Following%22%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/476196/X%20%28Twitter%29%20-%20Default%20%22Following%22%20tab.meta.js
// ==/UserScript==

/* jshint esversion:11 */

// Multiple language name of the second X (Twitter) tab
const followingTabNames = ['Following', 'Abonnements'];

(function() {
    'use strict';

    new MutationObserver(() => {
        const navBarLinks = document.querySelectorAll('a[href="/home"][role="tab"]');
        if (navBarLinks.length) {
            try {
                const followingButton = Array.from(navBarLinks)?.find(e => followingTabNames.includes(e?.innerText));
                followingButton?.click();
            } catch(err) {
                console.error('Twitter - Default "Following" tab error : ', err);
            } finally {
                this.disconnect();
            }
        }
    }).observe(document);
})();