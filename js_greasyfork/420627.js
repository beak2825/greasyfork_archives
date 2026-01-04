// ==UserScript==
// @name         Transparent Theme
// @namespace    oy
// @version      0.1
// @description  yo
// @author       Salt
// @match        https://arras.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420627/Transparent%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/420627/Transparent%20Theme.meta.js
// ==/UserScript==

console.log("%c Transparent Theme", "color: #B9E87E; font-size: 1.4em;");
console.log("%c Developed By Salt", "color: #8ABC3F; font-size: 1.1em;");

CanvasRenderingContext2D.prototype._stroke = CanvasRenderingContext2D.prototype._stroke || CanvasRenderingContext2D.prototype.stroke;
CanvasRenderingContext2D.prototype._fillText = CanvasRenderingContext2D.prototype._fillText || CanvasRenderingContext2D.prototype.fillText
CanvasRenderingContext2D.prototype._strokeText = CanvasRenderingContext2D.prototype._strokeText || CanvasRenderingContext2D.prototype.strokeText

CanvasRenderingContext2D.prototype.stroke = function() {
    this.shadowBlur = this.lineWidth / 2;// remove this line to have no blur
    this.shadowColor = this.strokeStyle; // remove this line to have no blur
    this.fillStyle = "transparent"
    this._stroke(...arguments)
    this.shadowBlur = 0; // remove this line for no blur
};
CanvasRenderingContext2D.prototype.fillText = function() {
    this._fillText(...arguments)
    this.shadowBlur = 0;
};

CanvasRenderingContext2D.prototype.strokeText = function() {
    this.strokeStyle = "transparent"
    this._strokeText(...arguments);
};
