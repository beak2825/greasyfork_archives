// ==UserScript==
// @name         Hide leftAHol div
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide the leftAHol div on the specified website
// @author       Your Name
// @match        https://krunker.io/social*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464689/Hide%20leftAHol%20div.user.js
// @updateURL https://update.greasyfork.org/scripts/464689/Hide%20leftAHol%20div.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const element = document.getElementById('leftAHol');
    if (element) {
        element.style.display = 'none';
    }
})();