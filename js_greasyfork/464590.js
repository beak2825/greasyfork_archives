// ==UserScript==
// @name         twimaru font
// @namespace    http://tampermonkey.net/
// @description futaba sumaho to yomichan
// @version      0.4
// @run-at document-start
// @description  try to take over the world!
// @author       You
// @match        http://twimaru.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twimaru.com
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/464590/twimaru%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/464590/twimaru%20font.meta.js
// ==/UserScript==

GM_addStyle ( `
.balloon {
  font-size: 14px !important;
}
` );
