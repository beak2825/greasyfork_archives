// ==UserScript==
// @name         Rainbow border for flowgame.io
// @namespace    http://tampermonkey.net/
// @version      3
// @description  u can change the speed here (function() {var speed = 5; have fun with the script flow players!
// @author       Sakuro
// @match        *://*.flowgame.io/
// @match        *://*.flowy.gg/*
// @license MIT 
// @grant        document-start
// @downloadURL https://update.greasyfork.org/scripts/443093/Rainbow%20border%20for%20flowgameio.user.js
// @updateURL https://update.greasyfork.org/scripts/443093/Rainbow%20border%20for%20flowgameio.meta.js
// ==/UserScript==
 
 
if (window.flowExtensions) {
  window.flowExtensions.register('https://greasyfork.org/en/scripts/442172-rainbow-border');
}
var rainbowMode = true;
var borderColor = '#FFFFFF';
 
//  --- --- --- --- --- --- ---
 
(function() {
    var speed = 5;
    function hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
 
    var stroke = CanvasRenderingContext2D.prototype.stroke;
    CanvasRenderingContext2D.prototype.stroke = function(){
        if(this.lineWidth < 0 || this.strokeStyle == "#ffffff" || this.strokeStyle == "#333333" || this.strokeStyle == "#7f7f7f" || this.strokeStyle.slice(5,7) != this.strokeStyle.slice(3,5)) return stroke.apply(this, arguments);
        this.strokeStyle = rainbowMode ? hslToHex(Math.floor(Date.now() / speed) % 360, 100, 50) : borderColor;
        return stroke.apply(this, arguments);
    }
})();