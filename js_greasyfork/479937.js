// ==UserScript==
// @name         Unified NGA
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  NGA in one!
// @license      MIT
// @author       You
// @match        https://nga.178.com/*
// @match        https://www.ngacn.cc/*
// @match        https://ngabbs.com/*
// @match        https://g.nga.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nga.cn
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/479937/Unified%20NGA.user.js
// @updateURL https://update.greasyfork.org/scripts/479937/Unified%20NGA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    location.href = "https://bbs.nga.cn" + location.pathname + location.search;
})();