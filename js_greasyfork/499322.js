// ==UserScript==
// @name        Fullscreen Stream Embed Fix
// @namespace   Violentmonkey Scripts
// @match       https://www.destiny.gg/bigscreen
// @grant       none
// @version     1.1.1
// @author      777mmHg
// @description removes the new retarded ass embeds on bigscreen that places streams in a tiny box
// @license     GNU General Public License, version 2
// @downloadURL https://update.greasyfork.org/scripts/499322/Fullscreen%20Stream%20Embed%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/499322/Fullscreen%20Stream%20Embed%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeStreamControls() {
        const streamControls = document.querySelector('.stream-controls');
        if (streamControls) {
            streamControls.remove();
        }
    }

    function setStreamWrapStyles() {
        const streamWrap = document.querySelector('.stream-panel__wrap');
        if (streamWrap) {
            streamWrap.style.padding = '0';
            streamWrap.style.backgroundColor = 'transparent';
        }
    }

    function applyCustomizations() {
        removeStreamControls();
        setStreamWrapStyles();
    }

    // Run the functions when the page is fully loaded
    window.addEventListener('load', applyCustomizations);

    // Run the functions when the hash changes
    window.addEventListener('hashchange', applyCustomizations);

})();
