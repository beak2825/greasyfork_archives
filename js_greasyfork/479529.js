// ==UserScript==
// @name         Cryzen.io Visible models
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Makes models better visible
// @author       Enth
// @match        https://cryzen.io/*
// @icon         https://media.discordapp.net/attachments/921558341791129671/1172861950347194410/image.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/479529/Cryzenio%20Visible%20models.user.js
// @updateURL https://update.greasyfork.org/scripts/479529/Cryzenio%20Visible%20models.meta.js
// ==/UserScript==

// resource overrider
const srcset = Object.getOwnPropertyDescriptor(Image.prototype, 'src').set;
function getSqareDataURL(width, height, color) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, width, height);
    const dataURL = canvas.toDataURL();
    return dataURL;
}
Object.defineProperty(Image.prototype, 'src', {
    set(value) {
        this._src = value;
        if (typeof value != 'string') {
            return srcset.call(this, value);
        }
        if (value.includes('colorMap')) {
            if (value.toLowerCase().includes('red')) {
                value = getSqareDataURL(1000, 1000, '#FF7373');
            } else if (value.toLowerCase().includes('blue')) {
                value = getSqareDataURL(1000, 1000, '#00FFFF');
            } else {
                value = getSqareDataURL(1000, 1000, '#73FF73');
            }
        }
        if (value.includes('map-')) {
            value = getSqareDataURL(4096, 2048, '#AAAAAA');
        }
        srcset.call(this, value);
    },
    get() {
        return this._src;
    }
});