// ==UserScript==
// @name         Youtube - redirect from shorts to video
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect automatically from youtube-shorts video to normal youtube video
// @author       You
// @match        https://www.youtube.com/shorts/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459530/Youtube%20-%20redirect%20from%20shorts%20to%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/459530/Youtube%20-%20redirect%20from%20shorts%20to%20video.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const matches = location.href.match(/shorts\/(.*?)$/);
    if (matches[1]) {
        location.href = 'https://www.youtube.com/watch?v='+matches[1];
    }
})();