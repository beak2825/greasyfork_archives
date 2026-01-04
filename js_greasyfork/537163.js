// ==UserScript==
// @name         Offtiktok No Loop
// @version      0.1
// @description  Don't loop offtiktok videos
// @author       shellster
// @license MIT
// @match        *://www.offtiktok.com/*
// @namespace https://greasyfork.org/en/users/316827
// @downloadURL https://update.greasyfork.org/scripts/537163/Offtiktok%20No%20Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/537163/Offtiktok%20No%20Loop.meta.js
// ==/UserScript==
(function() {
  'use strict';
  document.querySelectorAll('video').forEach(function(node) { node.removeAttribute("loop") });
})();

