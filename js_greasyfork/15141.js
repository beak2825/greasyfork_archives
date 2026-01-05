// ==UserScript==
// @name        Greasy Fork Container Spacing
// @namespace   https://github.com/chriskim06/userscripts
// @description Adds a small margin to the bottom of the code container and author description in Greasy Fork
// @match       https://greasyfork.org/en/scripts/*
// @match       https://greasyfork.org/en/users/*
// @version     1.2.4
// @downloadURL https://update.greasyfork.org/scripts/15141/Greasy%20Fork%20Container%20Spacing.user.js
// @updateURL https://update.greasyfork.org/scripts/15141/Greasy%20Fork%20Container%20Spacing.meta.js
// ==/UserScript==

(function() {

  var el = document.getElementById('code-container');
  if (el !== null) {
    el.style.marginBottom = '60px';
  }

  el = document.getElementById('additional-info');
  if (el !== null) {
    el.style.marginBottom = '60px';
  }

  el = document.getElementById('user-deleted-script-list');
  if (el !== null) {
    el.style.marginBottom = '60px';
  } else {
    el = document.getElementById('user-script-list');
    if (el !== null) {
      el.style.marginBottom = '60px';
    }
  }

})();

