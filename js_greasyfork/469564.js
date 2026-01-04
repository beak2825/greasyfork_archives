// ==UserScript==
// @name        meneame.net - Avatares cuadrados
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Viaje hacia atrás en el tiempo, hasta el pasado rancio de los avatares cuadrados
// @author      ochoceros
// @match       *://*.meneame.net/*
// @connect     meneame.net
// @icon        https://www.meneame.net/favicon.ico
// @grant       GM_addStyle
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/469564/meneamenet%20-%20Avatares%20cuadrados.user.js
// @updateURL https://update.greasyfork.org/scripts/469564/meneamenet%20-%20Avatares%20cuadrados.meta.js
// ==/UserScript==

const STYLE_OVERRIDE = "img.avatar, img.lazy {-moz-border-radius: 0% !important; -webkit-border-radius: 0% !important; border-radius: 0% !important;}";

function doDirtyThings() {
    GM_addStyle(STYLE_OVERRIDE);
}

doDirtyThings();