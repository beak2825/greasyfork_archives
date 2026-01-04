// ==UserScript==
// @name        Redirect YouTube shorts to normal videos
// @description Redirect YouTube shorts (/shorts/) to normal videos (/watch?v=)
// @match       *://www.youtube.com/shorts/*
// @run-at      document-start
// @grant       none
// @license     MIT
// @version 0.0.1.20220501164152
// @namespace https://greasyfork.org/users/909312
// @downloadURL https://update.greasyfork.org/scripts/444324/Redirect%20YouTube%20shorts%20to%20normal%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/444324/Redirect%20YouTube%20shorts%20to%20normal%20videos.meta.js
// ==/UserScript==

var plainPath   = location.pathname.replace (/shorts\//, "/watch?v=");
var newURL      = location.protocol + "//" +
    location.host            +
    plainPath                +
    location.search          +
    location.hash
;
location.replace (newURL);