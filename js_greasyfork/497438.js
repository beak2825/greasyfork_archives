// ==UserScript==
// @name         mobile line battledudes.io
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  this script adds a line like mobile battledudes.io
// @author       blahblah
// @match        *://*.battledudes.io/*
// @license      MIT
// @icon         https://sun9-74.userapi.com/impg/6jY26kEuZ0qU5I9x7mdBOdQ2zA8pG8H9s3AkDw/BTLz1oDKei0.jpg?size=604x340&quality=96&sign=9fe860f5ff054a01d1ffef1c2f9c79fb&type=album
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497438/mobile%20line%20battledudesio.user.js
// @updateURL https://update.greasyfork.org/scripts/497438/mobile%20line%20battledudesio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var aimLine = document.createElement('div');
    aimLine.style.position = 'fixed';
    aimLine.style.width = '750px';
    aimLine.style.height = '3px';
    aimLine.style.backgroundColor = 'transparent';
    aimLine.style.backgroundImage = 'linear-gradient(to right, rgba(255, 255, 255, 0.5) 50%, transparent 50%)';
    aimLine.style.backgroundSize = '190px 4px';
    aimLine.style.zIndex = '9999';
    aimLine.style.transformOrigin = 'top left';
    aimLine.style.pointerEvents = 'none';
    aimLine.style.opacity = '0.5';

    document.body.appendChild(aimLine);

    function updateAimLine(event) {
        var centerX = window.innerWidth / 2;
        var centerY = window.innerHeight / 2;

        var mouseX = event.clientX;
        var mouseY = event.clientY;

        var angle = Math.atan2(mouseY - centerY, mouseX - centerX) * 180 / Math.PI;

        aimLine.style.left = centerX + 'px';
        aimLine.style.top = centerY + 'px';
        aimLine.style.transform = `rotate(${angle}deg)`;
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'l') {
            aimLine.style.display = aimLine.style.display === 'none' ? 'block' : 'none';
        }
    });

    document.addEventListener('mousemove', updateAimLine);

    aimLine.style.display = 'block';
})();
