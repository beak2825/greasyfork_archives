// ==UserScript==
// @name        CSS Helper - URL Attribute Adder
// @description Adds a custom attribute (url-url) to all body tags, to make it easier for CSS extensions to target specific URL's.
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      Jupiter Liar
// @license     Attribution CC BY
// @description 8/26/2023, 5:09:26 AM
// @downloadURL https://update.greasyfork.org/scripts/473931/CSS%20Helper%20-%20URL%20Attribute%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/473931/CSS%20Helper%20-%20URL%20Attribute%20Adder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set the URL attribute on the body tag
    function setUrlAttribute() {
        document.body.setAttribute('url-url', window.location.href);
    }

    // Initial setup
    setUrlAttribute();

    // Watch for URL changes using MutationObserver on the body tag
    const observer = new MutationObserver(() => {
        setUrlAttribute();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Watch for popstate event to capture back/forward navigation
    window.addEventListener('popstate', setUrlAttribute);

    // Watch for changes in pushState/replaceState to capture dynamic URL changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
        const result = originalPushState.apply(this, args);
        setUrlAttribute();
        return result;
    };

    history.replaceState = function(...args) {
        const result = originalReplaceState.apply(this, args);
        setUrlAttribute();
        return result;
    };
})();