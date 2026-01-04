// ==UserScript==
// @name         Light Blue Trail with Comic Sans
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Light blue trail follows mouse, page in Comic Sans
// @author       You
// @match        *://*/*
// @grant        none
// @license mit
// @downloadURL https://update.greasyfork.org/scripts/527486/Light%20Blue%20Trail%20with%20Comic%20Sans.user.js
// @updateURL https://update.greasyfork.org/scripts/527486/Light%20Blue%20Trail%20with%20Comic%20Sans.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change font to Comic Sans
    document.body.style.fontFamily = 'Comic Sans MS, Comic Sans, cursive';

    function createTrail(e) {
        const dot = document.createElement('div');
        dot.style.position = 'fixed';
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.backgroundColor = 'lightblue';
        dot.style.borderRadius = '50%';
        dot.style.opacity = '1';
        dot.style.transition = 'opacity 1s, transform 1s';
        
        document.body.appendChild(dot);

        setTimeout(() => {
            dot.style.opacity = '0';
            dot.style.transform = `translateY(-10px)`;
            setTimeout(() => {
                dot.remove();
            }, 1000);
        }, 0);
    }

    document.addEventListener('mousemove', createTrail);
})();