// ==UserScript==
// @name         DPVS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disable Page Visibility API Script
// @author       Psyblade
// @match       *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32726/DPVS.user.js
// @updateURL https://update.greasyfork.org/scripts/32726/DPVS.meta.js
// ==/UserScript==

Object.defineProperties(document.wrappedJSObject,{ 'hidden': {value: false}, 'visibilityState': {value: 'visible'} });
window.addEventListener( 'visibilitychange', evt => evt.stopImmediatePropagation(), true);
