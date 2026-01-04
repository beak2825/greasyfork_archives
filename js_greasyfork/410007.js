// ==UserScript==
// @name         3 previews on Jstris
// @namespace    3 previews on Jstris
// @version      0.3
// @description  Makes you have 3 previews on Jstris. Assumes you would have 5 previews without this
// @author       TSTman
// @match        https://jstris.jezevec10.com/*?play=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410007/3%20previews%20on%20Jstris.user.js
// @updateURL https://update.greasyfork.org/scripts/410007/3%20previews%20on%20Jstris.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let currentPreviews = 5;
    let desiredPreviews = 3;
    document.querySelector('#queueCanvas').height *= desiredPreviews / currentPreviews;
})();