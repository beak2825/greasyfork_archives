// ==UserScript==
// @name          Youtube No Captions
// @description   Disables the captions
// @author        nullgemm
// @version       0.1.0
// @grant         none
// @match         *://*.youtube.com/*
// @run-at        document-start
// @icon          https://www.youtube.com/s/desktop/264d4061/img/favicon.ico
// @namespace     https://greasyfork.org/en/users/322108-nullgemm
// @license       WTFPL
// @downloadURL https://update.greasyfork.org/scripts/439988/Youtube%20No%20Captions.user.js
// @updateURL https://update.greasyfork.org/scripts/439988/Youtube%20No%20Captions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const timestamp = Date.now();
    const value = {"data":"false","expiration":4294967296000,"creation":timestamp};
    localStorage.setItem("yt-player-sticky-caption", JSON.stringify(value));
})();