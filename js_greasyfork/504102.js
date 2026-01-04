// ==UserScript==
// @name        Youtube: remove recommendations sidebar
// @namespace   Violentmonkey Scripts
// @match       *://*.youtube.com/*
// @grant       none
// @version     1.0.4
// @author      -
// @license     MIT
// @description 18/08/2024, 11:09:47
// @downloadURL https://update.greasyfork.org/scripts/504102/Youtube%3A%20remove%20recommendations%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/504102/Youtube%3A%20remove%20recommendations%20sidebar.meta.js
// ==/UserScript==

const sidebar_id = 'secondary';

(function() {
    'use strict';
    console.log('youtube-recs-sidebar-remover started');
})();

var whatToObserve = {childList: true};
var mutationObserver = new MutationObserver(function(mutationRecords) {
  elements = document.querySelectorAll('[id=' + sidebar_id + ']');
  sidebar = (elements.length > 0) ? elements[0] : null;
  if (sidebar != null) {
    sidebar.parentNode.removeChild(sidebar);
  }
});

mutationObserver.observe(document.body, whatToObserve);