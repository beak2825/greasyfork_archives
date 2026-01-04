// ==UserScript==
// @name         Reiwo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  attempt to make Weibo comments red, instead of orange
// @author       mastadonna233
// @match        https://weibo.com/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480611/Reiwo.user.js
// @updateURL https://update.greasyfork.org/scripts/480611/Reiwo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var comments = document.querySelectorAll('.W_comment');
    
    // Loop through all comment elements
    comments.forEach(function(comment) {
        // Add a new CSS class to the comment element
        comment.classList.add('red-comment');
    });
})();