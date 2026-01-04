// ==UserScript==
// @name         Download Reddit videos by replacing links
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  simply replaces v.redd.it links with Myvid.download links - feel free to fork and use any other service
// @author       nobody
// @include     http*://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391900/Download%20Reddit%20videos%20by%20replacing%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/391900/Download%20Reddit%20videos%20by%20replacing%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var anchors = document.querySelectorAll('a[href]');
    Array.prototype.forEach.call(anchors, function (element, index) {
        element.href = element.href.replace("https://v.redd.it/", "https://myvid.download/?url=https://v.redd.it/");
    });
})();