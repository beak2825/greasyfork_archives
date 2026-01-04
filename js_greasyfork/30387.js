// ==UserScript==
// @name         Automatically mark episode as watched at Najserialy.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  It will mark a episode as watched after clicking the advertising close button
// @author       You
// @match        https://najserialy.com/serial/*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/30387/Automatically%20mark%20episode%20as%20watched%20at%20Najserialycom.user.js
// @updateURL https://update.greasyfork.org/scripts/30387/Automatically%20mark%20episode%20as%20watched%20at%20Najserialycom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.rekRPlama .close').click(function() {
        // already marked as watched
        if ($('.actions .viewed.active').length > 0) return;
        $('.actions .viewed').click();
    });
})();