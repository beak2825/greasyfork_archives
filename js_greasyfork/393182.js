// ==UserScript==
// @name         attack temps
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/loader.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/393182/attack%20temps.user.js
// @updateURL https://update.greasyfork.org/scripts/393182/attack%20temps.meta.js
// ==/UserScript==

GM_addStyle(`
div[class^=iconsWrap] {
  z-index: 999;
}
`)