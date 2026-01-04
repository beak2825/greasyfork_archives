// ==UserScript==
// @name         cirosantilli NM$L
// @namespace    https://greasyfork.org/zh-CN/users/314234-yong-hu-ming
// @version      1.0.1
// @description  cirosantilli你妈死了
// @author       Yong_Hu_Ming
// @match        https://github.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @run-at       document-start
// @license      WTFPL
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/520925/cirosantilli%20NM%24L.user.js
// @updateURL https://update.greasyfork.org/scripts/520925/cirosantilli%20NM%24L.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const css = `div[data-testid="results-list"] > div:has(a[href^="/cirosantilli"]) {
    display: none !important;
}`
    GM_addStyle(css);
})();