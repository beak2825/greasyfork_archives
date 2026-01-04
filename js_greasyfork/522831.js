// ==UserScript==
// @name        Scrolller Partner Site Popup Blocker
// @version      1.01
// @description  prevents "visit partner site to continue" pop up
// @icon            https://scrolller.com/assets/favicon-16x16.png
// @author       luciellexoxo
// @match           https://scrolller.com/*
// @license MIT
// @grant        none
// @namespace https://greasyfork.org/users/1419528
// @downloadURL https://update.greasyfork.org/scripts/522831/Scrolller%20Partner%20Site%20Popup%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/522831/Scrolller%20Partner%20Site%20Popup%20Blocker.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function removeCSS(filename) {
    const links = document.getElementsByTagName('link');
    for (let i = links.length - 1; i >= 0; i--) {
      if (links[i].href.endsWith(filename)) {
        links[i].parentNode.removeChild(links[i]);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    removeCSS('Popup--fbBvGRG.css')
      removeCSS('index-6smuD7qh.css')
      removeCSS('index-chOJ-YDY.css')
      removeCSS('index-Fk9ymjge.css')
      removeCSS('index-AYuLm4ps.css')
      removeCSS('index-W_nGhRlq.css');
  });
})();