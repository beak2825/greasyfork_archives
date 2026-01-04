// ==UserScript==
// @name         2.5 speed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add 2.5x speed without need to inspect element
// @author       Commensalism
// @match        http*://gpop.io/create
// @match        http*://gpop.io/create3
// @match        http*://gpop.io/create/
// @match        http*://gpop.io/create3/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gpop.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453996/25%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/453996/25%20speed.meta.js
// ==/UserScript==

(function() {
    let gamespeedlist = document.querySelector("#main > div > div.createpage-left > div.createpage-left-gamespeed.noselect")
    let target = document.querySelector("#main > div > div.createpage-left > div.createpage-left-gamespeed.noselect > div:nth-child(2)")
    target.textContent = "2.5x"
    gamespeedlist.appendChild(target)
})();