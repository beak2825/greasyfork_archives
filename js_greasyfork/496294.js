// ==UserScript==
// @name         [WORKING 2025] Disable Aternos Anti-Adblock
// @homepageURL  https://discord.gg/wufkp8Q5wu
// @description  Disable the Anti-Adblock on Aternos.org to use it without Ads. (This script is to be used along with Ublock Origin)
// @author       ascended1013 (https://discord.com/users/1287316126535258136)

// @match        https://aternos.org/*

// @version      2.2
// @run-at       document-start
// @grant        unsafeWindow

// @license      MIT
// @supportURL   https://discord.gg/wufkp8Q5wu
// @icon         https://files.catbox.moe/5hnfoq.png
// @namespace https://greasyfork.org/users/1237543
// @downloadURL https://update.greasyfork.org/scripts/521704/%5BWORKING%202025%5D%20Disable%20Aternos%20Anti-Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/521704/%5BWORKING%202025%5D%20Disable%20Aternos%20Anti-Adblock.meta.js
// ==/UserScript==

let r = unsafeWindow.Array.prototype.push;
unsafeWindow.Array.prototype.push = function(...t) {
    try {
        throw new Error
    } catch (e) {
        if (e.stack.includes("data:text/javascript")) throw new Error;
        return r.apply(this, t)
    }
};
let t = unsafeWindow.Proxy;
unsafeWindow.Proxy = function(r, e) {
    try {
        JSON.stringify(r) == '{}' && (e.get = () => () => !0)
    } catch (r) {}
    return new t(r, e)
}
setInterval((() => {
    Array.from(document.querySelectorAll("*")).filter((r => r.style.zIndex)).forEach((r => r.remove()))
}), 100);