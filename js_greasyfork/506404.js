// ==UserScript==
// @name         CSPC Leons CSS Fixer
// @namespace    http://tampermonkey.net/
// @version      1.3-yU1jx
// @description  CSS Fix
// @author       Mra1k3r0
// @match        *://leons.cspc.edu.ph/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.ph
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506404/CSPC%20Leons%20CSS%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/506404/CSPC%20Leons%20CSS%20Fixer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  fetch('https://gist.githubusercontent.com/Mra1k3r0/d478ecdb2296cb5c630d42358bbe330e/raw/cecbfd5a3bbe4423d1ceed4376a498e7faaeeb5c/testcspc.css')
    .then(response => response.text())
    .then(css => {
      var style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);

    })
    .catch(error => console.error('Error loading CSS:', error));

})();