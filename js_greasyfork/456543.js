// ==UserScript==
// @name         Auto Click Download for Anonfiles, Bayfiles, GoFile
// @namespace    https://cracked.io/Faramir
// @version      0.2
// @description  Auto click download button.
// @author       Faramir
// @license      MIT
// @match        *://anonfiles.com/*
// @match        *://bayfiles.com/*
// @match        *://gofile.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anonfiles.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/456543/Auto%20Click%20Download%20for%20Anonfiles%2C%20Bayfiles%2C%20GoFile.user.js
// @updateURL https://update.greasyfork.org/scripts/456543/Auto%20Click%20Download%20for%20Anonfiles%2C%20Bayfiles%2C%20GoFile.meta.js
// ==/UserScript==
const interval = setInterval(() => {
    const element = document.querySelector('#download-url, a[href*="download"]');
    if (element) {
        element.click();
        clearInterval(interval);
    }
}, 500);