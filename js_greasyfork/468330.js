// ==UserScript==
// @name         FontBold
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world
// @author       xianmua
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468330/FontBold.user.js
// @updateURL https://update.greasyfork.org/scripts/468330/FontBold.meta.js
// ==/UserScript==

GM_addStyle(`
*:not(pre) {
-webkit-text-stroke: 0.3px !important;
}
`)