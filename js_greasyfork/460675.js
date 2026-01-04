// ==UserScript==
// @name         NZCrash
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make nz.ua fake crash
// @author       FAB
// @match        https://nz.ua/menu
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nz.ua
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460675/NZCrash.user.js
// @updateURL https://update.greasyfork.org/scripts/460675/NZCrash.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.location.href = 'http://www.fabworks.rf.gd/FAB/nz_crash.html';

})();