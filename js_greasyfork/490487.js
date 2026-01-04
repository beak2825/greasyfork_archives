// ==UserScript==
// @name         Cryzen.io Map Darkmode
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Makes maps darkmode
// @author       VALIDUSER
// @match        https://cryzen.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/490487/Cryzenio%20Map%20Darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/490487/Cryzenio%20Map%20Darkmode.meta.js
// ==/UserScript==
(function() {
    'use strict';
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
            if (typeof value != 'string') { return srcset.call(this, value); }
            if (value.includes('colorMap')) { value = getSqareDataURL(1, 1, '#000000'); }
            if (value.includes('map-')) { value = getSqareDataURL(1, 1, '#212121'); }
            if (value.includes('sky')) { value = getSqareDataURL(1, 1, '#212121'); }
            srcset.call(this, value);
        },
        get() { return this._src; }
    });
})();