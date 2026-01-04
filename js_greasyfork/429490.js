// ==UserScript==
// @name         Hide Youtube homepage recommendations and tags
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Hide Youtube homepage recommendations and the top bar with tags showing the video categories/types
// @author       babyrager
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @include https://youtube.com/
// @include https://www.youtube.com/
// @downloadURL https://update.greasyfork.org/scripts/429490/Hide%20Youtube%20homepage%20recommendations%20and%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/429490/Hide%20Youtube%20homepage%20recommendations%20and%20tags.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('contents').style.display = 'none';
    document.querySelector('.ytd-feed-filter-chip-bar-renderer').style.display = 'none';
})();