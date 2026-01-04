// ==UserScript==
// @name         Narrow one dot crosshair
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a cool little dot crosshair to the center of the screen.
// @author       Evan
// @match        https://narrow.one/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534606/Narrow%20one%20dot%20crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/534606/Narrow%20one%20dot%20crosshair.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const dot = document.createElement('div');
    dot.style.position = 'fixed';
    dot.style.top = '50%';
    dot.style.left = '50%';
    dot.style.transform = 'translate(-50%, -50%)';
    dot.style.width = '7px';
    dot.style.height = '7px';
    dot.style.borderRadius = '50%';
    dot.style.backgroundColor = 'white';
    dot.style.border = '1px solid black';
    dot.style.pointerEvents = 'none';
 
    document.body.appendChild(dot);
})();
