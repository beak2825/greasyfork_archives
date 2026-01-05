// ==UserScript==
// @name         Don't forget to stack AdBlock up
// @namespace    https://twitter.com/siampuu
// @version      1.0
// @description  Why is this even necessary.
// @author       Shampooh
// @match        http://squidboards.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16815/Don%27t%20forget%20to%20stack%20AdBlock%20up.user.js
// @updateURL https://update.greasyfork.org/scripts/16815/Don%27t%20forget%20to%20stack%20AdBlock%20up.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var adblockNotice = document.getElementsByTagName("div")[45];
if (adblockNotice) {
    adblockNotice.remove ();
}