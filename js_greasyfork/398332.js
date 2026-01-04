// ==UserScript==
// @name         Skip ads on nova
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://media.cms.nova.cz/*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/398332/Skip%20ads%20on%20nova.user.js
// @updateURL https://update.greasyfork.org/scripts/398332/Skip%20ads%20on%20nova.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        $('.rmp-ad-container').remove();
    }, 3000);
    // Your code here...
})();