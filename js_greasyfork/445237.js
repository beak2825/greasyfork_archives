// ==UserScript==
// @name         Telegraph image referrer policy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change image referrer policy of telegra.ph, so images from 微信公众平台 get shown.
// @author       You
// @match        https://telegra.ph/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegra.ph
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/445237/Telegraph%20image%20referrer%20policy.user.js
// @updateURL https://update.greasyfork.org/scripts/445237/Telegraph%20image%20referrer%20policy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", function() {
        setTimeout(function() {
            Array.from(document.getElementsByTagName("img")).forEach(x => { x.setAttribute("referrerpolicy", "no-referrer"); x.referrerPolicy = "no-referrer"; x.src = x.src + (x.src.indexOf("?") === -1 ? "?" : "&") + "count=" + new Date().getTime(); });
        }, 1);
    }, false);

})();