// ==UserScript==
// @name        Fix SOBS Notices Font Sizing
// @namespace   http://kwiius.com/
// @description For some reason, some notices are currently set to "font-size: 200%"
// @include     http*://sobs.co.nz/waz/studentnotices.php?*
// @version     2
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/10333/Fix%20SOBS%20Notices%20Font%20Sizing.user.js
// @updateURL https://update.greasyfork.org/scripts/10333/Fix%20SOBS%20Notices%20Font%20Sizing.meta.js
// ==/UserScript==

GM_addStyle (" body > div#main > div { font-size: 100% !important; }");
GM_addStyle ("div.keeptogether { width: auto !important; max-width: none !important; }");