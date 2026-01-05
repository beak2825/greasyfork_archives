// ==UserScript==
// @name         Tab Prefix: ›
// @namespace    http://zesty.ca/
// @version      0.1
// @description  Put a prefix on tab titles.
// @author       Ka-Ping Yee
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27656/Tab%20Prefix%3A%20%E2%80%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/27656/Tab%20Prefix%3A%20%E2%80%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var PREFIX = "›";
    var ok_titles = {};
    var update_title = function() {
        var new_title = document.title;
        if (!ok_titles[document.title]) {
            new_title = (PREFIX + document.title).trim();
            ok_titles[new_title] = 1;
            document.title = new_title;
        }
        window.setTimeout(update_title, 500);
    };
    update_title();
})();
