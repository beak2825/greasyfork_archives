// ==UserScript==
// @name         Learn4school hack
// @namespace    http://tampermonkey.net/
// @version      2024-03-14
// @description  l4s hack!
// @author       Samuel
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=learn4school.ch
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489830/Learn4school%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/489830/Learn4school%20hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var pageSiteIndex = document.getElementById("page-site-index");
    if(pageSiteIndex) {
        pageSiteIndex.parentNode.removeChild(pageSiteIndex);
    }
})();