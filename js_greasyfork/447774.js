// ==UserScript==
// @name         Reddit - Remove the "Shop Avatars" button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      None
// @description  Reddit - remove Avatar button
// @author       You
// @include      http://www.reddit.com/*
// @include      https://www.reddit.com/*
// @match        http://www.reddit.com
// @match        https://www.reddit.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447774/Reddit%20-%20Remove%20the%20%22Shop%20Avatars%22%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/447774/Reddit%20-%20Remove%20the%20%22Shop%20Avatars%22%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        var manySpans = document.getElementById("change-username-tooltip-id");
        manySpans.lastChild.innerHTML = "";
    }, 1500);

    // Your code here...
})();
