// ==UserScript==
// @name         YouTube Disable Shorts
// @namespace    https://www.youtube.com/
// @version      0.1
// @description  Converts YouTube Shorts URL to normal URL
// @author       You
// @match        https://www.youtube.com/shorts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441208/YouTube%20Disable%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/441208/YouTube%20Disable%20Shorts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.href = window.location.href.replace('shorts/', 'watch?v=');
})();