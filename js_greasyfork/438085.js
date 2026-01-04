// ==UserScript==
// @name        barra titolo scorrevole figuccio
// @description barra titolo scheda scorrevole
// @version     1
// @include     *
// @noframes
// @author      figuccio
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @namespace https://greasyfork.org/users/237458
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/438085/barra%20titolo%20scorrevole%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/438085/barra%20titolo%20scorrevole%20figuccio.meta.js
// ==/UserScript==
var documentTitle = document.title + " - ";
(function titleMarquee() {
    document.title = documentTitle = documentTitle.substring(1) + documentTitle.substring(0,1);
    setTimeout(titleMarquee, 200);
})();