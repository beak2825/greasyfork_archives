// ==UserScript==
// @name         /r/FlashTV flair vibrate
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make all /r/FlashTV flairs vibrate
// @author       You
// @match        https://www.reddit.com/r/FlashTV/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/29507/rFlashTV%20flair%20vibrate.user.js
// @updateURL https://update.greasyfork.org/scripts/29507/rFlashTV%20flair%20vibrate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(".flair:hover { animation: vibrate 50ms infinite }");
})();