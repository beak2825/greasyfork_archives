// ==UserScript==
// @name         ActivateGravity
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  switches into Gravity mode on Quizlet
// @author       You
// @match        https://quizlet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizlet.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450249/ActivateGravity.user.js
// @updateURL https://update.greasyfork.org/scripts/450249/ActivateGravity.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function onAltX() {
        const match = window.location.href.match(/(https:\/\/quizlet\.com)[\D]+(\d+)\/.+/);
        if (!!match) {
            const [, siteUrl, cardId] = match;
            const gravityUrl = `${siteUrl}/${cardId}/gravity`;
            window.location.href = gravityUrl;
        }
    }

    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.altKey && evt.keyCode === 88) {
            onAltX();
        }
    }


    window.addEventListener('keydown', onKeydown, true);
})();