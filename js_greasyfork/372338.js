// ==UserScript==
// @name         Remove Youtube's popup
// @version      0.4
// @description  Script to remove the popup that randomly shows when watching videos in their site
// @author       Vingyard
// @include      /youtube.com/
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/372338/Remove%20Youtube%27s%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/372338/Remove%20Youtube%27s%20popup.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let interval

    function getAdsChecker() {
        return setInterval(() => {
            const elements = document.getElementsByClassName("style-scope yt-button-renderer style-blue-text size-default")
            if (elements.length > 2) {
                elements[elements.length-1].click();
            }
        }, 1000);
    }

    document.addEventListener("yt-navigate-finish", function(...params) {
        if (interval) clearInterval(interval)
        interval = getAdsChecker()
    })
})();