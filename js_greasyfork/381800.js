// ==UserScript==
// @name         Canvas Fingerprint Blocker
// @namespace    https://github.com/joue-quroi/canvas-fingerprint-blocker
// @version      0.1
// @description  Block HTML canvas element from being used for fingerprinting purposes
// @author       Joue Quroi
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381800/Canvas%20Fingerprint%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/381800/Canvas%20Fingerprint%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document instanceof XMLDocument) {
        return;
    }

    // https://add0n.com/canvas-fingerprint-blocker.html
    // https://github.com/joue-quroi/canvas-fingerprint-blocker
    // https://mybrowseraddon.com/canvas-defender.html
    // Modified by Ganlv

    const toBlob = HTMLCanvasElement.prototype.toBlob;
    const toDataURL = HTMLCanvasElement.prototype.toDataURL;

    HTMLCanvasElement.prototype.htGfd = function() {
        const {width, height} = this;
        const context = this.getContext('2d');
        const shift = {
            'r': Math.floor(Math.random() * 10) - 5,
            'g': Math.floor(Math.random() * 10) - 5,
            'b': Math.floor(Math.random() * 10) - 5
        };
        const matt = context.getImageData(0, 0, width, height);
        for (let i = 0; i < height; i += 3) {
            for (let j = 0; j < width; j += 3) {
                const n = ((i * (width * 4)) + (j * 4));
                matt.data[n + 0] = matt.data[n + 0] + shift.r;
                matt.data[n + 1] = matt.data[n + 1] + shift.g;
                matt.data[n + 2] = matt.data[n + 2] + shift.b;
            }
        }
        context.putImageData(matt, 0, 0);
        this.htGfd = () => {
            window.top.postMessage('htGfd-called', '*');
        };
        window.top.postMessage('htGfd-called', '*');
    };

    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function() {
            if (document.documentElement.dataset.htgfd !== 'false') {
                this.htGfd();
            }
            return toBlob.apply(this, arguments);
        }
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
        value: function() {
            if (document.documentElement.dataset.htgfd !== 'false') {
                this.htGfd();
            }
            return toDataURL.apply(this, arguments);
        }
    });
    document.documentElement.dataset.htGfd = true;
})();