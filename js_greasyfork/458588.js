// ==UserScript==
// @name         Comic Sans global
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Change font to Comic Sans everywhere
// @author       Ugolf
// @match        *://*wykop.pl/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/458588/Comic%20Sans%20global.user.js
// @updateURL https://update.greasyfork.org/scripts/458588/Comic%20Sans%20global.meta.js
// ==/UserScript==

GM_addStyle(`
    * {
        font-family: "Comic Sans MS", "Comic Sans", cursive, sans-serif !important;
    }
`);
