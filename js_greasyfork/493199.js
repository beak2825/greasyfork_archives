// ==UserScript==
// @name         Reddit old ui redirecter
// @namespace    http://tampermonkey.net/
// @version      v1.0.2
// @description  resets new reddit ui to the good one
// @author       $krampusgg0 on cashapp
// @match        *://reddit.com/*
// @match        *://www.reddit.com/*
// @match        *://sh.reddit.com/*
// @exclude      *://www.reddit.com/media*
// @exclude      *://sh.reddit.com/media*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493199/Reddit%20old%20ui%20redirecter.user.js
// @updateURL https://update.greasyfork.org/scripts/493199/Reddit%20old%20ui%20redirecter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.location.href = window.location.href.replace(/(www|sh)\.reddit\.com/, "new.reddit.com");;
})();