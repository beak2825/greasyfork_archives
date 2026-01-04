// ==UserScript==
// @name        Remove controlslist=nodownload
// @version     1.1
// @description Removes `controlslist=nodownload` for all <video> and <audio> tags.
// @author      Ethkuil
// @match       *://*/*
// @grant       none
// @license     MIT
// @namespace https://greasyfork.org/users/757734
// @downloadURL https://update.greasyfork.org/scripts/471503/Remove%20controlslist%3Dnodownload.user.js
// @updateURL https://update.greasyfork.org/scripts/471503/Remove%20controlslist%3Dnodownload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const target = document.querySelector('body');

    const elements = document.querySelectorAll('video[controlslist~=nodownload], audio[controlslist~=nodownload]');
    elements.forEach((el) => {
        el.controlsList.remove("nodownload");
    });
})();