// ==UserScript==
// @name         BostonGlobe Incognito Fix
// @namespace    reallybostonglobe?
// @description  lol
// @include      https://www.bostonglobe.com/*
// @include      http://www.bostonglobe.com/*
// @version      1.01
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/29952/BostonGlobe%20Incognito%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/29952/BostonGlobe%20Incognito%20Fix.meta.js
// ==/UserScript==

window.webkitRequestFileSystem = function(_, _, fn1, fn2){fn1();};
