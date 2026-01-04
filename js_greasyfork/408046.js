// ==UserScript==
// @name        darkmode-js
// @namespace   http://tampermonkey.net/
// @match       *://*/*
// @grant       GM_addStyle
// @version     1.0
// @author      anonymous
// @description darkmode
// @require https://cdn.jsdelivr.net/npm/darkmode-js@1.5.5/lib/darkmode-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/408046/darkmode-js.user.js
// @updateURL https://update.greasyfork.org/scripts/408046/darkmode-js.meta.js
// ==/UserScript==

window.addEventListener('load', ()=>{
    GM_addStyle(`.darkmode-layer, .darkmode-toggle {
      z-index: 500;
    }`)
    new Darkmode().showWidget();
})