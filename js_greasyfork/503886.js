// ==UserScript==
// @name         Focus progress bar
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Gets rid of arrow control for volume.
// @author       Daniel Bonofiglio
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503886/Focus%20progress%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/503886/Focus%20progress%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict'

    const interval = setInterval(() => {
        if (document.querySelector(".ytp-volume-panel") === null) return

        document.querySelector(".ytp-volume-panel").onmouseup = () => {
            document.querySelector(".ytp-progress-bar").focus()
        }

        document.querySelector(".ytp-volume-panel").onmouseleave = () => {
            document.querySelector(".ytp-progress-bar").focus()
        }

        clearInterval(interval)
    }, 100)
})();