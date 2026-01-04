// ==UserScript==
// @name         VozForums Unbreak - Comment Separator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Trả lại dấu đen ngăn cách giữa một số comment
// @author       You
// @match        https://voz.vn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406888/VozForums%20Unbreak%20-%20Comment%20Separator.user.js
// @updateURL https://update.greasyfork.org/scripts/406888/VozForums%20Unbreak%20-%20Comment%20Separator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var allAdDiv = document.querySelectorAll('[id^=div-gpt-ad]');
    var i;
    for (i = 0; i < allAdDiv.length; i++) {
        allAdDiv[i].parentNode.removeChild(allAdDiv[i]);
    }
})();