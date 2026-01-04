// ==UserScript==
// @name         Lobste.rs Open in New Tab
// @namespace    http://tampermonkey.net/
// @description  Opens links to articles and the comment pages in a new tab
// @author       Brekkjern
// @match        https://www.tampermonkey.net/index.php?version=4.8.41&ext=dhdg&updated=true
// @grant        none
// @include      https://lobste.rs/*
// @version 0.0.1.20191112103250
// @downloadURL https://update.greasyfork.org/scripts/392307/Lobsters%20Open%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/392307/Lobsters%20Open%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let links = document.querySelectorAll("a.u-url, span.comments_label > a");
    links.forEach(function(element) {
        element.target="_blank";
    });
})();