// ==UserScript==
// @name         bing video
// @description  Inject custom CSS into webpages
// @match    https://www.bing.com/videos/search?*
// @version 0.0.1.20250530150717
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/537765/bing%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/537765/bing%20video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        * {
            min-width: unset !important;
        }

        .vm_res * {
    height: unset !important;
    width: unset !important;
    white-space: unset !important;
    overflow: unset !important;
    text-overflow: unset !important;
    display: unset !important;
    position: unset !important;
    /* all: unset !important; */
    padding: unset !important;
    margin: unset !important;
    aspect-ratio: unset !important;
}
    `;
    document.head.appendChild(style);
})();