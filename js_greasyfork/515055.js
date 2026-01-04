// ==UserScript==
// @name         Google Colab Redirect Bypass
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Bypass redirect notice in Google Colab to access external links directly
// @author       kalin, ChatGPT
// @match        https://www.google.com/url?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515055/Google%20Colab%20Redirect%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/515055/Google%20Colab%20Redirect%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current page is the "Redirect Notice" page
    const isRedirectPage = () => {
        return document.title === 'Redirect Notice' && 
               document.body.innerHTML.includes('The previous page is sending you to');
    };

    // Jump to the target link automatically
    const redirectToTargetLink = () => {
        const linkElement = document.querySelectorAll('a[href^="http://"], a[href^="https://"]');
        if (linkElement.length > 0) {
            window.location.href = linkElement[0].href; // 自动跳转
        }
    };

    // Detect the change of the page
    const observer = new MutationObserver(() => {
        if (isRedirectPage()) {
            redirectToTargetLink();
        }
    });

    // Initialize the observation
    window.addEventListener('load', () => {
        if (isRedirectPage()) {
            redirectToTargetLink();
        }
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();