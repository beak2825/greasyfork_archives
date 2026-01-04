// ==UserScript==
// @name         Nickname Style Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change the style of your nickname in Agma!
// @author       Samira
// @match        https://agma.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418515/Nickname%20Style%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/418515/Nickname%20Style%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.setTimeout(function() {
        var nickname = null;

        $('#playBtn').click(function() {
            nickname = ' ' + $('#nick').val() + ' ';
        });

        var originalStrokeText = CanvasRenderingContext2D.prototype.strokeText;
        CanvasRenderingContext2D.prototype.strokeText = function(text, x, y, maxWidth) {
            if (text === nickname) {
                this.strokeStyle = '#656565';
            }
            return originalStrokeText.apply(this, arguments);
        }

        var originalFillText = CanvasRenderingContext2D.prototype.fillText;
        CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
            if (text === nickname) {
                this.fillStyle = '#111';
            }
            return originalFillText.apply(this, arguments);
        }


    }, 1000);

})();