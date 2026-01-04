// ==UserScript==
// @name         Adjust Pixel Density - Bonk.io
// @description  Allows you to change what bonk.io thinks your DPI is, allowing you to render bonk.io at lower resolution.
// @author       Excigma
// @version      1.0.0
// @match        https://bonk.io/gameframe-release.html
// @namespace    https://github.com/Excigma
// @license      GPL-3.0
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438670/Adjust%20Pixel%20Density%20-%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/438670/Adjust%20Pixel%20Density%20-%20Bonkio.meta.js
// ==/UserScript==

// Scale is a number from 0 to 0.75.
// This affects all rendering including skins in the lobby.
const scale = 0.75; 

const getter = Object.getOwnPropertyDescriptor(window, "devicePixelRatio").get 
Object.defineProperty(window, "devicePixelRatio", {
    get() {
        return getter.call(window) * scale;
    }
});