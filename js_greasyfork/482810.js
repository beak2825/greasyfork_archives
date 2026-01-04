// ==UserScript==
// @name         NoShorts
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  Removes Shorts block on YT
// @author       You
// @match        https://www.youtube.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482810/NoShorts.user.js
// @updateURL https://update.greasyfork.org/scripts/482810/NoShorts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide shorts
    function hideShorts() {
        let contents = document.querySelectorAll('#contents.style-scope.ytd-rich-shelf-renderer');
        contents.forEach((content) => {
            content.remove();
        });
    }

    // Call the function every 2 seconds to handle dynamic content loading
    setInterval(hideShorts, 2000);
})();