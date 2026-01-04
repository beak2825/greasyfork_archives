// ==UserScript==
// @name         恢复右键菜单
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @include      *
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373570/%E6%81%A2%E5%A4%8D%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/373570/%E6%81%A2%E5%A4%8D%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

function recovery () {
    return true;
}
document.oncontextmenu = recovery();
document.body.oncontextmenu = recovery();
