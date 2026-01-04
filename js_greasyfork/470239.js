// ==UserScript==
// @name       Auto-dismiss Gaia announcements
// @namespace  http://mathemaniac.org/
// @version    1.0.0
// @description  Automatically dismisses announcements on Gaia Online.
// @match        https://www.gaiaonline.com/*
// @copyright  2023, Sebastian Paaske Tørholm
// @grant      none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/470239/Auto-dismiss%20Gaia%20announcements.user.js
// @updateURL https://update.greasyfork.org/scripts/470239/Auto-dismiss%20Gaia%20announcements.meta.js
// ==/UserScript==

/* jshint -W097 */
/* eslint-env jquery */
'use strict';

document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `
<style>
    #notifyBubbleContainer:has(.notify_announcements:only-child),
    .notify_announcements {
        display: none;
    }
</style>
`);

let announcement_link = document.querySelector('#notifyBubbleContainer .notify_announcements a');
if (announcement_link) {
    let iframe = document.createElement('iframe');
    iframe.src = announcement_link.href;
    iframe.style.display = 'none';
    announcement_link.appendChild(iframe);
}
