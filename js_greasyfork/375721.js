// ==UserScript==
// @name         Trickshot1
// @author       gay
// @description  nothing here!
// @version      beta 2.0
// @match        *://diep.io/*
// @grant        none
// @namespace https://greasyfork.org/users/176941
// @downloadURL https://update.greasyfork.org/scripts/375721/Trickshot1.user.js
// @updateURL https://update.greasyfork.org/scripts/375721/Trickshot1.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var mouse;
    function trickshot() {
        //console.log(mouse.x, -mouse.x + window.innerWidth, mouse.y, -mouse.y + window.innerHeight);
        input.mouse(-mouse.x + window.innerWidth, -mouse.y + window.innerHeight);
        canvas.dispatchEvent(new MouseEvent('mousedown', { 'clientX': -mouse.x + window.innerWidth, 'clientY': -mouse.y + window.innerHeight, 'button': 0, 'mozPressure' : 1.0 }));
        setTimeout(() => {
            canvas.dispatchEvent(new MouseEvent('mouseup', { 'clientX': -mouse.x + window.innerWidth, 'clientY': -mouse.y + window.innerHeight, 'button': 0, 'mozPressure' : 1.0 }));
            setTimeout(() => {input.mouse(mouse.x, mouse.y)}, 100);
        }, 100);
    }

    document.addEventListener('mousemove', function(e) {
		mouse = { x: e.clientX, y: e.clientY };
    });

    document.addEventListener('mousedown', function(e) {
		var button = e.button;
        if(button == 2 && document.getElementById('a').style.display === 'none') {
            trickshot();
        }
    });

})();