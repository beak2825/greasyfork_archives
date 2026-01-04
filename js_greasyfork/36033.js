// ==UserScript==
// @run-at       document-start
// @name         Twitch BetterTTV without extension
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  This script load bttv without having to download the extension;
// @author       Daybr3akz
// @license      MIT
// @copyright    2017, daybreakz (https://openuserjs.org/users/daybreakz)
// @match        https://www.twitch.tv/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/36033/Twitch%20BetterTTV%20without%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/36033/Twitch%20BetterTTV%20without%20extension.meta.js
// ==/UserScript==

// // ==OpenUserJS==
// @author daybreakz
// ==/OpenUserJS==

/*
 * This user script loads 1 external scripts aka
 * https://cdn.betterttv.net/betterttv.js, see https://github.com/night/BetterTTV
 */

const STORAGE_ENTRY = 'bttv_from_localhost';
const LOCALHOST_WARNING = `Add ' chrome://flags/#allow-insecure-localhost ' to allow loading from localhost;
Don't forget to change the CDN url in "src/utils/cdn.js" to localhost, otherwise styles won't reflect your changes.`;

let BTTV_URL = 'https://cdn.betterttv.net/betterttv.js';
const fromLocalhost = localStorage.getItem(STORAGE_ENTRY) === 'true';
if (fromLocalhost) {
    BTTV_URL = 'https://localhost/betterttv.js';
}
unsafeWindow.toggleBttvDev = () => {
    const fromLocalhost = localStorage.getItem(STORAGE_ENTRY) === 'true';
    localStorage.setItem(STORAGE_ENTRY, !fromLocalhost);
    console.log(`changed bttv script to ${fromLocalhost ? 'cdn.betterttv.net' : 'localhost'}. You can refresh to see the changes.`);
    if (!fromLocalhost) {
        console.warn(LOCALHOST_WARNING);
    }
};

(function patchCss() {
    // fix screen glitch when player goes from theatre mode to full screen.
    const css = `
    .video-player--theatre.video-player--fullscreen .video-player__container {
        bottom: 0rem!important
    }`;
    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);
})();

(function betterttv() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    if (fromLocalhost) {
        console.warn(LOCALHOST_WARNING);
    }
    script.src = BTTV_URL;
    script.onload = () => {
        console.warn(`BetterTTV loaded from ${fromLocalhost ? 'localhost' : 'cdn.betterttv.net'}`);
    };
    document.documentElement.appendChild(script);
})();
