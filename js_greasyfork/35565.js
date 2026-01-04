// ==UserScript==
// @name         Cardmarket
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  reload to prevent auto logout
// @author       themenwhostareatcodes
// @match        https://www.cardmarket.com/en/Magic
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35565/Cardmarket.user.js
// @updateURL https://update.greasyfork.org/scripts/35565/Cardmarket.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    setTimeout(function(){ location.reload(); }, 60*60*1000);
})();