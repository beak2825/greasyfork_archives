// ==UserScript==
// @name         ZelenkaSnow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Снежок на форуме
// @author       Unitoshka
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482984/ZelenkaSnow.user.js
// @updateURL https://update.greasyfork.org/scripts/482984/ZelenkaSnow.meta.js
// ==/UserScript==

(function() {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://app.embed.im/snow.js'

    document.head.appendChild(script)
})();