// ==UserScript==
// @name         BBRT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  enlarges thumbnails
// @author       You
// @match        https://www.barebackrt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424509/BBRT.user.js
// @updateURL https://update.greasyfork.org/scripts/424509/BBRT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var imgs = document.getElementsByTagName('img');
    Array.prototype.slice.call(imgs)
        .forEach(function(img) { img.src = img.src + '&s=3' });
})();