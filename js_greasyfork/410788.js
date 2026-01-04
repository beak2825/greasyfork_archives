// ==UserScript==
// @name         CodeSpaces Close Confirmation
// @namespace    https://github.com/wei
// @version      0.2
// @description  Ask before you close GitHub or VS Codespaces
// @author       Wei <github@weispot.com>
// @match        https://*.github.dev
// @match        https://online.visualstudio.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410788/CodeSpaces%20Close%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/410788/CodeSpaces%20Close%20Confirmation.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = 'Are you sure?';
  });
})();