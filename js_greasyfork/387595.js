// ==UserScript==
// @name         vue ad remove
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       huozi
// @include      https://cn.vuejs.org/*
// @match        https://cn.vuejs.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387595/vue%20ad%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/387595/vue%20ad%20remove.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var gg = document.getElementById('sidebar-sponsors-special');
    var ad = document.getElementById('ad');
    var ads = document.getElementsByClassName('ad-pagetop');
    gg.parentNode.removeChild(gg);
    ad.parentNode.removeChild(ad);
    for (var i = 0; i < ads.length; i++) {
    	ad = ads[i];
    	ad.parentNode.removeChild(ad);
    }
    // Your code here...
})();