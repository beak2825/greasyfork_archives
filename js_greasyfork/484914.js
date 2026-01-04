// ==UserScript==
// @name         Youtube no home page
// @namespace    http://tampermonkey.net/
// @version      2024-01-07
// @description  Remove youtube home page without turning off watch history.
// @author       You
// @match        *://music.youtube.com/*
// @match        *://.*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484914/Youtube%20no%20home%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/484914/Youtube%20no%20home%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("primary").style.display="none";
})();