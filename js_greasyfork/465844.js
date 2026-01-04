// ==UserScript==
// @name         Remove Axutongxue
// @description  Remove ads from axutongxue website
// @version      1
// @match        https://axutongxue.net/*
// @grant        none
// @namespace https://greasyfork.org/users/832913
// @downloadURL https://update.greasyfork.org/scripts/465844/Remove%20Axutongxue.user.js
// @updateURL https://update.greasyfork.org/scripts/465844/Remove%20Axutongxue.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const selectorToRemove = '#fdasfas';
  const asideElement = document.querySelector(selectorToRemove);

  if (asideElement !== null) {
    asideElement.remove();
  }
})();

