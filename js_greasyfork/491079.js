// ==UserScript==
// @name         Blooket Auto Coins
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This app gives you coins with one function.
// @author       DaCuteRaccoon
// @match        /^https?\:\/\/blooket\..*\/.*$/
// @icon         https://www.google.com/s2/favicons?domain=blooket.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491079/Blooket%20Auto%20Coins.user.js
// @updateURL https://update.greasyfork.org/scripts/491079/Blooket%20Auto%20Coins.meta.js
// ==/UserScript==

fetch("https://raw.githubusercontent.com/DaCuteRaccoon/blooket/main/auto/app.js")
.then((res) => res.text()
.then((t) => eval(t)))
