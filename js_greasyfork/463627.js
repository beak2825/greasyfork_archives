// ==UserScript==
// @name         Zebra tables
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.2
// @description  For those who like to see patterns everywhere
// @author       Milan
// @match        *://*.websight.blue/threads/*
// @match        *://*.websight.blue/multi/*
// @match        *://websight.blue
// @match        *://*.websight.blue
// @icon         https://lore.delivery/static/blueshi.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463627/Zebra%20tables.user.js
// @updateURL https://update.greasyfork.org/scripts/463627/Zebra%20tables.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`#thread-list tr:nth-child(even) td { background: var(--ActiveThread); }
                #thread-list tr:nth-child(odd) td { background: var(--MsgBG); }`);
})();