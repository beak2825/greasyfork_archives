// ==UserScript==
// @name         Hejto comment offset
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Offset comment section
// @author       Szynal
// @match        https://www.hejto.pl/*
// @grant    GM_addStyle
// @run-at   document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452635/Hejto%20comment%20offset.user.js
// @updateURL https://update.greasyfork.org/scripts/452635/Hejto%20comment%20offset.meta.js
// ==/UserScript==

GM_addStyle ( `
    .mt-2 {
        margin-left:4rem
    }
` );