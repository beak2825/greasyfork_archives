// ==UserScript==
// @name         Youtube Zoomer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows zooming in/out for YouTube videos; use ctrl+up/down
// @author       k4rli
// @match        *://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394139/Youtube%20Zoomer.user.js
// @updateURL https://update.greasyfork.org/scripts/394139/Youtube%20Zoomer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class ZoomHandler {

        currentZoom = 1.0;

        static ZOOM = {
            IN: 'IN',
            OUT: 'OUT',
        };

        updateVideoZoom = () => {
            const video = document.querySelector('video');
            const properties = [
                'transform',
                '-ms-transform',
                '-o-transform',
                '-webkit-transform',
                '-moz-transform',
            ];
            properties.forEach((prop) => video.style
                .setProperty(prop, `scale(${this.currentZoom})`)
            );
        }

        zoom = (option) => {
            const prevZoom = this.currentZoom;
            switch (option) {
                case ZoomHandler.ZOOM.IN:
                    this.currentZoom += 0.1;
                    break;
                case ZoomHandler.ZOOM.OUT:
                    this.currentZoom -= 0.1;
                    break;
                default:
                    break;
            }
            if (this.currentZoom < 0.1 || this.currentZoom > 10.0) {
                this.currentZoom = prevZoom;
            } else {
                this.updateVideoZoom();
            }
        }
    }

    const zoomHandlerInstance = new ZoomHandler();

    window.addEventListener('keydown', ({
        ctrlKey,
        keyCode
    }) => {
        if (ctrlKey) {
            switch (keyCode) {
                case 38: // arrow up
                    zoomHandlerInstance.zoom(ZoomHandler.ZOOM.IN);
                    break;
                case 40: // arrow down
                    zoomHandlerInstance.zoom(ZoomHandler.ZOOM.OUT);
                    break;
                default:
                    break;
            }
        }
    });
})();