// ==UserScript==
// @name         Redirect FSKR
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://fuskator.com/thumbs/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/373501/Redirect%20FSKR.user.js
// @updateURL https://update.greasyfork.org/scripts/373501/Redirect%20FSKR.meta.js
// ==/UserScript==

(function() {
    window.location.href = window.location.href.replace('/thumbs/', '/full/');
})();