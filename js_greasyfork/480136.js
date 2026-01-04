// ==UserScript==
// @name         CosplayNSFW
// @namespace    http://yu.net/
// @version      1.0
// @description  td
// @author       Yu
// @match        https://cosplaynsfw.cam/*
// @exclude      https://cosplaynsfw.cam/
// @exclude      https://cosplaynsfw.cam/cosplayer/*
// @exclude      https://cosplaynsfw.cam/most-popular/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cosplaynsfw.cam
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480136/CosplayNSFW.user.js
// @updateURL https://update.greasyfork.org/scripts/480136/CosplayNSFW.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const content = document.querySelector("section.post-content div.text");
    const links = content.querySelectorAll("a");

    for(const link of links) {
        if(link.href.match(/terabox(app)?\.com/)) {
            GM_openInTab(link.href, { active: true })
        }
    }
})();