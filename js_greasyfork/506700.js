// ==UserScript==
// @name         Stratz to Dotabuff Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirects from opendota.com to dotabuff.com
// @author       You
// @match        *.stratz.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506700/Stratz%20to%20Dotabuff%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/506700/Stratz%20to%20Dotabuff%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const newUrl = window.location.href.replace('stratz.com', 'dotabuff.com');
    window.location.replace(newUrl);
})();
