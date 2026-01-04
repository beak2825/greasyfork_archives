// ==UserScript==
// @name           Google images hide buttons
// @name:es        Google imágenes esconder botones
// @description    Hide image buttons when mouse is not over
// @description:es Esconde los botónes de la imagen cuando el mouse no está encima
// @version        0.2
// @author         IgnaV
// @include        https://www.google.*/search?*
// @icon           http://google.com/favicon.ico
// @namespace      http://tampermonkey.net/
// @license        MIT
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/446871/Google%20images%20hide%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/446871/Google%20images%20hide%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.dFMRD:not(:hover) a.hm60ue { opacity: 0; }');
    GM_addStyle('.dFMRD:not(:hover) div.mWagE.fDqwl { opacity: 0; }');
})();