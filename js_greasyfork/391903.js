// ==UserScript==
// @name         newgr 1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  wwwwwww
// @author       wwww
// @include     https://www.newgrounds.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391903/newgr%201.user.js
// @updateURL https://update.greasyfork.org/scripts/391903/newgr%201.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var anchors = document.querySelectorAll('a[href]');
    Array.prototype.forEach.call(anchors, function (element, index) {
        element.href = element.href.replace("https://www.newgrounds.com/portal/view/", "https://www.tubeoffline.com/downloadFrom.php?host=NewGrounds&video=https://www.newgrounds.com/portal/view/");
    });
})();