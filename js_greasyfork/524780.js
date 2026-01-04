// ==UserScript==
// @name         Twitter Persian Font
// @namespace    http://github.com/armanjr
// @version      1
// @description  Just changing the font to Vazirmatn (in memory of Saber Rastikerdar)
// @author       You
// @match        https://x.com/*
// @exclude      https://x.com/messages/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM.addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524780/Twitter%20Persian%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/524780/Twitter%20Persian%20Font.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM.addStyle(".r-poiln3{font-family:Vazirmatn!important;font-weight:normal!important;}");
})();