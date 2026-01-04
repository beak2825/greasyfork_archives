// ==UserScript==
// @name         See Through DPlayer
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Display the video source link for DPlayer elements which have <video> elements under the hood.
// @author       firetree
// @match        *://*/*
// @icon         none
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      WTFPL
// @require      https://scriptcat.org/lib/513/2.0.0/ElementGetter.js#sha256=KbLWud5OMbbXZHRoU/GLVgvIgeosObRYkDEbE/YanRU=
// @downloadURL https://update.greasyfork.org/scripts/476310/See%20Through%20DPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/476310/See%20Through%20DPlayer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    elmGetter.each(".dplayer", document, el => {
        if (el.classList.contains("see-through-dplayer")) return
        let link = document.createElement("a")
        link.href = el.querySelector("video").src
        link.textContent = link.href
        link.target = '_blank'
        el.after(link)
        el.classList.add("see-through-dplayer")
    })
})();