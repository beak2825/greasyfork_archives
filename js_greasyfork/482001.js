// ==UserScript==
// @name         lock title
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevents a window's title from being set by the website.
// @author       You
// @license      MIT
// @match *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482001/lock%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/482001/lock%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';
     try {
      window.originalTitle = document.title; // save for future
      Object.defineProperty(document, 'title', {
        get: function() {return window.originalTitle},
        set: function() {}
    });
    } catch (e) {}
})();