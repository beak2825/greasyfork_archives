// ==UserScript==
// @name         Bigger Pagination Numbers on Knife
// @namespace    prantlf
// @version      0.2
// @description  Increases the font size of the pagination numbers at the bottom of the page to 200%, so that they are eassier reachable on tablets.
// @author       prantlf
// @license      MIT
// @match        https://www.knife.cz/*
// @icon         https://www.google.com/s2/favicons?domain=knife.cz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440038/Bigger%20Pagination%20Numbers%20on%20Knife.user.js
// @updateURL https://update.greasyfork.org/scripts/440038/Bigger%20Pagination%20Numbers%20on%20Knife.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function addGlobalStyle(css) {
    var head = document.getElementsByTagName('head')[0]
    var style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = css
    head.appendChild(style)
  }

  addGlobalStyle('.commandWithMarg .navlinks, .command .navlinks { font-size: 200% }');
})();