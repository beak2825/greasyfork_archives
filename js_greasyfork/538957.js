// ==UserScript==
// @name         Remove V2rayssr  Mask
// @namespace    http://tampermonkey.net/
// @version      2025-06-09
// @description  try to Remove V2rayssr  Mask
// @author       iamshen
// @include     https://v2rayssr.com
// @include     *://v2rayssr.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2rayssr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538957/Remove%20V2rayssr%20%20Mask.user.js
// @updateURL https://update.greasyfork.org/scripts/538957/Remove%20V2rayssr%20%20Mask.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // remove the  v2raySSR Mask
    const maskDiv = document.querySelector(".mask");
    if(maskDiv){
     maskDiv.remove();
    }
})();