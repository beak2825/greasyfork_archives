// ==UserScript==
// @name         A1111 WebUI fix lobe theme
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  fix Lobe theme broken webui v1.6.0RC
// @author       SLAPaper
// @match        http*://localhost:7860/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474294/A1111%20WebUI%20fix%20lobe%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/474294/A1111%20WebUI%20fix%20lobe%20theme.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function patchDOM() {
    waitForElm('#txt2img_settings').then((elm) => {
        elm.parentElement.style.removeProperty("display");
    });

    waitForElm('#img2img_settings').then((elm) => {
        elm.parentElement.style.removeProperty("display");
    });

    waitForElm('#quicksettings').then((elm) => {
        elm.style.setProperty("flex-direction", "unset");
    });
}

(function() {
    'use strict';

    // Your code here...
    setInterval(patchDOM, 5000);
})();