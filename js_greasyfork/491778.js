// ==UserScript==
// @name         Mouse Line Aimer for zombsroyale.io
// @namespace    JonJon565
// @version      1.0
// @description  Creates a line that follows the mouse
// @author       JonJon565|IGN:911
// @match        https://zombsroyale.io/
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491778/Mouse%20Line%20Aimer%20for%20zombsroyaleio.user.js
// @updateURL https://update.greasyfork.org/scripts/491778/Mouse%20Line%20Aimer%20for%20zombsroyaleio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var line = document.createElement('div');
    line.id = 'cursor-line';
    document.body.appendChild(line);

    GM_addStyle(`
        #cursor-line {
            display: none; /* Initially hide the line */
            position: fixed;
            top: 50%;
            left: 50%;
            width: 150px; /* Set line thickness */
            height: 3px;
            background-color: black;
            z-index: 9999;
            transform-origin: 0 0; /* Set transform origin to top left corner */
        }
    `);
    document.addEventListener('mousemove', function(event) {
        var line = document.getElementById('cursor-line');
        var centerX = window.innerWidth / 2;
        var centerY = window.innerHeight / 2;
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        var deltaX = mouseX - centerX;
        var deltaY = mouseY - centerY;
        var angle = Math.atan2(deltaY, deltaX);
        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        line.style.transform = 'translate(0%, 0%) rotate(' + angle + 'rad)';
        line.style.width = distance + 'px';
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === '-') {
            var line = document.getElementById('cursor-line');
            line.style.display = (line.style.display === 'none') ? 'block' : 'none';
        }
    });
})();
