// ==UserScript==
// @name         LinkedIn Cleaner
// @namespace    http://tampermonkey.net/
// @version      2024-03-10
// @description  Only show actual posts on your feed and not likes / comments / reposts.
// @author       You
// @match        https://www.linkedin.com/
// @match        https://www.linkedin.com/feed/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489189/LinkedIn%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/489189/LinkedIn%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let observer = null;

    function is_a_match(element_text) {
        if (element_text.endsWith('celebrates this') ||
            element_text.endsWith('finds this insightful') ||
            element_text.endsWith('Suggested') ||
            element_text.endsWith('loves this') ||
            element_text.endsWith('supported this') ||
            element_text.endsWith('reposted this') ||
            element_text.endsWith('likes this')) {
            return true;
        } else {
            return false;
        }
    }

    function cleanup_feed_skips() {
        let post_headers = document.getElementsByClassName("update-components-header__text-wrapper");
        for (let i = 0; i < post_headers.length; i++) {
            if (is_a_match(post_headers[i].innerText)) {
                post_headers[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
            }
        }
    }

    function cleanup() {
        cleanup_feed_skips();
    }

    function startObserver() {
        observer = new MutationObserver(mutations => {
            for(let mutation of mutations) {
                if ((mutation.target.className === 'relative') || (mutation.target.className == 'visually-hidden')) {
                    cleanup();
                }
            }
        });

        observer.observe(document.querySelector('[aria-label="Main Feed"]'), {childList: true, subtree: true});
        cleanup();
    }


    window.onload = () => {
        setTimeout(() => {
            startObserver();
        }, 1000);
    }
})();