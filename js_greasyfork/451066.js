// ==UserScript==
// @name         Glassdoor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ok
// @author       You
// @include      https://www.glassdoor.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glassdoor.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451066/Glassdoor.user.js
// @updateURL https://update.greasyfork.org/scripts/451066/Glassdoor.meta.js
// ==/UserScript==

mainCicle()

function mainCicle(){
    const overlay = document.querySelector('#HardsellOverlay')
    if(overlay) {
        overlay.remove()
        document.body.style.overflow = ''
        window.onscroll = null
    }

    setTimeout(mainCicle,500)
}