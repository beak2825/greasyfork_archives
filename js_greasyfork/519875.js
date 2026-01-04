// ==UserScript==
// @name         Spotify unblock right click and text selection
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  This userscript restores the ability to right-click and select text on the Spotify web page
// @author       aqemi
// @match        https://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519875/Spotify%20unblock%20right%20click%20and%20text%20selection.user.js
// @updateURL https://update.greasyfork.org/scripts/519875/Spotify%20unblock%20right%20click%20and%20text%20selection.meta.js
// ==/UserScript==



(async function() {
    'use strict';

    async function waitForElement(selector, win = window) {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                const node = win.document.querySelector(selector);
                if (node) {
                    clearInterval(interval);
                    resolve(node);
                }
            }, 250);
        });
    }

    const css = `
    * {
      user-select: text; !important;
    }`;


    const nativeEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function (event, ...args) {
        if (!['contextmenu'].includes(event)) {
            nativeEventListener.call(this, event, ...args);
        }
    };

    window.addEventListener('load', async () => {
        try {
            const style = document.createElement('style');
            style.innerHTML = css;
            document.head.appendChild(style);
            setInterval(() => {
                document.querySelectorAll('[draggable=true]').forEach(element => {
                    element.draggable = false;
                });
            }, 1000);
        } catch(error) {
            console.error(error);
        }
    });
})();