// ==UserScript==
// @name         coolapk skip link
// @namespace    http://tampermonkey.net/
// @version      2024-03-03
// @description  sdfgfdsg
// @author       You
// @match        https://www.coolapk.com/link?url=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coolapk.com
// @grant        none
// @license MIT


// @downloadURL https://update.greasyfork.org/scripts/488860/coolapk%20skip%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/488860/coolapk%20skip%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const urlParam = new URLSearchParams(window.location.search).get("url");
    location.href = urlParam;
    // Your code here...
})();