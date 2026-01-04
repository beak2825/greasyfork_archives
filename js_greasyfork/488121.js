// ==UserScript==
// @name         YouTube - Remove Stream Chat Heart Icon
// @namespace    http://youtube.com/
// @version      1.0
// @description  This script removes the annoying hearth icon on top of the live stream chat.
// @author       Faab007NL
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-end
// @sandbox      DOM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488121/YouTube%20-%20Remove%20Stream%20Chat%20Heart%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/488121/YouTube%20-%20Remove%20Stream%20Chat%20Heart%20Icon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init(){
        const reactionControlPanel = document.getElementById('reaction-control-panel');
        reactionControlPanel.remove();
    }
    init();
})();