// ==UserScript==
// @name            	Youtube preview on key
// @namespace       	https://greasyfork.org/users/821661
// @match           	https://www.youtube.com/*
// @grant           	GM_addStyle
// @version         	1.0
// @author          	hdyzen
// @description     	video preview when hover thumnail with ctrl pressed
// @license         	MIT
// @downloadURL https://update.greasyfork.org/scripts/492361/Youtube%20preview%20on%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/492361/Youtube%20preview%20on%20key.meta.js
// ==/UserScript==
'use strict';

document.body.addEventListener(
    'mouseenter',
    e => {
        if (e.target.closest('#dismissible, ytd-rich-grid-media') && !e.ctrlKey) {
            e.stopPropagation();
        }
    },
    true,
);
