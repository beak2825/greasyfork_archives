// ==UserScript==
// @name         Sankaku Complex | No blurred images
// @namespace    none
// @version      0.201703162053
// @description  Will simply remove the blurred images caused by the image having blacklisted tags on the gallary sites of Sankaku Complex
// @author       mysteriousLynx
// @include      *://idol.sankakucomplex.com/*
// @include      *://chan.sankakucomplex.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/28170/Sankaku%20Complex%20%7C%20No%20blurred%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/28170/Sankaku%20Complex%20%7C%20No%20blurred%20images.meta.js
// ==/UserScript==

GM_addStyle(".thumb.blacklisted { display: none !important }");