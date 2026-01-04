// ==UserScript==
// @name         YouTube ScrollBar Remove
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  New version of youtube get scrollbar, i don't want !
// @author       Smax2k8
// @include      https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/423150/YouTube%20ScrollBar%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/423150/YouTube%20ScrollBar%20Remove.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle("body:not(.style-scope)[standardized-themed-scrollbar]:not(.style-scope):not([no-y-overflow]):not(.style-scope)::-webkit-scrollbar {width: 0px!important;}");
})();