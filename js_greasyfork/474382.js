// ==UserScript==
// @name         Button Display Notification
// @namespace    Turkeychopio
// @match        http://127.0.0.1:7860/
// @grant        GM_notification
// @version 1.1
// @description  Will send a windows notification when you images are finished generating
// @downloadURL https://update.greasyfork.org/scripts/474382/Button%20Display%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/474382/Button%20Display%20Notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

        let currentStyle = '';
        let previousStyle = '';

    // Check for button with specific class and style
    setInterval(function() {
        const button = document.querySelector('.lg.secondary.gradio-button.generate-box-skip.svelte-1ipelgc');
        currentStyle = window.getComputedStyle(button).display;
//        console.log("currentStyle = " + currentStyle);
//        console.log("previous style = " + previousStyle);

        if (previousStyle === 'block' && currentStyle === 'none') {
            GM_notification ( {title: 'A111', text: 'Image Generation Complete', image: 'chrome://favicon/http://127.0.0.1:7860/', timeout: 1000} );
        }
        previousStyle = currentStyle;
    }, 2000); // Check every 2 second (adjust as needed)
})();