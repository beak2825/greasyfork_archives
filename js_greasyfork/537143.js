// ==UserScript==
// @name         luaobfuscator design fix!!
// @namespace    http://tampermonkey.net/
// @version      2025-05-24
// @description  removes the goofy roblox avatars in the homepage
// @author       p1d4k
// @run-at document-end
// @match        https://luaobfuscator.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luaobfuscator.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537143/luaobfuscator%20design%20fix%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/537143/luaobfuscator%20design%20fix%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const goofything = document.getElementById("home-page-start")
    goofything.remove();
})();