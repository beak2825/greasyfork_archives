// ==UserScript==
// @name        RF ticker
// @namespace   namerspacer
// @include     https://raidforums.com/index.php
// @version     1
// @grant       none
// @description is a ticker
// @downloadURL https://update.greasyfork.org/scripts/12087/RF%20ticker.user.js
// @updateURL https://update.greasyfork.org/scripts/12087/RF%20ticker.meta.js
// ==/UserScript==
window.addEventListener('load', function () {
  clearTimeout(ticker);
}, false);
document.body.innerHTML = document.body.innerHTML.replace('Refreshing WebPage In','Timer frozen at: ');