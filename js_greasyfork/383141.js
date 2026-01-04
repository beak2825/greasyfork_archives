// ==UserScript==
// @name         Lucky Egg TP v1.1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tokopedia.com/tokopoints/hadiah*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383141/Lucky%20Egg%20TP%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/383141/Lucky%20Egg%20TP%20v11.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        document.querySelectorAll('div._9J3X9s-O._1HOf6-Kc')[0].click();
    }, 3000);
})();