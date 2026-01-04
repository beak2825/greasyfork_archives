// ==UserScript==
// @name         Prevent Redirection
// @namespace    https://subc.rip
// @version      2024-02-17
// @description  prevent redirection by LeetCode
// @author       subcrip
// @match        https://leetcode.cn/*
// @match        https://leetcode.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487512/Prevent%20Redirection.user.js
// @updateURL https://update.greasyfork.org/scripts/487512/Prevent%20Redirection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currRegion = window.location.hostname;

    window.addEventListener('popstate', function(event) {
        if (window.location.hostname !== currRegion) {
            window.location.hostname = currRegion;
        }
    });
})();