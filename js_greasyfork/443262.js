
// ==UserScript==
// @name        Ctrl+K to focus on search (currently only works on MDN)
// @namespace   Violentmonkey Scripts
// @description This is a userscript.
// @match       *://developer.mozilla.org/*
// @license     MIT
// @version     0.0.1
// @author      
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/443262/Ctrl%2BK%20to%20focus%20on%20search%20%28currently%20only%20works%20on%20MDN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/443262/Ctrl%2BK%20to%20focus%20on%20search%20%28currently%20only%20works%20on%20MDN%29.meta.js
// ==/UserScript==

(function () {
'use strict';

document.addEventListener('keydown', e => {
  if (e.key === 'k' && e.ctrlKey) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('top-nav-search-q').focus();
  }
});

})();
