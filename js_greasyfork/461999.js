// ==UserScript==
// @name         JD focus
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  set searchbox focus
// @author       You
// @match        https://www.jd.com/*
// @match        https://javdb.com/*
// @match        https://jd.com/*
// @icon         https://www.jd.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461999/JD%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/461999/JD%20focus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.getElementById('key')){
    document.getElementById('key').focus();
    }

    if(document.getElementById('video-search')){
    document.getElementById('video-search').focus();
    }
})();
