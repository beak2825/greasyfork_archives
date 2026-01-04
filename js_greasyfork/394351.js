// ==UserScript==
// @name         TextNow AD remover
// @namespace    https://www.dosk.win/
// @version      0.1
// @description  try to take over the world!
// @author       SpringHack
// @match        https://www.textnow.com/messaging
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394351/TextNow%20AD%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/394351/TextNow%20AD%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        document.getElementById('contentContainer').nextElementSibling.style.display = 'none';
        document.getElementById('rectSlotAd').style.display = 'none'
    }, 1000);

    // Your code here...
})();