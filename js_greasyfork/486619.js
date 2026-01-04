// ==UserScript==
// @name         change resolution
// @namespace    http://tampermonkey.net/
// @version      2024-02-04
// @description  press p
// @author       Ly
// @license      MIT
// @match        https://flowr.fun/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flowr.fun
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486619/change%20resolution.user.js
// @updateURL https://update.greasyfork.org/scripts/486619/change%20resolution.meta.js
// ==/UserScript==

//requested by xion

let resolution = 1 //idk if there is a better way to do this because i am suck at programming :/
document.addEventListener("keydown", event => {
    if (event.code === "KeyP") {
        resolution = prompt('Type in resolution. <1 for worse quality, >1 for higher quality. Keep in mind values higher than 3 or even 2 can cause lag and may crash your game. To update screen resolution, enter/exit fullscreen.')
        window.devicePixelRatio = parseFloat(resolution)
    }
})

