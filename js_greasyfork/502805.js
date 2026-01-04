// ==UserScript==
// @name         LIHKG Remove Ads
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove Ads from LIHKG
// @author       You
// @match        https://lihkg.com/thread/*
// @icon         https://cdn.lihkg.com/assets/images/logo-256.png
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502805/LIHKG%20Remove%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/502805/LIHKG%20Remove%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    removeAds()
})();

window.navigation.addEventListener("navigate", (event) => {
    removeAds()
})

function removeAds(){
    $('div[data-post-id]').parent().find('> div:nth-child(2)').remove()
}