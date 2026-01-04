// ==UserScript==
// @name         See Through Flow Player
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Display the video source link for FlowPlayer elements.
// @author       firetree
// @match        *://*/*
// @icon         none
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      WTFPL
// @require      https://scriptcat.org/lib/513/2.0.0/ElementGetter.js#sha256=KbLWud5OMbbXZHRoU/GLVgvIgeosObRYkDEbE/YanRU=
// @downloadURL https://update.greasyfork.org/scripts/484353/See%20Through%20Flow%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/484353/See%20Through%20Flow%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';
    elmGetter.each(".fp-player", document, el => {
        if (el.classList.contains("see-through-fplayer")) return
        let links = document.createElement("div")
        JSON.parse(el.parentElement.dataset.item).sources.forEach(src => {
            let link = document.createElement("a")
            link.href = src.src
            link.textContent = `${src.src} type: ${src.type}`
            link.target = '_blank'
            links.append(link)
        })
        el.after(links)
        el.classList.add("see-through-fplayer")
    })
})();