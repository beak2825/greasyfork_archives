// ==UserScript==
// @name         Devast.io - Auto Skipper for ads
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        *://devast.io/
// @match        *://devast.io/*/
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/416206/Devastio%20-%20Auto%20Skipper%20for%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/416206/Devastio%20-%20Auto%20Skipper%20for%20ads.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const s = [
        '.ympb_video_skip',
        '.ympb_video_skip_btn'
    ].join(',');
    setInterval(() => {
        for(const e of document.querySelectorAll(s)) e.click();
    }, 500);
})();