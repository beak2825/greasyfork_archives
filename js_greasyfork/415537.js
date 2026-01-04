// ==UserScript==
// @name         Better FPS Everywhere In Your Browser!
// @namespace    Better FPS Everywhere In Your Browser!
// @version      none
// @description  It doesnt have any toggles, everything is simple: you use it - it auto runs and makes you fps better.
// @author       Nexo#9141
// @match        *://*/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415537/Better%20FPS%20Everywhere%20In%20Your%20Browser%21.user.js
// @updateURL https://update.greasyfork.org/scripts/415537/Better%20FPS%20Everywhere%20In%20Your%20Browser%21.meta.js
// ==/UserScript==

setInterval(function() {
    window.location.native_resolution = true;
    window.devicePixelRatio = 0.8;
}, 1000)