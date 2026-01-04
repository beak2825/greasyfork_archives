// ==UserScript==
// @name         Modify Next Button Class
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This will make it so on the boat slide you can always click the next arrow.
// @author       nobody_272
// @match        https://cdn.kencookpartners.com/courseplayer/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495667/Modify%20Next%20Button%20Class.user.js
// @updateURL https://update.greasyfork.org/scripts/495667/Modify%20Next%20Button%20Class.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findAndModifyButtonInIframes() {
        let win = window;

        const iframePath = ['course-frame', 'scormdriver_content'];

        for (const iframeId of iframePath) {
            const iframe = win.document.getElementById(iframeId);
            if (iframe && iframe.contentWindow) {
                win = iframe.contentWindow;
            } else {
                console.log('Failed to access iframe:', iframeId);
                return;
            }
        }

        try {
            const forwardButton = win.document.getElementById('forwardButton');
            if (forwardButton && forwardButton.classList.contains('disabled')) {
                forwardButton.className = 'navbar-link';
                console.log('Button class modified to:', forwardButton.className);
            } else {
                console.log('Button not found or not disabled');
            }
        } catch (e) {
            console.error('Error modifying button:', e);
        }
    }

    setInterval(findAndModifyButtonInIframes, 2000);

    window.addEventListener('load', findAndModifyButtonInIframes);
})();