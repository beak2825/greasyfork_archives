// ==UserScript==
// @name         Save Video As
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Automatically right-clicks on videos and prompts you to select a location and rename the file based on the current selected heading for the course.
// @author       Austin
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460314/Save%20Video%20As.user.js
// @updateURL https://update.greasyfork.org/scripts/460314/Save%20Video%20As.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("contextmenu", function(e) {
        if (e.target.nodeName == "VIDEO") {
            e.preventDefault();
            var videoSrc = e.target.currentSrc;
            var heading = document.querySelector("h1, h2, h3, h4, h5, h6").textContent;
            var filename = heading + ".mp4";
            var link = document.createElement("a");
            link.href = videoSrc;
            link.download = filename;
            link.click();
        }
    }, false);
})();
