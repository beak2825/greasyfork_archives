// ==UserScript==
// @name         URL Page Navigator
// @version      1.2
// @description  Increment or decrement an integer value in the URL with keyboard shortcuts to go next page or previous page
// @grant        none
// @match        *://*/*
// @license      MIT
// @namespace https://greasyfork.org/users/875241
// @downloadURL https://update.greasyfork.org/scripts/473936/URL%20Page%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/473936/URL%20Page%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function incrementIntegerValue(url) {
        const regex = /(\d+)(?!.*\d)/;
        const match = url.match(regex);
        if (match) {
            const number = parseInt(match[0], 10);
            const incrementedNumber = number + 1;
            return url.replace(regex, incrementedNumber);
        }
        return url;
    }

    function decrementIntegerValue(url) {
        const regex = /(\d+)(?!.*\d)/;
        const match = url.match(regex);
        if (match) {
            const number = parseInt(match[0], 10);
            const decrementedNumber = number - 1;
            return url.replace(regex, decrementedNumber);
        }
        return url;
    }

    function handleShortcut(event) {
        if (event.altKey && event.key === 'k') {
            event.preventDefault();
            const currentUrl = window.location.href;
            const incrementedUrl = incrementIntegerValue(currentUrl);
            if (incrementedUrl !== currentUrl) {
                window.location.href = incrementedUrl;
            }
        } else if (event.altKey && event.key === 'l') {
            event.preventDefault();
            const currentUrl = window.location.href;
            const decrementedUrl = decrementIntegerValue(currentUrl);
            if (decrementedUrl !== currentUrl) {
                window.location.href = decrementedUrl;
            }
        }
    }

    document.addEventListener('keydown', handleShortcut);
})();
