// ==UserScript==
// @name         Fullscreen Map
// @namespace    bennoghg
// @match        https://map-making.app/*
// @grant        none
// @version      1.2.1
// @author       BennoGHG
// @license MIT
// @description  Fullscreen Map with 'M'
// @downloadURL https://update.greasyfork.org/scripts/536736/Fullscreen%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/536736/Fullscreen%20Map.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isTyping() {
        const el = document.activeElement;
        return el && (
            el.tagName === 'INPUT' ||
            el.isContentEditable
        );
    }

    document.addEventListener('keydown', e => {
        if (e.repeat || e.key.toLowerCase() !== 'm' || isTyping()) return;

        const fsElem = document.fullscreenElement;
        if (fsElem) {
            document.exitFullscreen();
        } else {
            const mapContainer = document.querySelector('.gm-style')?.parentElement;
            if (mapContainer?.requestFullscreen) {
                mapContainer.requestFullscreen();
            }
        }
    });
})();