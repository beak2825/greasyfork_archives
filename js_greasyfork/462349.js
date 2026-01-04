// ==UserScript==
// @name         GitHub: Hide "Following" button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide "Following" feed button on GitHub
// @author       Maciek Sitkowski
// @match        https://github.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462349/GitHub%3A%20Hide%20%22Following%22%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/462349/GitHub%3A%20Hide%20%22Following%22%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('#feed-original')?.parentElement?.remove();
})();