// ==UserScript==
// @name         Dropout Hide Controls
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Hide playback controls when mouse is away
// @author       l4sgc
// @match        https://embed.vhx.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dropout.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468413/Dropout%20Hide%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/468413/Dropout%20Hide%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var element, timer;

    function onMouseover() {
        element.style.transition = '0s';
        element.style.opacity = 1;
        if (timer) clearTimeout(timer);
    }

    function onMouseleave() {
        element.style.transition = '2s';
        element.style.opacity = 0;
    }

    function findControls() {
        try {
            let query = document.querySelector('[aria-label="Play"]');
            if (!query) {
                setTimeout(findControls, 500);
                return;
            }

            element = query.parentNode.parentNode;
            element.addEventListener('mouseover', onMouseover);
            element.addEventListener('mouseleave', () => {
                timer = setTimeout(onMouseleave, 1000);
            });
        } catch (x) {
            console.log(x);
        }
    }

    setTimeout(findControls, 500);
})();