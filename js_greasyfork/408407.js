// ==UserScript==
// @name         krunker.io - Auto Skipper for ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://krunker.io/
// @match        *://krunker.io/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408407/krunkerio%20-%20Auto%20Skipper%20for%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/408407/krunkerio%20-%20Auto%20Skipper%20for%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const main = () => {
        const e = document.getElementsByClassName("ympb_video_skip")[0];
        if(e) e.click();
    };
    setInterval(main,500);
})();