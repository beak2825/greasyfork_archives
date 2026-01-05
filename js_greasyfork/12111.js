// ==UserScript==
// @name        RF ticker freeze
// @namespace   RFTICKER
// @include     https://raidforums.com/
// @version     1
// @grant       none
// @description is a ticker
// @downloadURL https://update.greasyfork.org/scripts/12111/RF%20ticker%20freeze.user.js
// @updateURL https://update.greasyfork.org/scripts/12111/RF%20ticker%20freeze.meta.js
// ==/UserScript==
window.addEventListener('load', function () {
  clearTimeout(ticker);
}, false);
document.body.innerHTML = document.body.innerHTML.replace('Refreshing WebPage In','Timer frozen at: ');