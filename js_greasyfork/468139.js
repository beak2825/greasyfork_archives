// ==UserScript==
// @name        notrav-linuxfr.org
// @namespace   Violentmonkey Scripts
// @match       https://linuxfr.org/
// @license MIT
// @grant       GM_addStyle
// @version     1.0
// @author      -
// @description 6/7/2023, 1:01:23 PM
// @downloadURL https://update.greasyfork.org/scripts/468139/notrav-linuxfrorg.user.js
// @updateURL https://update.greasyfork.org/scripts/468139/notrav-linuxfrorg.meta.js
// ==/UserScript==
GM_addStyle(`
header#branding > h1 { background-image: url(/images/logos/logo-linuxfr-cadre.png) !important; }
`);
