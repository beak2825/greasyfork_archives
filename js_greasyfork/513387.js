// ==UserScript==
// @namespace    blue-crosshair
// @license      MIT
// @name         Blue crosshair
// @description  Blue crosshair for .io fps games
// @version      1.0.1
// @author       Foxitixation
// @match        https://krunker.io/
// @match        https://deadshot.io/
// @match        https://sv.browserfps.com/
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/513387/Blue%20crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/513387/Blue%20crosshair.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        try {
            var verticalLine = document.createElement('div');
            verticalLine.style.cssText = 'width:2px;height:20px;background-color:#0099cc;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);z-index:200';

            var horizontalLine = document.createElement('div');
            horizontalLine.style.cssText = 'width:20px;height:2px;background-color:#0099cc;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);z-index:200';

            document.body.appendChild(verticalLine);
            document.body.appendChild(horizontalLine);
        } catch (e) { }
    });
})();