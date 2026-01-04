// ==UserScript==
// @name            HotPot.ai Confirm Page Refresh
// @namespace       Wizzergod
// @version         1.0.2
// @description     Ask for confirmation before refreshing the page, help to not lose all generated images data to reload page...
// @icon            https://www.google.com/s2/favicons?sz=64&domain=hotpot.ai
// @license         MIT
// @author          Wizzergod
// @match           *://hotpot.ai/art-generator*
// @match           *://hotpot.ai/remove-background*
// @match           *://hotpot.ai/anime-generator*
// @match           *://hotpot.ai/logo-generator*
// @match           *://hotpot.ai/headshot/train*
// @match           *://hotpot.ai/colorize-picture*
// @match           *://hotpot.ai/restore-picture*
// @match           *://hotpot.ai/enhance-face*
// @match           *://hotpot.ai/drive*
// @match           *://hotpot.ai/s/*
// @match           *://hotpot.ai/upscale-photo*
// @match           *://hotpot.ai/sparkwriter*
// @match           *://hotpot.ai/background-generator*
// @match           *://hotpot.ai/lunar-new-year-headshot*
// @match           *://hotpot.ai/ai-avatar*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/488927/HotPotai%20Confirm%20Page%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/488927/HotPotai%20Confirm%20Page%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showConfirmation() {
        return window.confirm("Вы точно хотите обновить страницу?");
    }

    window.addEventListener('beforeunload', function(event) {
        if (showConfirmation()) {
            // Keep this part if you want to perform additional actions before the page refresh
        } else {
            event.preventDefault();
            event.returnValue = '';
        }
    });
})();