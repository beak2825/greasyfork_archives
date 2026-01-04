// ==UserScript==
// @name         YouTube - prev and next buttons remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove prev and next buttons
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
 // @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/448392/YouTube%20-%20prev%20and%20next%20buttons%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/448392/YouTube%20-%20prev%20and%20next%20buttons%20remover.meta.js
// ==/UserScript==

(() => {
    'use strict';
    [
        '.ytp-prev-button',
        '.ytp-next-button'
    ].map(v => document.querySelectorAll(v)).forEach(v => v?.forEach(v => {
        v.hidden = true;
    }));
})();