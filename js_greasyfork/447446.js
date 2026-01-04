// ==UserScript==
// @name         jeuxvideo no pay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      GNU GPLv3
// @description  For you
// @author       EvelynTSMG
// @match        https://www.jeuxvideo.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jeuxvideo.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/447446/jeuxvideo%20no%20pay.user.js
// @updateURL https://update.greasyfork.org/scripts/447446/jeuxvideo%20no%20pay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.classList.remove('didomi-popup-open')
    document.getElementById('didomi-host').remove()
})();