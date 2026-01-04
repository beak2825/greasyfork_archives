// ==UserScript==
// @name         Nitro Nuker
// @version      0.1
// @description  Nukes Nitro.
// @match        *://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/784494
// @downloadURL https://update.greasyfork.org/scripts/477446/Nitro%20Nuker.user.js
// @updateURL https://update.greasyfork.org/scripts/477446/Nitro%20Nuker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    a[href = "/store"], a[href = "/shop"] {display: none;}
    `);
})();