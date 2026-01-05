// ==UserScript==
// @name         sleduj.serial.com
// @namespace    https://greasyfork.org/sk/scripts/26963-sleduj-serial-com
// @version      1.0
// @description  Editing www.sledujserial.com for optimal viewing.
// @author       achares
// @include      http://www.sledujserial.com*
// @grant        GM_addStyle
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/26963/sledujserialcom.user.js
// @updateURL https://update.greasyfork.org/scripts/26963/sledujserialcom.meta.js
// ==/UserScript==

GM_addStyle('html body div {background-color: #2B2D2E !important;}');
document.getElementById('fb-root').remove();
document.getElementById('logo-container').remove();
document.getElementById('sidebar').remove();