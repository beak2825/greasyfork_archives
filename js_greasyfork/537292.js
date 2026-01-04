// ==UserScript==
// @name         hide chat & names
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hide chat & name
// @author       nguyen33kk
// @match        https://sploop.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sploop.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537292/hide%20chat%20%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/537292/hide%20chat%20%20names.meta.js
// ==/UserScript==

const { fillText, strokeText, drawImage } = CanvasRenderingContext2D.prototype;

CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
        if (this.fillStyle != '#8ecc51' && text.length > 0 && text.charAt(0) != "[" && text.charAt(text.length - 1) != "]" && y == 19) {
            return;
        }
    fillText.apply(this, arguments);
}

CanvasRenderingContext2D.prototype.strokeText = function(text, x, y) {
        if (this.fillStyle != '#8ecc51' && text.length > 0 && text.charAt(0) != "[" && text.charAt(text.length - 1) != "]" && y == 19) {
            return;
        }
    strokeText.apply(this, arguments);
}


TextDecoder.prototype.decode = function() {
            return "";
        }
