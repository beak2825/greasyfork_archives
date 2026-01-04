// ==UserScript==
// @name         CSSTricks Clear Display
// @namespace    http://css-tricks.com/
// @version      0.1
// @description  CSSTricks block add and clear display
// @author       AIUSoft
// @match        https://css-tricks.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425120/CSSTricks%20Clear%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/425120/CSSTricks%20Clear%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('.articles-and-sidebar').style="grid-template-columns: minmax(0,1fr);padding: 10%;"
    // Your code here...
})();