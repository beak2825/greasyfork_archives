// ==UserScript==
// @name         Anti J*b Slur
// @namespace    http://tampermonkey.net/
// @version      2025-05-26
// @description  Removes The Word J*b From Twitter
// @author       RealestGamer6
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537442/Anti%20J%2Ab%20Slur.user.js
// @updateURL https://update.greasyfork.org/scripts/537442/Anti%20J%2Ab%20Slur.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';

const items = document.getElementsByClassName("css-146c3p1 r-dnmrzs r-1udh08x r-1udbk01 r-3s2u2q r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-adyw6z r-135wba7 r-16dba41 r-dlybji r-nazi8o");

for (let i = 0; i < items.length; i++) {
    if (items[i].textContent.trim() === "Jobs") {
        items[i].textContent = "J*bs"
    }
}
}, 1000);