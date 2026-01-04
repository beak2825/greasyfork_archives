// ==UserScript==
// @name         Old text for games title
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Games instead of discover!
// @author       You
// @match        https://web.roblox.com/discover
// @match        https://web.roblox.com/discover/?Keyword=
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @license      none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455277/Old%20text%20for%20games%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/455277/Old%20text%20for%20games%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.title = "Games - Roblox";
})();