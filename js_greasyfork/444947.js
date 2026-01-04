// ==UserScript==
// @name         Youtube New Layout Font Fix
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Reverts the shitty bold font to the good one
// @author       TB-303
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/444947/Youtube%20New%20Layout%20Font%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/444947/Youtube%20New%20Layout%20Font%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle // 1st var name
    (`.ytd-video-primary-info-renderer {
    font-family: "Roboto",sans-serif;
    font-weight: 400;
    }
   `);

    GM_addStyle // 2nd var name
    (`.ytd-watch-metadata {
    font-family: "Roboto",sans-serif;
    font-weight: 400;
    }
   `);
})();