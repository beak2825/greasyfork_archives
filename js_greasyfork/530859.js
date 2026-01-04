// ==UserScript==
// @name         button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ASCII art and alerts
// @author       no
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530859/button.user.js
// @updateURL https://update.greasyfork.org/scripts/530859/button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('button');
    button.innerText = 'pointless button';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    document.body.appendChild(button);

    button.addEventListener('click', function() {
        const frames = [
            "ASCII Frame 1",
            "ASCII Frame 2",
            "ASCII Frame 3",
            // Add more frames as needed
        ];

        let index = 0;
        const playFrame = () => {
            if (index < frames.length) {
                alert(frames[index]);
                index++;
                setTimeout(playFrame, 1000); // Adjust the timing as needed
            }
        };
        playFrame();
    });
})();
