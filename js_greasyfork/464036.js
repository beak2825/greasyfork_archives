// ==UserScript==
// @name         AntiCheat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Try it for your self, Hackers :)
// @author       No-Nuro
// @match        *://*.moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464036/AntiCheat.user.js
// @updateURL https://update.greasyfork.org/scripts/464036/AntiCheat.meta.js
// ==/UserScript==

async function intervalCheck() {
if (document.title !== 'Moo Moo') {
alert('You\'re using hacks, aren\'t you?')
}

}
setInterval(intervalCheck, 500)