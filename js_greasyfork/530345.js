// ==UserScript==
// @name         To arch-img
// @namespace    http://tampermonkey.net/
// @version      2025-03-20_17h25m
// @description  Change to arch-img.b4k.dev
// @author       hangjeff
// @match        https://arch.b4k.dev/*
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530345/To%20arch-img.user.js
// @updateURL https://update.greasyfork.org/scripts/530345/To%20arch-img.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url = window.location.href;
    if(url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.gif') ){
        window.location.href =  window.location.href.replace("https://arch.b4k.dev/", "https://arch-img.b4k.dev/");
}
    // Your code here...
})();