// ==UserScript==
// @name         manga-scans css
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Fix the CSS on manga-scans
// @license MIT
// @author       myklosbotond
// @match        https://manga-scans.com/chapter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=areturnermagic.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/477994/manga-scans%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/477994/manga-scans%20css.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.code-block {
    display: none !important;
}

.entry-content .separator .aligncenter {
  border: 0;
  border-radius: 0;
}

.aligncenter, div.aligncenter {
    margin: 0 auto;
}

nav.navbar-fixed-top {
    position: relative;
}

.next-post, .prev-post {
    padding: 0;
}

.next-post a, .prev-post a {
    padding: 10px;
    display: block;
}

div.post-navigation {
    position: relative !important;
}

div.post-navigation:nth-of-type(1) {
    display: block !important;
}
    `)
})();