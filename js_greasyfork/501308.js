// ==UserScript==
// @name         Leader Arrow Opacity
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  To change your leader arrow opacity, edit the value after "this.globalAlpha = ". 0 is least opacity and 1 is greatest opacity. Opacity is set to 1 at default.
// @match        *://*.diep.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501308/Leader%20Arrow%20Opacity.user.js
// @updateURL https://update.greasyfork.org/scripts/501308/Leader%20Arrow%20Opacity.meta.js
// ==/UserScript==

CanvasRenderingContext2D.prototype._fill = CanvasRenderingContext2D.prototype._fill || CanvasRenderingContext2D.prototype.fill;
CanvasRenderingContext2D.prototype.fill = function() {
    if (this.canvas.id === 'canvas' && this.fillStyle === '#000000') {
        this.globalAlpha = 1
    }
    this._fill()
}