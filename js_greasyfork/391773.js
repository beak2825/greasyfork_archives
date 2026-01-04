// ==UserScript==
// @name         VLONE SOLDIER
// @namespace    xamov
// @version      66.6
// @description  try to take over the world!
// @author       xamo
// @match        https://ktt2.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391773/VLONE%20SOLDIER.user.js
// @updateURL https://update.greasyfork.org/scripts/391773/VLONE%20SOLDIER.meta.js
// ==/UserScript==

(function() {
    'use strict';
Array.prototype.forEach.call(document.querySelectorAll('img'), function (img) {
  img.src = 'https://cdn130.picsart.com/236473159022212.png';
});
})();