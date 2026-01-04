// ==UserScript==
// @name         Steam Workshop Cover Fix
// @namespace    ACGMN
// @version      0.1
// @description  Fix Steam workshop cover images    修复Steam创意工坊封面图
// @author       ACGMN
// @license      MIT
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @match        https://steamcommunity.com/workshop/filedetails/?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470122/Steam%20Workshop%20Cover%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/470122/Steam%20Workshop%20Cover%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function () {
        if(typeof onYouTubeIframeAPIReady === 'function') {
            onYouTubeIframeAPIReady();
        }
    }, 1000)
})();