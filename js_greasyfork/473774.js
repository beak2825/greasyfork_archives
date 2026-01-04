// ==UserScript==
// @name         Open Links in New Tab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Open all links in a new tab
// @author       AydenGen
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473774/Open%20Links%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/473774/Open%20Links%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        links[i].target = "_blank";
    }

})();