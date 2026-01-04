// ==UserScript==
// @name         Photopea: prevent adblocker dialog spam
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevent window.dialog spam when using adblockers
// @author       Vassildador
// @match        https://www.photopea.com/
// @icon         https://www.google.com/s2/favicons?domain=photopea.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428984/Photopea%3A%20prevent%20adblocker%20dialog%20spam.user.js
// @updateURL https://update.greasyfork.org/scripts/428984/Photopea%3A%20prevent%20adblocker%20dialog%20spam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override window.fetch to make the adsbygoogle.js call always "succeed", without actually loading the script.
    // Photopea checks if this call fails to load their window.confirm spam
    const f = window.fetch;
    window.fetch = (...args) => {
        if (args[0].url.includes('adsbygoogle')) {
            console.info('Tampermonkey blocked adsbygoogle, and circumvented the adblock detection.');
            return Promise.resolve()
        }
        return f.call(window, ...args);
    }
    
    // This overrides the width of two elements that receive element style.
    // The applied element style ensures that there's always space for the ad container.
    // By specifying important rules, we can overrule it.
    const css = `
        body > div.flexrow.app > div:nth-child(1) > div.flexrow > div.panelblock.mainblock > div > div:nth-child(2) > div > canvas {
            /* full viewport - right panel width - left toolbar width */
            width: calc(100vw - 309px - 40px) !important;
        }
        body > div.flexrow.app > div:nth-child(1) > div.flexrow > div.panelblock.mainblock > div > div:nth-child(2) {
            /* full viewport - right panel width - left toolbar width */
            width: calc(100vw - 309px - 40px) !important;
        }
    `
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
})();