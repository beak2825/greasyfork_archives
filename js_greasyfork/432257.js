// ==UserScript==
// @name         Glassdoor Paywall Zapper
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Remove paywall & restore scroll functionality on Glassdoor
// @author       Brian Xiang <brian@cf12.org>
// @match        https://*.glassdoor.com/*
// @icon         https://www.google.com/s2/favicons?domain=glassdoor.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432257/Glassdoor%20Paywall%20Zapper.user.js
// @updateURL https://update.greasyfork.org/scripts/432257/Glassdoor%20Paywall%20Zapper.meta.js
// ==/UserScript==

window.onload = () => {
    document.querySelector('#ContentWallHardsell').style.display = 'none'
    document.body.style.overflow = 'auto'
    window.addEventListener('scroll', e => e.stopPropagation(), true)
}
