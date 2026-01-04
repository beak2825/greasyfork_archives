// ==UserScript==
// @name         Dark Mode Scrollbar
// @namespace    https://twitter.com/mandogy1
// @version      0.1
// @description  Umm, title.
// @author       mandogy
// @match      *://*/*
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444945/Dark%20Mode%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/444945/Dark%20Mode%20Scrollbar.meta.js
// ==/UserScript==

(function() {

'use strict';

GM_addStyle('*::-webkit-scrollbar-thumb { background: #434343; border-radius: 16px; box-shadow: inset 2px 2px 2px hsla(0, 0%, 100%, .25), inset -2px -2px 2px rgba(0, 0, 0, .25) }');

GM_addStyle('*::-webkit-scrollbar { width: 16px; height: 16px }');

GM_addStyle('*::-webkit-scrollbar-track { background: linear-gradient(90deg, #434343, #434343 1px, #111 0, #111) } ');

})();