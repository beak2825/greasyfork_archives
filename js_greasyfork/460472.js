// ==UserScript==
// @name         BitView Redirector
// @version      0.1.2
// @description  Redirects from https://bitview.net to https://dev.bitview.net
// @author       iplux

// @match        http://bitview.net/*
// @match        http://dev.bitview.net/*
// @match        https://bitview.net/*

// @match        http://www.bitview.net/*
// @match        http://www.dev.bitview.net/*
// @match        https://www.bitview.net/*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitview.net
// @license      MIT
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/460472/BitView%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/460472/BitView%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.replace("https://dev.bitview.net" + window.location.pathname + window.location.search + window.location.hash);
})();