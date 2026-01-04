// ==UserScript==
// @license MIT
// @name         4chan fixer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  replaces "is2.4chan.org" with "i.4cdn.org"
// @author       You
// @match        https://boards.4channel.org/*
// @match        https://boards.4chan.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4channel.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475695/4chan%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/475695/4chan%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var as = document.getElementsByTagName("a");
    for (var i = 0; i < as.length; i++) {
        let a = as[i];
        let href = a.getAttribute("href");
        if (href.includes("is2.4chan.org")) {
            let l = href.replace("is2.4chan.org", "i.4cdn.org");
            a.setAttribute("href", l)
        }
    }
})();