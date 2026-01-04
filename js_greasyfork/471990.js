// ==UserScript==
// @name         Shadow visual and more
// @namespace    none
// @version      2
// @description  idk
// @author       _VcrazY_
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471990/Shadow%20visual%20and%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/471990/Shadow%20visual%20and%20more.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ctxx = CanvasRenderingContext2D;

    if (ctxx.prototype.roundRect) {
        ctxx.prototype.roundRect = ((func) => function() {
            if (this.fillStyle === "#8ecc51") { // Allies (green)
                this.fillStyle = "rgba(39, 174, 96, 0.7)"; // Bright green with slight transparency
            } else if (this.fillStyle === "#cc5151") { // Enemies (red)
                this.fillStyle = "rgba(231, 76, 60, 0.7)"; // Bright red with slight transparency
            } else if (this.fillStyle === "#3d3f42") { // Health bar background (gray)
                this.fillStyle = "rgba(66, 66, 66, 0.7)"; // Dark gray with slight transparency
            }

            // Add stylized drop shadow
            this.shadowColor = "rgba(0, 0, 0, 0.8)"; // Black shadow, more intense and slightly transparent
            this.shadowBlur = 20; // Increased shadow blur for a more pronounced shadow
            this.shadowOffsetX = 15; // Increased horizontal shadow offset
            this.shadowOffsetY = 15; // Increased vertical shadow offset

            // Call the modified roundRect function with the passed arguments
            return (func.call(this, ...arguments));
        })(ctxx.prototype.roundRect);
    }

    var fadingspeed = 20; // Faster color transition speed
    var d = 0;

    function e(n, o) {
        (o = void 0 === o ? d : o),
        (document.getElementById(n).style["background-color"] =
            "hsl(" + o + ", 100%, 90%)"); // Bright colors with high saturation
    }

    setInterval(function () {
        e("ageBarBody"), d = (d + 45) % 360; // Increase by 45 for even faster transition
    }, fadingspeed);
})();
