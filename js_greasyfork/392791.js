// ==UserScript==
// @name         Octotree remove vip info
// @namespace    https://www.dosk.win/
// @version      0.1
// @description  try to take over the world!
// @author       SpringHack
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392791/Octotree%20remove%20vip%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/392791/Octotree%20remove%20vip%20info.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const css = document.createElement('style');
  css.innerText = '.octotree-footer { display: none !important; }  .octotree-sidebar.octotree-github-sidebar { padding-bottom: 0px; }';
  document.body.appendChild(css)
})();