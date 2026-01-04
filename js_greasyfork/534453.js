// ==UserScript==
// @name         JIMU Tools
// @namespace    http://tampermonkey.net/
// @version      2025-05-15-1
// @description  JIMU Tools, you can use this in tcs pages
// @author       James
// @match        *://*.tiktok-row.net/workprocess*
// @match        *://*.tiktok-eu.net/workprocess*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok-row.net
// @grant        none
// @website      https://bytedance.larkoffice.com/wiki/Tc2Iwf7QuiKdMGkViatcjJxTn2c
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534453/JIMU%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/534453/JIMU%20Tools.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const script = document.createElement('script')
    //    script.src = 'https://0.0.0.0:3000/static/js/main.js' // try to edit
    script.src = 'https://cdn-tos-va.byteintl.net/obj/archi-us/coresafety_jimu_chrome_plugin/static/js/main.1.0.0.8.js'
    document.body.appendChild(script)
})();