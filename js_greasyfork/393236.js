// ==UserScript==
// @name         sodu skip gourl
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://www.sodu.cc/mulu_*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393236/sodu%20skip%20gourl.user.js
// @updateURL https://update.greasyfork.org/scripts/393236/sodu%20skip%20gourl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for(let a of document.querySelectorAll(".main-html a"))
    {
        if(a.href.includes("chapterurl="))
            a.href = a.href.substr(a.href.indexOf("chapterurl=")+11);
    }

    // Your code here...
})();