// ==UserScript==
// @name         hideLiveAd
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Live ad Link
// @author       LoganGong
// @match        [https://cc.btlm.live/,https://sofan.pro/]
// @icon         https://www.google.com/s2/favicons?sz=64&domain=btlm.live
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442446/hideLiveAd.user.js
// @updateURL https://update.greasyfork.org/scripts/442446/hideLiveAd.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var links = document.querySelectorAll('a[href*="//ad."]');
    links.forEach(function(item){
        var ul = item.closest('ul');
        if(ul) {
           item.closest('ul').remove();
        }
    });
})();