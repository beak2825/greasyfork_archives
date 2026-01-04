// ==UserScript==
// @name         Redirect Bing Search Videos to source video
// @namespace    https://bing.com
// @version      1.0
// @description  Redirect Bing Video search results (From Bing Search) directly to the source video
// @icon         https://www.bing.com/favicon.ico
// @match        https://www.bing.com/videos/search?q=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463370/Redirect%20Bing%20Search%20Videos%20to%20source%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/463370/Redirect%20Bing%20Search%20Videos%20to%20source%20video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirectToSource() {
        let source_elem = document.querySelector(".source");
        if (source_elem) {
            window.location.href = source_elem.href;
        } else {
            setTimeout(redirectToSource, 100); // try again after 100 ms
        }
    }

    redirectToSource();
})();