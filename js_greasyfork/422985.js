// ==UserScript==
// @name         minecraft.net scroll fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  干掉modal-open的overflow: hidden
// @author       You
// @match        https://www.minecraft.net/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-2.0.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/422985/minecraftnet%20scroll%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/422985/minecraftnet%20scroll%20fixer.meta.js
// ==/UserScript==

(function() {
    GM_addStyle('.modal-open {overflow: visible !important}');
})();
