// ==UserScript==
// @name         Space to open prompt
// @namespace    https://greasyfork.org/en/users/749682-catfather
// @version      1.0
// @description  Press space to open more info, and again to open all info
// @author       catfather
// @match        https://www.wanikani.com/review/session
// @match        https://www.wanikani.com/lesson/session
// @icon         https://www.google.com/s2/favicons?domain=wanikani.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423682/Space%20to%20open%20prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/423682/Space%20to%20open%20prompt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keyup', function(e) {
        if (e.keyCode !== 32) return;
        var itemInfo = document.querySelector('#option-item-info');
        if (itemInfo.getAttribute('class') === 'active') document.querySelector('#all-info').click();
        else itemInfo.click();
    });
})();