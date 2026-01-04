// ==UserScript==
// @name         Live Reaction helper
// @namespace    http://tampermonkey.net/
// @version      2024-09-05
// @description  This is a helper script to make the Live Page Reaction userscript work.
// @author       Riedler
// @match        https://*/*
// @icon         https://riedler.wien/favicon.png
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/506969/Live%20Reaction%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/506969/Live%20Reaction%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.id = 'livereaction-mainbody'

    let overlayElement = document.createElement('DIV')
    overlayElement.id = 'livereaction-overlay'
    overlayElement.innerHTML = "<span>LIVE</span><span id='livereaction-cam1'></span><span>REACTION</span><div id='livereaction-cam2'></div>"
    overlayElement.style.backgroundColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')
    document.documentElement.appendChild(overlayElement)
    document.addEventListener('scroll',(_event)=>{
        let offset = document.scrollingElement.scrollTop;
        document.documentElement.style.setProperty('--scrollTop', offset + 'px')
    })
    const rO = new ResizeObserver((entries)=>{
        let height = document.body.clientHeight;
        document.documentElement.style.setProperty('--clientHeight', height + 'px')
    });
    rO.observe(document.body)

})();