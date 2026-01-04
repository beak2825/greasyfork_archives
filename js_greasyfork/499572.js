// ==UserScript==
// @name         Diep.io Crosshair V3
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replaces default cursor with grey circle to improve aim I guess. May not work for some people.
// @author       Dust_Strifer
// @match        https://diep.io/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499572/Diepio%20Crosshair%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/499572/Diepio%20Crosshair%20V3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // create the circle element
    const crosshair = document.createElement('div');
    crosshair.id = 'custom-crosshair';
    crosshair.style.position = 'fixed';
    crosshair.style.width = '20px';
    crosshair.style.height = '20px';
    crosshair.style.backgroundColor = 'transparent';
    crosshair.style.border = '2px solid #333';
    crosshair.style.borderRadius = '50%';
    crosshair.style.pointerEvents = 'none';
    crosshair.style.zIndex = '10000';
    crosshair.style.display = 'none';

    // append the crosshair to the body
    document.body.appendChild(crosshair);

    // function to update circle position
    function updateCrosshairPosition(event) {
        crosshair.style.left = event.clientX - 10 + 'px';
        crosshair.style.top = event.clientY - 10 + 'px';
    }

    // show circle when mouse is over the game canvas
    document.addEventListener('mousemove', function(event) {
        if (event.target.tagName === 'CANVAS') {
            crosshair.style.display = 'block';
            updateCrosshairPosition(event);
        } else {
            crosshair.style.display = 'none';
        }
    });

    // add a CSS rule to hide the cursor for the game canvas
    const styles = `
      canvas {
        cursor: none !important;
      }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerHTML = styles;
    document.head.appendChild(styleSheet);
})();