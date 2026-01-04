// ==UserScript==
// @name         Disable YouTube Glow/Ambilight
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script that removes the shitty glow/ambilight effect on the new YouTube downgrade. It sucks ass because it's in 8-bit colorspace, has a smoothing effect, and is overall just weird on your eyes, seriously thoguht my eyes were fucked lmao
// @author       TB-303
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/453801/Disable%20YouTube%20GlowAmbilight.user.js
// @updateURL https://update.greasyfork.org/scripts/453801/Disable%20YouTube%20GlowAmbilight.meta.js
// ==/UserScript==

(function() {
    'use strict';


    GM_addStyle
    (`#cinematics.ytd-watch-flexy {
    display: none;
    }
   `)

})();