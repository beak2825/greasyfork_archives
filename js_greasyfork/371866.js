// ==UserScript==
// @name            Full Reddit Comments
// @version         0.3
// @description     Refresh to dedicated comment page
// @author          Drazen Bjelovuk
// @match           *://www.reddit.com/*
// @grant           none
// @run-at          document-start
// @namespace       https://greasyfork.org/users/11679
// @contributionURL https://goo.gl/dYIygm
// @downloadURL https://update.greasyfork.org/scripts/371866/Full%20Reddit%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/371866/Full%20Reddit%20Comments.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.onclick = (e) => {
    if (e.metaKey) return;
    var parent = e.target.parentElement
    var clickId = parent.dataset.clickId;
    if (clickId && clickId === 'comments') {
      e.preventDefault();
      window.location = parent.getAttribute('href');
    }
  };
})();