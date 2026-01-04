// ==UserScript==
// @version 0.1
// @namespace curtisblackwell
// @name         Expand `dd` Symfony's VarDumper Component
// @description  see: https://laracasts.com/discuss/channels/general-discussion/expanding-dd-vardumper-by-default
// @author       curtisblackwell
// @include      *://*.test/*
// @downloadURL https://update.greasyfork.org/scripts/377073/Expand%20%60dd%60%20Symfony%27s%20VarDumper%20Component.user.js
// @updateURL https://update.greasyfork.org/scripts/377073/Expand%20%60dd%60%20Symfony%27s%20VarDumper%20Component.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var compacted = document.querySelectorAll('.sf-dump-compact');

  for (var i = 0; i < compacted.length; i++) {
    compacted[i].className = 'sf-dump-expanded';
  }
})();