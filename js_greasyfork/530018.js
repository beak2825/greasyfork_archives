// ==UserScript==
// @name         Geoguessr point to South (M)
// @description  Press M to point the streetview map due south
// @version      1.0
// @author       Noah
// @match        *://*.geoguessr.com/*
// @run-at       document-start
// @grant        none
// @license     MIT
// @namespace https://greasyfork.org/users/1446528
// @downloadURL https://update.greasyfork.org/scripts/530018/Geoguessr%20point%20to%20South%20%28M%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530018/Geoguessr%20point%20to%20South%20%28M%29.meta.js
// ==/UserScript==
let MWStreetViewInstance;

function overrideOnLoad(googleScript, observer, overrider) {
    const oldOnload = googleScript.onload;
    googleScript.onload = (event) => {
        const google = window.google;
        if (google) {
            observer.disconnect();
            overrider(google);
        }
        if (oldOnload) {
            oldOnload.call(googleScript, event);
        }
    };
}

function grabGoogleScript(mutations) {
    for (const mutation of mutations) {
        for (const newNode of mutation.addedNodes) {
            if (newNode && newNode.src && newNode.src.startsWith('https://maps.googleapis.com/')) {
                return newNode;
            }
        }
    }
    return null;
}

function injecter(overrider) {
    if (document.documentElement) {
        injecterCallback(overrider);
    }
}

function injecterCallback(overrider) {
    new MutationObserver((mutations, observer) => {
        const googleScript = grabGoogleScript(mutations);
        if (googleScript) {
            overrideOnLoad(googleScript, observer, overrider);
        }
    }).observe(document.documentElement, { childList: true, subtree: true });
}

document.addEventListener('DOMContentLoaded', () => {
    injecter(() => {
        google.maps.StreetViewPanorama = class extends google.maps.StreetViewPanorama {
            constructor(...args) {
                super(...args);
                MWStreetViewInstance = this;
            }
        };
    });
});

document.addEventListener('keyup', (event) => {
    const settings = JSON.parse(window.localStorage.getItem('game-settings')) ?? { forbidRotating: false, noMove: false };
    if (settings.forbidRotating || settings.noMove) return; // Disable in NMPZ mode

    if (MWStreetViewInstance && event.key.toLowerCase() === 'm') {
        let pov = MWStreetViewInstance.getPov();
        pov.heading = 180;
        MWStreetViewInstance.setPov(pov);
    }
});
