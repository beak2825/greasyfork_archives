// ==UserScript==
// @name         r/MtF link fixer
// @namespace    tech.myip.jess.mtflink
// @version      0.1
// @description  Switch all links to "r/MtF" on reddit to r/MtF/new
// @author       BecomingJess
// @match        https://www.reddit.com/r/MtF/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36293/rMtF%20link%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/36293/rMtF%20link%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('a[href="https://www.reddit.com/r/MtF/"]').attr('href','https://www.reddit.com/r/MtF/new/');
    // Your code here...
})();