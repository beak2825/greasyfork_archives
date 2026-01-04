// ==UserScript==
// @name         Better github read
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  调整Github页面宽度及字体大小，以便更加适合阅读。
// @author       High Jiang
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374151/Better%20github%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/374151/Better%20github%20read.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.innerHTML = '.markdown-body{ font-size: 1.4em } .repository-content{ width: 1080px } .discussion-timeline{ width: 1080px } .timeline-new-comment{max-width: 100%} ';
    document.head.appendChild(style);

    var items = document.querySelectorAll('#wiki-content, #discussion_bucket');
    for (var i = 0; i < items.length; i++) {
      items[i].style.width = "1320px";
    }
})();