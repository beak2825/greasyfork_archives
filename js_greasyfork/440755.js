// ==UserScript==
// @name         Irasutoya High Quality Links
// @license      MIT
// @namespace    http://earthiverse.ca/
// @version      0.1
// @description  Change the links on irasutoya images to their highest quality versions available
// @author       Kent Rasmussen
// @include      /^https?:\/\/(irasutoya\.com|www\.irasutoya\.com).*/
// @icon         https://www.google.com/s2/favicons?domain=irasutoya.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440755/Irasutoya%20High%20Quality%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/440755/Irasutoya%20High%20Quality%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const links = document.getElementsByTagName("a")
    for(const link of links) {
        // Old style of images
        const type1 = /w=s\d+$/
        if(type1.test(link.href)) {
            link.href = link.href.replace(type1, "w=s8192")
            continue
        }

        // New style of images
        const type2 = /\/s\d+\//
        if(type2.test(link.href)) {
            link.href = link.href.replace(type2, "/s8192/")
            continue
        }
    }
})();