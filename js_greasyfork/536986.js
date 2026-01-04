// ==UserScript==
// @name         Murens Fald
// @namespace    https://greasyfork.org/en/users/864921-greasyshark
// @version      0.1
// @description  Murens Fald på udvalgte sites
// @author       Martin Larsen
// @match        https://goerdetselv.dk/*
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/536986/Murens%20Fald.user.js
// @updateURL https://update.greasyfork.org/scripts/536986/Murens%20Fald.meta.js
// ==/UserScript==

GM_addStyle(`

.mkt-placement-8 { display: none !important }

.file.paywall .grid__item--content a.btn {
    pointer-events: inherit  !important;
    opacity: inherit !important;
}
.file.paywall .pdf-preview__footer, .file.paywall .pdf-preview__item {
    cursor: inherit !important;
}

`);
