// ==UserScript==
// @name         map donker
// @namespace    meldkamerspel.com
// @version      0.1
// @description  try to take over the world!
// @author       SanniHameln
// @match        https://www.meldkamerspel.com/*
 // @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370178/map%20donker.user.js
// @updateURL https://update.greasyfork.org/scripts/370178/map%20donker.meta.js
// ==/UserScript==

GM_addStyle(`
.leaflet-tile {
    filter: invert(1) grayscale(.7);
    -webkit-filter: invert(1) grayscale(.7);
}
`);